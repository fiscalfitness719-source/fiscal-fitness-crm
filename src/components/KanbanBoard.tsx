'use client'

import { useState } from 'react'
import KanbanColumn from './KanbanColumn'
import { STAGES, ServiceTrack } from '@/lib/stages'

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

      {/* Kanban scroll area */}
      <div className="flex-1 overflow-x-auto scrollbar-thin">
        <div className="flex gap-4 p-6 min-w-max h-full items-start">
          {visibleStages.map((stage) => (
            <KanbanColumn
              key={stage.code}
              stageCode={stage.code}
              stageName={stage.name}
              serviceTrack={stage.serviceTrack as ServiceTrack}
              entries={entries[stage.code] ?? []}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
