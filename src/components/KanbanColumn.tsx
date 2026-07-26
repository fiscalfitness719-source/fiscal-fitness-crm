import ClientCard from './ClientCard'
import { stageTrackColor } from '@/lib/stages'
import type { ServiceTrack } from '@/lib/stages'

interface Client {
  id: number
  name: string
  serviceType: string
  websiteStage: string | null
  bookkeepingStage: string | null
  contractValue: string | null
  email: string | null
}

interface KanbanEntry {
  client: Client
  displayStage: string
  displayTrack: 'website' | 'bookkeeping' | 'shared'
}

interface KanbanColumnProps {
  stageCode: string
  stageName: string
  serviceTrack: ServiceTrack
  entries: KanbanEntry[]
}

export default function KanbanColumn({
  stageCode,
  stageName,
  serviceTrack,
  entries,
}: KanbanColumnProps) {
  return (
    <div className="flex-shrink-0 w-56">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${stageTrackColor(serviceTrack)}`}
        >
          {stageCode}
        </span>
        <span className="text-xs font-medium text-slate-600 truncate">{stageName}</span>
        <span className="ml-auto text-xs text-slate-400">{entries.length}</span>
      </div>

      <div className="space-y-2 min-h-[60px]">
        {entries.map((entry) => (
          <ClientCard
            key={`${entry.client.id}-${entry.displayTrack}`}
            client={entry.client}
            displayStage={entry.displayStage}
            displayTrack={entry.displayTrack}
          />
        ))}
      </div>
    </div>
  )
}
