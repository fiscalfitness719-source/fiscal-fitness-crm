import { eq, asc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { clientTasks } from '@/lib/db/schema'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const db = getDb()
    const tasks = await db
      .select()
      .from(clientTasks)
      .where(eq(clientTasks.clientId, id))
      .orderBy(asc(clientTasks.stageCode), asc(clientTasks.createdAt))
    return Response.json(tasks)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// PATCH — toggle a task's completed state
// Body: { taskId: number, completed: boolean }
export async function PATCH(
  request: Request,
  _context: { params: Promise<{ id: string }> }
) {
  try {
    const { taskId, completed } = await request.json()
    const db = getDb()
    const [updated] = await db
      .update(clientTasks)
      .set({
        completed,
        completedAt: completed ? new Date() : null,
      })
      .where(eq(clientTasks.id, Number(taskId)))
      .returning()

    if (!updated) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(updated)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
