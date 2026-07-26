import { eq, and, isNull } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { clients } from '@/lib/db/schema'

export const runtime = 'edge'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const db = getDb()
    const [client] = await db
      .select()
      .from(clients)
      .where(and(eq(clients.id, id), isNull(clients.archivedAt)))
      .limit(1)

    if (!client) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json(client)
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const body = await request.json()
    const { name, email, phone, contractValue, startDate } = body

    const db = getDb()
    const [updated] = await db
      .update(clients)
      .set({
        name: name ?? undefined,
        email: email !== undefined ? (email || null) : undefined,
        phone: phone !== undefined ? (phone || null) : undefined,
        contractValue:
          contractValue !== undefined
            ? contractValue
              ? String(contractValue)
              : null
            : undefined,
        startDate: startDate !== undefined ? (startDate || null) : undefined,
        updatedAt: new Date(),
      })
      .where(eq(clients.id, id))
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = Number(idStr)
    const db = getDb()
    await db
      .update(clients)
      .set({ archivedAt: new Date(), updatedAt: new Date() })
      .where(eq(clients.id, id))

    return Response.json({ ok: true })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
