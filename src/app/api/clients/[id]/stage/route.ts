import { eq, asc, and } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { clients, stageHistory, clientTasks, checklistTemplates } from '@/lib/db/schema'
import { SHARED_STAGE_CODES } from '@/lib/stages'

export const runtime = 'edge'

// PATCH /api/clients/[id]/stage
// Body: { serviceTrack: 'website' | 'bookkeeping', newStage: string }
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const { serviceTrack, newStage } = await request.json()

    if (!serviceTrack || !newStage) {
      return Response.json(
        { error: 'serviceTrack and newStage required' },
        { status: 400 }
      )
    }

    const db = getDb()
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1)

    if (!client) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }

    const fromStage =
      serviceTrack === 'website' ? client.websiteStage : client.bookkeepingStage

    const isBoth = client.serviceType === 'both'
    const isShared = SHARED_STAGE_CODES.has(newStage)
    const now = new Date()

    let updateData: Record<string, unknown>
    let historyTrack: string

    if (isBoth && isShared) {
      updateData = { websiteStage: newStage, bookkeepingStage: newStage, updatedAt: now }
      historyTrack = 'shared'
    } else if (serviceTrack === 'website') {
      updateData = { websiteStage: newStage, updatedAt: now }
      historyTrack = 'website'
    } else {
      updateData = { bookkeepingStage: newStage, updatedAt: now }
      historyTrack = 'bookkeeping'
    }

    await db.update(clients).set(updateData).where(eq(clients.id, id))

    await db.insert(stageHistory).values({
      clientId: id,
      serviceTrack: historyTrack,
      fromStage: fromStage ?? null,
      toStage: newStage,
    })

    // Only seed tasks if none exist yet for this stage (prevents duplicates on re-entry)
    const existing = await db
      .select({ id: clientTasks.id })
      .from(clientTasks)
      .where(and(eq(clientTasks.clientId, id), eq(clientTasks.stageCode, newStage)))
      .limit(1)

    if (existing.length === 0) {
      const templates = await db
        .select()
        .from(checklistTemplates)
        .where(eq(checklistTemplates.stageCode, newStage))
        .orderBy(asc(checklistTemplates.sortOrder))

      if (templates.length > 0) {
        await db.insert(clientTasks).values(
          templates.map((t) => ({
            clientId: id,
            stageCode: newStage,
            taskText: t.taskText,
          }))
        )
      }
    }

    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
