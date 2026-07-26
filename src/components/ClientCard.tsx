import Link from 'next/link'
import { getStage, serviceTypeBadgeColor, serviceTypeLabel, stageTrackColor } from '@/lib/stages'

interface Client {
  id: number
  name: string
  serviceType: string
  websiteStage: string | null
  bookkeepingStage: string | null
  contractValue: string | null
  email: string | null
}

interface ClientCardProps {
  client: Client
  displayStage: string
  displayTrack: 'website' | 'bookkeeping' | 'shared'
}

export default function ClientCard({ client, displayStage, displayTrack }: ClientCardProps) {
  const stage = getStage(displayStage)
  const serviceType = client.serviceType as 'website' | 'bookkeeping' | 'both'

  return (
    <Link href={`/clients/${client.id}`}>
      <div className="bg-white rounded-lg border border-slate-200 p-3 hover:border-slate-400 hover:shadow-sm transition-all cursor-pointer">
        <p className="font-medium text-slate-900 text-sm truncate">{client.name}</p>

        <div className="flex flex-wrap gap-1 mt-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${serviceTypeBadgeColor(serviceType)}`}
          >
            {serviceTypeLabel(serviceType)}
          </span>

          {client.serviceType === 'both' && displayTrack !== 'shared' && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stageTrackColor(displayTrack)}`}
            >
              {displayTrack === 'website' ? 'Web' : 'Books'} track
            </span>
          )}
        </div>

        {client.contractValue && (
          <p className="text-xs text-slate-500 mt-2">
            ${Number(client.contractValue).toLocaleString()}
            <span className="text-slate-400">/yr</span>
          </p>
        )}
      </div>
    </Link>
  )
}
