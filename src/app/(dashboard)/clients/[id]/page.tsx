import { eq, asc, desc, and, isNull } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDb } from '@/lib/db'
import {
  clients,
  clientTasks,
  notes as notesTable,
  stageHistory,
  followUps as followUpsTable,
} from '@/lib/db/schema'
import {
  getStage,
  serviceTypeBadgeColor,
  serviceTypeLabel,
  stageTrackColor,
  type ServiceType,
} from '@/lib/stages'
import TaskChecklist from '@/components/TaskChecklist'
import NotesList from '@/components/NotesList'
import StageHistory from '@/components/StageHistory'
import StageAdvancer from '@/components/StageAdvancer'
import ClientForm from '@/components/ClientForm'
import ClientDetailTabs from '@/components/ClientDetailTabs'
import ArchiveDeleteButtons from '@/components/ArchiveDeleteButtons'
import FollowUpsList from '@/components/FollowUpsList'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: idStr } = await params
  const id = Number(idStr)

  const db = getDb()
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), isNull(clients.archivedAt)))
    .limit(1)

  if (!client) notFound()

  const [tasks, notes, history, followUps] = await Promise.all([
    db
      .select()
      .from(clientTasks)
      .where(eq(clientTasks.clientId, id))
      .orderBy(asc(clientTasks.stageCode), asc(clientTasks.createdAt)),
    db
      .select()
      .from(notesTable)
      .where(eq(notesTable.clientId, id))
      .orderBy(desc(notesTable.createdAt)),
    db
      .select()
      .from(stageHistory)
      .where(eq(stageHistory.clientId, id))
      .orderBy(asc(stageHistory.movedAt)),
    db
      .select()
      .from(followUpsTable)
      .where(eq(followUpsTable.clientId, id))
      .orderBy(desc(followUpsTable.createdAt)),
  ])

  const serviceType = client.serviceType as ServiceType

  // Determine which stage codes are "current" for the task checklist
  const activeStages = Array.from(
    new Set(
      [client.websiteStage, client.bookkeepingStage].filter(Boolean) as string[]
    )
  )

  // Stage badges for the header
  const stageLabels: { code: string; name: string; track: string }[] = []
  if (client.websiteStage && (serviceType === 'website' || serviceType === 'both')) {
    const s = getStage(client.websiteStage)
    const track =
      serviceType === 'both' && client.websiteStage === client.bookkeepingStage
        ? 'shared'
        : 'website'
    stageLabels.push({ code: client.websiteStage, name: s?.name ?? client.websiteStage, track })
  }
  if (serviceType === 'both' && client.bookkeepingStage && client.bookkeepingStage !== client.websiteStage) {
    const s = getStage(client.bookkeepingStage)
    stageLabels.push({ code: client.bookkeepingStage, name: s?.name ?? client.bookkeepingStage, track: 'bookkeeping' })
  }
  if (serviceType === 'bookkeeping' && client.bookkeepingStage) {
    const s = getStage(client.bookkeepingStage)
    stageLabels.push({ code: client.bookkeepingStage, name: s?.name ?? client.bookkeepingStage, track: 'bookkeeping' })
  }

  const activeTasks = tasks.filter((t) => activeStages.includes(t.stageCode))
  const openTasks = activeTasks.filter((t) => !t.completed).length

  // Serialize dates for client component boundaries
  const serializedTasks = tasks.map((t) => ({
    id: t.id,
    stageCode: t.stageCode,
    taskText: t.taskText,
    completed: t.completed,
    completedAt: t.completedAt?.toISOString() ?? null,
    createdAt: t.createdAt.toISOString(),
  }))

  const serializedNotes = notes.map((n) => ({
    id: n.id,
    content: n.content,
    createdAt: n.createdAt.toISOString(),
  }))

  const serializedHistory = history.map((h) => ({
    id: h.id,
    serviceTrack: h.serviceTrack,
    fromStage: h.fromStage,
    toStage: h.toStage,
    movedAt: h.movedAt.toISOString(),
  }))

  const serializedFollowUps = followUps.map((f) => ({
    id: f.id,
    type: f.type,
    content: f.content,
    createdAt: f.createdAt.toISOString(),
  }))

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
          ← Pipeline
        </Link>
      </div>

      {/* Client header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 truncate">{client.name}</h1>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${serviceTypeBadgeColor(serviceType)}`}
              >
                {serviceTypeLabel(serviceType)}
              </span>

              {stageLabels.map((sl) => (
                <span
                  key={`${sl.code}-${sl.track}`}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${stageTrackColor(
                    sl.track as 'website' | 'bookkeeping' | 'shared'
                  )}`}
                >
                  Stage {sl.code}: {sl.name}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
              {client.emailNotObtained ? (
                <span className="text-slate-400 italic">Email not obtained</span>
              ) : client.email ? (
                <span>{client.email}</span>
              ) : null}
              {client.phone && <span>{client.phone}</span>}
              {client.contractValue && (
                <span>${Number(client.contractValue).toLocaleString()}/yr</span>
              )}
              {client.startDate && <span>Started {client.startDate}</span>}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-2xl font-bold text-slate-800">
              {tasks.filter((t) => t.completed).length}
              <span className="text-base font-normal text-slate-400">
                /{tasks.length}
              </span>
            </div>
            <div className="text-xs text-slate-400">tasks done</div>
          </div>
        </div>
      </div>

      {/* Tabbed detail */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <ClientDetailTabs
          tabs={[
            {
              id: 'overview',
              label: 'Overview',
              content: (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Edit Details</h2>
                    <ClientForm
                      mode="edit"
                      initial={{
                        id: client.id,
                        name: client.name,
                        email: client.email ?? '',
                        emailNotObtained: client.emailNotObtained,
                        phone: client.phone ?? '',
                        serviceType: client.serviceType,
                        contractValue: client.contractValue ?? '',
                        startDate: client.startDate ?? '',
                      }}
                    />
                  </section>

                  <section>
                    <h2 className="text-sm font-semibold text-slate-700 mb-4">Move Stage</h2>
                    <StageAdvancer client={client} />
                  </section>

                  <section className="pt-4 border-t border-slate-100">
                    <ArchiveDeleteButtons clientId={client.id} />
                  </section>
                </div>
              ),
            },
            {
              id: 'tasks',
              label: `Tasks (${openTasks} open)`,
              content: (
                <TaskChecklist
                  clientId={client.id}
                  tasks={serializedTasks}
                  activeStages={activeStages}
                />
              ),
            },
            {
              id: 'follow-ups',
              label: `Follow Ups (${followUps.length})`,
              content: (
                <FollowUpsList clientId={client.id} followUps={serializedFollowUps} />
              ),
            },
            {
              id: 'notes',
              label: `Notes (${notes.length})`,
              content: (
                <NotesList clientId={client.id} notes={serializedNotes} />
              ),
            },
            {
              id: 'history',
              label: 'History',
              content: <StageHistory history={serializedHistory} />,
            },
          ]}
        />
      </div>
    </div>
  )
}
