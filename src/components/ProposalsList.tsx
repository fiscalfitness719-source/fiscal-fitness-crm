'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProposalSummary {
  id: number
  title: string
  status: string
  createdAt: string
  updatedAt: string
}

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-600',
  sent: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
}

export default function ProposalsList({
  clientId,
  proposals,
}: {
  clientId: number
  proposals: ProposalSummary[]
}) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)

  async function handleCreate() {
    setCreating(true)
    const res = await fetch(`/api/clients/${clientId}/proposals`, { method: 'POST' })
    if (res.ok) {
      const { id } = await res.json()
      router.push(`/proposals/${id}/edit`)
    } else {
      setCreating(false)
    }
  }

  async function handleDelete(proposalId: number) {
    if (!confirm('Delete this proposal?')) return
    await fetch(`/api/proposals/${proposalId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleCreate}
          disabled={creating}
          className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {creating ? 'Creating…' : '+ New Proposal'}
        </button>
      </div>

      {proposals.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No proposals yet.</p>
      ) : (
        <div className="space-y-2">
          {proposals.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-300 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Updated {new Date(p.updatedAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[p.status] ?? STATUS_COLORS.draft}`}
                >
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
                <Link
                  href={`/proposals/${p.id}/edit`}
                  className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 px-2 py-0.5 rounded transition-colors"
                >
                  Edit
                </Link>
                <Link
                  href={`/proposals/${p.id}/print`}
                  target="_blank"
                  className="text-xs text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 px-2 py-0.5 rounded transition-colors"
                >
                  View / Print
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-xs text-red-400 hover:text-red-600 px-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
