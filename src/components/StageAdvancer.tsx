'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getValidNextStages,
  getStage,
  stageTrackColor,
  SHARED_STAGE_CODES,
  type ServiceType,
} from '@/lib/stages'

interface Client {
  id: number
  serviceType: string
  websiteStage: string | null
  bookkeepingStage: string | null
}

export default function StageAdvancer({ client }: { client: Client }) {
  const router = useRouter()
  const [moving, setMoving] = useState(false)
  const serviceType = client.serviceType as ServiceType

  async function advance(serviceTrack: 'website' | 'bookkeeping', newStage: string) {
    setMoving(true)
    await fetch(`/api/clients/${client.id}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceTrack, newStage }),
    })
    router.refresh()
    setMoving(false)
  }

  const renderTrack = (
    track: 'website' | 'bookkeeping',
    currentStage: string | null
  ) => {
    if (!currentStage) return null
    const nextStages = getValidNextStages(currentStage, track)
    const current = getStage(currentStage)
    const trackLabel = track === 'website' ? 'Website' : 'Bookkeeping'
    const trackColor = stageTrackColor(track)

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${trackColor}`}>
            {trackLabel}
          </span>
          <span className="text-sm text-slate-600">
            Stage {currentStage} — {current?.name}
          </span>
        </div>

        {nextStages.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {nextStages.map((s) => (
              <button
                key={s.code}
                onClick={() => advance(track, s.code)}
                disabled={moving}
                className="text-xs border border-slate-300 hover:border-slate-500 hover:bg-slate-50 px-2.5 py-1 rounded-md transition-colors disabled:opacity-40"
              >
                → {s.code}: {s.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Final stage reached.</p>
        )}
      </div>
    )
  }

  // For 'both' clients in synced shared stages, show a single combined control
  const isBoth = serviceType === 'both'
  const wsStage = client.websiteStage
  const bkStage = client.bookkeepingStage
  const tracksInSync = isBoth && wsStage === bkStage && wsStage !== null

  if (isBoth && tracksInSync && SHARED_STAGE_CODES.has(wsStage!)) {
    // Both tracks are at the same shared stage — show combined control
    const currentStage = wsStage!
    const nextFromWebsite = getValidNextStages(currentStage, 'website')
    const current = getStage(currentStage)

    return (
      <div className="space-y-3">
        <div className="text-sm text-slate-600">
          Stage {currentStage} — {current?.name}
          <span className="ml-2 text-xs text-slate-400">(both tracks)</span>
        </div>

        {nextFromWebsite.length > 0 ? (
          <div>
            <p className="text-xs text-slate-500 mb-2">
              Shared stages (1–5) advance both tracks together. Past stage 5, each track advances separately.
            </p>
            <div className="flex flex-wrap gap-2">
              {nextFromWebsite.map((s) => {
                // For website-specific stages, show as individual track buttons
                if (s.serviceTrack === 'website') {
                  return (
                    <button
                      key={s.code}
                      onClick={() => advance('website', s.code)}
                      disabled={moving}
                      className="text-xs border border-purple-200 text-purple-700 hover:bg-purple-50 px-2.5 py-1 rounded-md transition-colors disabled:opacity-40"
                    >
                      → {s.code}: {s.name} (Website)
                    </button>
                  )
                }
                // For bookkeeping-specific stages at the same level, show separately
                if (s.serviceTrack === 'bookkeeping') return null
                // Shared stage — advance both together
                return (
                  <button
                    key={s.code}
                    onClick={() => advance('website', s.code)}
                    disabled={moving}
                    className="text-xs border border-slate-300 hover:border-slate-500 hover:bg-slate-50 px-2.5 py-1 rounded-md transition-colors disabled:opacity-40"
                  >
                    → {s.code}: {s.name}
                  </button>
                )
              })}
              {/* Also show bookkeeping-specific options */}
              {getValidNextStages(currentStage, 'bookkeeping')
                .filter((s) => s.serviceTrack === 'bookkeeping')
                .map((s) => (
                  <button
                    key={s.code}
                    onClick={() => advance('bookkeeping', s.code)}
                    disabled={moving}
                    className="text-xs border border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-2.5 py-1 rounded-md transition-colors disabled:opacity-40"
                  >
                    → {s.code}: {s.name} (Bookkeeping)
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Final stage reached.</p>
        )}
      </div>
    )
  }

  // Separate track controls (single-service client, or 'both' with diverged tracks)
  return (
    <div className="space-y-5">
      {(serviceType === 'website' || serviceType === 'both') &&
        renderTrack('website', client.websiteStage)}
      {(serviceType === 'bookkeeping' || serviceType === 'both') &&
        renderTrack('bookkeeping', client.bookkeepingStage)}
    </div>
  )
}
