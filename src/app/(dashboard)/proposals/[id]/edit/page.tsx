import { eq, and, isNull } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { getDb } from '@/lib/db'
import { proposals, proposalItems, clients } from '@/lib/db/schema'
import ProposalEditor from '@/components/ProposalEditor'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function ProposalEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)
  const db = getDb()

  const [proposal] = await db
    .select()
    .from(proposals)
    .where(eq(proposals.id, id))
    .limit(1)

  if (!proposal) notFound()

  const [client] = await db
    .select({ name: clients.name, serviceType: clients.serviceType })
    .from(clients)
    .where(and(eq(clients.id, proposal.clientId), isNull(clients.archivedAt)))
    .limit(1)

  if (!client) notFound()

  const items = await db
    .select()
    .from(proposalItems)
    .where(eq(proposalItems.proposalId, id))
    .orderBy(proposalItems.sortOrder)

  const serialized = {
    id: proposal.id,
    title: proposal.title,
    status: proposal.status,
    coverNote: proposal.coverNote,
    termsText: proposal.termsText,
    items: items.map((i) => ({
      section: i.section,
      description: i.description,
      amount: i.amount,
      frequency: i.frequency,
      sortOrder: i.sortOrder,
    })),
  }

  return (
    <ProposalEditor
      proposal={serialized}
      serviceType={client.serviceType}
      clientName={client.name}
      clientId={proposal.clientId}
    />
  )
}
