import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { proposals, proposalItems } from '@/lib/db/schema'

export const runtime = 'edge'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, Number(id)))
    .limit(1)

  if (!proposal) return Response.json({ error: 'Not found' }, { status: 404 })

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposalId, Number(id)))
    .orderBy(proposalItems.sortOrder)

  return Response.json({ ...proposal, items })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const proposalId = Number(id)
  const { title, status, coverNote, termsText, items } = await request.json()

  const db = getDb()

  const [updated] = await db
    .update(proposals)
    .set({
      title,
      status,
      coverNote: coverNote || null,
      termsText: termsText || null,
      updatedAt: new Date(),
    })
    .where(eq(proposals.id, proposalId))
    .returning()

  if (!updated) return Response.json({ error: 'Not found' }, { status: 404 })

  // Full replace of items
  await db.delete(proposalItems).where(eq(proposalItems.proposalId, proposalId))

  if (Array.isArray(items) && items.length > 0) {
    await db.insert(proposalItems).values(
      items.map((item: { section: string; description: string; amount?: string | null; frequency?: string | null; sortOrder: number }, i: number) => ({
        proposalId,
        section: item.section,
        description: item.description,
        amount: item.amount || null,
        frequency: item.frequency || null,
        sortOrder: item.sortOrder ?? i,
      }))
    )
  }

  return Response.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  await db.delete(proposals).where(eq(proposals.id, Number(id)))
  return Response.json({ ok: true })
}
