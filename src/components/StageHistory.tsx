import { getStage, stageTrackColor } from '@/lib/stages'

interface HistoryEntry {
  id: number
  serviceTrack: string
  fromStage: string | null
  toStage: string
  movedAt: string
}

export default function StageHistory({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-slate-400 italic">No history yet.</p>
  }

  return (
    <div className="space-y-0">
      {history.map((entry, i) => {
        const toStage = getStage(entry.toStage)
        const track = entry.serviceTrack as 'website' | 'bookkeeping' | 'shared'
        return (
          <div key={entry.id} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 flex-shrink-0" />
              {i < history.length - 1 && (
                <div className="w-px flex-1 bg-slate-200 mt-1" />
              )}
            </div>

            <div className="pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-slate-800">
                  Stage {entry.toStage} — {toStage?.name ?? entry.toStage}
                </span>
                <span
                  className={`text-xs font-medium px-1.5 py-0.5 rounded ${stageTrackColor(track)}`}
                >
                  {track}
                </span>
              </div>
              {entry.fromStage && (
                <p className="text-xs text-slate-400 mt-0.5">
                  from Stage {entry.fromStage}
                </p>
              )}
              <time className="text-xs text-slate-400 mt-0.5 block">
                {new Date(entry.movedAt).toLocaleString()}
              </time>
            </div>
          </div>
        )
      })}
    </div>
  )
}
