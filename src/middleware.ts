import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './lib/auth'

const PUBLIC = [
  '/login',
  '/api/auth/login',
  '/api/auth/member-login',
  '/api/leads',
  '/api/assessment',
  '/api/checkout',
  '/api/webhooks/stripe',
  '/members/login',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (pathname.startsWith('/members/')) {
      return NextResponse.redirect(new URL('/members/login', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const payload = await verifyToken(token)
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (pathname.startsWith('/members/')) {
      const res = NextResponse.redirect(new URL('/members/login', request.url))
      res.cookies.delete('auth_token')
      return res
    }
    const res = NextResponse.redirect(new URL('/login', request.url))
    res.cookies.delete('auth_token')
    return res
  }

  // Members can only access /members/* routes
  if (payload.role === 'member' && !pathname.startsWith('/members/')) {
    return NextResponse.redirect(new URL('/members/curriculum', request.url))
  }

  // Admins cannot access /members/* routes (they use the full CRM)
  if (payload.role === 'admin' && pathname.startsWith('/members/')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
