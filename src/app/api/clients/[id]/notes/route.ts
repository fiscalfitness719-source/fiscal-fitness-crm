import { eq, desc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { notes } from '@/lib/db/schema'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const db = getDb()
    const rows = await db
      .select()
      .from(notes)
      .where(eq(notes.clientId, id))
      .orderBy(desc(notes.createdAt))
    return Response.json(rows)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const { content } = await request.json()

    if (!content?.trim()) {
      return Response.json({ error: 'content is required' }, { status: 400 })
    }

    const db = getDb()
    const [note] = await db
      .insert(notes)
      .values({ clientId: id, content: content.trim() })
      .returning()

    return Response.json(note, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
