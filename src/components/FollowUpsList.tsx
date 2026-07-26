'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

const TYPES = [
  'Call',
  'Text',
  'Email',
  'Facebook Message',
  'Instagram Message',
  'TikTok Message',
]

const TYPE_COLORS: Record<string, string> = {
  'Call': 'bg-blue-100 text-blue-700',
  'Text': 'bg-green-100 text-green-700',
  'Email': 'bg-purple-100 text-purple-700',
  'Facebook Message': 'bg-indigo-100 text-indigo-700',
  'Instagram Message': 'bg-pink-100 text-pink-700',
  'TikTok Message': 'bg-slate-100 text-slate-700',
}

interface FollowUp {
  id: number
  type: string
  content: string
  createdAt: string
}

export default function FollowUpsList({
  clientId,
  followUps,
}: {
  clientId: number
  followUps: FollowUp[]
}) {
  const router = useRouter()
  const [type, setType] = useState(TYPES[0])
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    await fetch(`/api/clients/${clientId}/follow-ups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, content }),
    })
    setContent('')
    router.refresh()
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                type === t
                  ? TYPE_COLORS[t] + ' border-transparent'
                  : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Log a ${type}…`}
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !content.trim()}
            className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Log follow-up'}
          </button>
        </div>
      </form>

      {followUps.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No follow-ups logged yet.</p>
      ) : (
        <div className="space-y-3">
          {followUps.map((f) => (
            <div key={f.id} className="border-l-2 border-slate-200 pl-4 py-0.5">
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mb-1 ${TYPE_COLORS[f.type] ?? 'bg-slate-100 text-slate-600'}`}
              >
                {f.type}
              </span>
              <p className="text-sm text-slate-700 whitespace-pre-wrap">{f.content}</p>
              <time className="text-xs text-slate-400 mt-1 block">
                {new Date(f.createdAt).toLocaleString()}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
