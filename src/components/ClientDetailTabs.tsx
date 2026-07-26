'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'

type Tab = 'overview' | 'tasks' | 'proposals' | 'follow-ups' | 'notes' | 'history'

export default function ClientDetailTabs({
  tabs,
}: {
  tabs: { id: Tab; label: string; content: ReactNode }[]
}) {
  const [active, setActive] = useState<Tab>(tabs[0].id)

  return (
    <div>
      <div className="flex gap-1 border-b border-slate-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              active === tab.id
                ? 'border-slate-800 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.find((t) => t.id === active)?.content}
    </div>
  )
}
