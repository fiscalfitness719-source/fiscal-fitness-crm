import { eq, desc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { followUps } from '@/lib/db/schema'

export const runtime = 'edge'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  const rows = await db
    .select()
    .from(followUps)
    .where(eq(followUps.clientId, Number(id)))
    .orderBy(desc(followUps.createdAt))
  return Response.json(rows)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { type, content } = await request.json()
  if (!type || !content?.trim()) {
    return Response.json({ error: 'Missing fields' }, { status: 400 })
  }
  const db = getDb()
  const [row] = await db
    .insert(followUps)
    .values({ clientId: Number(id), type, content })
    .returning()
  return Response.json(row, { status: 201 })
}
