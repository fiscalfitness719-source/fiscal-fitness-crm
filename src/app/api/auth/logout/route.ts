export const runtime = 'edge'

export async function POST() {
  const response = Response.json({ ok: true })
  const headers = new Headers(response.headers)
  headers.set(
    'Set-Cookie',
    'auth_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  )
  return new Response(response.body, { status: 200, headers })
}
