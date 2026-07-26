import { eq, desc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { clients, proposals, proposalItems } from '@/lib/db/schema'
import { defaultScopeForServiceType, DEFAULT_TERMS } from '@/lib/proposal-defaults'

export const runtime = 'edge'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const db = getDb()
  const rows = await db
    .select({
      id: proposals.id,
      title: proposals.title,
      status: proposals.status,
      createdAt: proposals.createdAt,
      updatedAt: proposals.updatedAt,
    })
    .from(proposals)
    .where(eq(proposals.clientId, Number(id)))
    .orderBy(desc(proposals.createdAt))
  return Response.json(rows)
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const clientId = Number(id)
  const db = getDb()

  const [client] = await db
    .select({ name: clients.name, serviceType: clients.serviceType })
    .from(clients)
    .where(eq(clients.id, clientId))
    .limit(1)

  if (!client) return Response.json({ error: 'Client not found' }, { status: 404 })

  const [proposal] = await db
    .insert(proposals)
    .values({
      clientId,
      title: `Proposal for ${client.name}`,
      termsText: DEFAULT_TERMS,
    })
    .returning()

  const scopeDefaults = defaultScopeForServiceType(client.serviceType)
  if (scopeDefaults.length > 0) {
    await db.insert(proposalItems).values(
      scopeDefaults.map((description, i) => ({
        proposalId: proposal.id,
        section: 'scope',
        description,
        sortOrder: i,
      }))
    )
  }

  return Response.json({ id: proposal.id }, { status: 201 })
}
