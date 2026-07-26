import { eq, asc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { stageHistory } from '@/lib/db/schema'

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
      .from(stageHistory)
      .where(eq(stageHistory.clientId, id))
      .orderBy(asc(stageHistory.movedAt))
    return Response.json(rows)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
