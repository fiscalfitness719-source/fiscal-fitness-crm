'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface Note {
  id: number
  content: string
  createdAt: string
}

export default function NotesList({
  clientId,
  notes,
}: {
  clientId: number
  notes: Note[]
}) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSaving(true)
    await fetch(`/api/clients/${clientId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    setContent('')
    router.refresh()
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a note…"
          rows={3}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !content.trim()}
            className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving…' : 'Add note'}
          </button>
        </div>
      </form>

      {/* Notes timeline */}
      {notes.length === 0 ? (
        <p className="text-sm text-slate-400 italic">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border-l-2 border-slate-200 pl-4 py-0.5"
            >
              <p className="text-sm text-slate-700 whitespace-pre-wrap">
                {note.content}
              </p>
              <time className="text-xs text-slate-400 mt-1 block">
                {new Date(note.createdAt).toLocaleString()}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
