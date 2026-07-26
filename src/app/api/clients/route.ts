import { isNull, asc, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { clients, clientTasks, stageHistory, checklistTemplates } from '@/lib/db/schema'

export const runtime = 'edge'

export async function GET() {
  try {
    const db = getDb()
    const rows = await db
      .select()
      .from(clients)
      .where(isNull(clients.archivedAt))
      .orderBy(asc(clients.createdAt))
    return Response.json(rows)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, serviceType, contractValue, startDate } = body

    if (!name || !serviceType) {
      return Response.json({ error: 'name and serviceType are required' }, { status: 400 })
    }

    const websiteStage =
      serviceType === 'website' || serviceType === 'both' ? '1' : null
    const bookkeepingStage =
      serviceType === 'bookkeeping' || serviceType === 'both' ? '1' : null

    const db = getDb()
    const [client] = await db
      .insert(clients)
      .values({
        name,
        email: email || null,
        phone: phone || null,
        serviceType,
        websiteStage,
        bookkeepingStage,
        contractValue: contractValue ? String(contractValue) : null,
        startDate: startDate || null,
      })
      .returning()

    // Seed initial tasks for stage '1' (shared — one set regardless of service type)
    const templates = await db
      .select()
      .from(checklistTemplates)
      .where(eq(checklistTemplates.stageCode, '1'))
      .orderBy(asc(checklistTemplates.sortOrder))

    if (templates.length > 0) {
      await db.insert(clientTasks).values(
        templates.map((t) => ({
          clientId: client.id,
          stageCode: '1',
          taskText: t.taskText,
        }))
      )
    }

    // Record initial stage history per track
    const tracks: { serviceTrack: string; toStage: string }[] = []
    if (websiteStage) tracks.push({ serviceTrack: 'website', toStage: '1' })
    if (bookkeepingStage) tracks.push({ serviceTrack: 'bookkeeping', toStage: '1' })

    if (tracks.length > 0) {
      await db.insert(stageHistory).values(
        tracks.map((t) => ({
          clientId: client.id,
          serviceTrack: t.serviceTrack,
          fromStage: null,
          toStage: t.toStage,
        }))
      )
    }

    return Response.json(client, { status: 201 })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
