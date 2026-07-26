'use client'

import { useState } from 'react'
import ClientCard from './ClientCard'
import { STAGES, ServiceTrack, stageTrackColor } from '@/lib/stages'

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

type ViewFilter = 'all' | 'website' | 'bookkeeping'

// Stages visible per view filter
const WEBSITE_STAGES = new Set(['1','2','3','4','5','6.1','7.1','8.1','9','10'])
const BOOKKEEPING_STAGES = new Set(['1','2','3','4','5','6.2','7.2','8.2','10'])

function buildEntries(clients: Client[], filter: ViewFilter): Record<string, KanbanEntry[]> {
  const map: Record<string, KanbanEntry[]> = {}

  for (const client of clients) {
    const st = client.serviceType

    const addEntry = (stage: string, track: 'website' | 'bookkeeping' | 'shared') => {
      if (!stage) return
      if (!map[stage]) map[stage] = []
      map[stage].push({ client, displayStage: stage, displayTrack: track })
    }

    if (filter === 'website') {
      if (st === 'website' || st === 'both') {
        const stage = client.websiteStage
        if (stage && WEBSITE_STAGES.has(stage)) addEntry(stage, 'website')
      }
    } else if (filter === 'bookkeeping') {
      if (st === 'bookkeeping' || st === 'both') {
        const stage = client.bookkeepingStage
        if (stage && BOOKKEEPING_STAGES.has(stage)) addEntry(stage, 'bookkeeping')
      }
    } else {
      // 'all' view
      if (st === 'website') {
        if (client.websiteStage) addEntry(client.websiteStage, 'website')
      } else if (st === 'bookkeeping') {
        if (client.bookkeepingStage) addEntry(client.bookkeepingStage, 'bookkeeping')
      } else {
        // 'both'
        const ws = client.websiteStage
        const bs = client.bookkeepingStage
        if (ws && bs && ws === bs) {
          // Tracks are in sync — show once as 'shared'
          addEntry(ws, 'shared')
        } else {
          if (ws) addEntry(ws, 'website')
          if (bs) addEntry(bs, 'bookkeeping')
        }
      }
    }
  }

  return map
}

function getVisibleStages(filter: ViewFilter) {
  return STAGES.filter((s) => {
    if (filter === 'website') return WEBSITE_STAGES.has(s.code)
    if (filter === 'bookkeeping') return BOOKKEEPING_STAGES.has(s.code)
    return true
  })
}

export default function KanbanBoard({ clients }: { clients: Client[] }) {
  const [filter, setFilter] = useState<ViewFilter>('all')

  const entries = buildEntries(clients, filter)
  const visibleStages = getVisibleStages(filter)
  const activeStages = visibleStages.filter((s) => (entries[s.code] ?? []).length > 0)

  const filterBtn = (label: string, value: ViewFilter, color: string) => (
    <button
      onClick={() => setFilter(value)}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        filter === value
          ? `${color} shadow-sm`
          : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
      }`}
    >
      {label}
    </button>
  )

  const total = clients.length
  const active = clients.filter((c) => !c.websiteStage?.includes('10') && !c.bookkeepingStage?.includes('10')).length

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Pipeline</h1>
          <p className="text-sm text-slate-500">
            {total} client{total !== 1 ? 's' : ''} · {active} active
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {filterBtn('All', 'all', 'bg-white text-slate-800')}
          {filterBtn('Website', 'website', 'bg-purple-100 text-purple-800')}
          {filterBtn('Bookkeeping', 'bookkeeping', 'bg-emerald-100 text-emerald-800')}
        </div>
      </div>

      {/* Vertical pipeline */}
      <div className="flex-1 overflow-y-auto">
        {activeStages.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
            No clients in pipeline.
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {activeStages.map((stage) => {
              const stageEntries = entries[stage.code] ?? []
              return (
                <div key={stage.code}>
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${stageTrackColor(stage.serviceTrack as ServiceTrack)}`}
                    >
                      {stage.code}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{stage.name}</span>
                    <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      {stageEntries.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {stageEntries.map((entry) => (
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
            })}
          </div>
        )}
      </div>
    </div>
  )
}
