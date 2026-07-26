'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ArchiveDeleteButtons({ clientId }: { clientId: number }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleArchive() {
    setLoading(true)
    await fetch(`/api/clients/${clientId}`, { method: 'DELETE' })
    router.push('/')
    router.refresh()
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm text-slate-400 hover:text-red-600 transition-colors"
      >
        Archive client
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <span className="text-sm text-red-700">Archive this client?</span>
      <button
        onClick={handleArchive}
        disabled={loading}
        className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition-colors disabled:opacity-50"
      >
        {loading ? 'Archiving…' : 'Confirm'}
      </button>
      <button
        onClick={() => setConfirming(false)}
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        Cancel
      </button>
    </div>
  )
}
