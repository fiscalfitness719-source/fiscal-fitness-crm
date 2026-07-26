import { isNull } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { clients } from '@/lib/db/schema'
import KanbanBoard from '@/components/KanbanBoard'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const db = getDb()
  const allClients = await db
    .select({
      id: clients.id,
      name: clients.name,
      serviceType: clients.serviceType,
      websiteStage: clients.websiteStage,
      bookkeepingStage: clients.bookkeepingStage,
      contractValue: clients.contractValue,
      email: clients.email,
    })
    .from(clients)
    .where(isNull(clients.archivedAt))

  return <KanbanBoard clients={allClients} />
}
