'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getStage } from '@/lib/stages'

interface Task {
  id: number
  stageCode: string
  taskText: string
  completed: boolean
  completedAt: string | null
  createdAt: string
}

interface TaskChecklistProps {
  clientId: number
  tasks: Task[]
  // Only show tasks for these stage codes (current active stages)
  activeStages: string[]
}

export default function TaskChecklist({
  clientId,
  tasks,
  activeStages,
}: TaskChecklistProps) {
  const router = useRouter()
  const [toggling, setToggling] = useState<number | null>(null)

  const activeStageCodes = new Set(activeStages)
  const activeTasks = tasks.filter((t) => activeStageCodes.has(t.stageCode))

  // Group by stageCode for display when multiple stages are active (both client)
  const grouped = activeTasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!acc[task.stageCode]) acc[task.stageCode] = []
    acc[task.stageCode].push(task)
    return acc
  }, {})

  const stageGroups = Object.entries(grouped).sort(([a], [b]) => {
    return parseFloat(a) - parseFloat(b)
  })

  async function toggle(task: Task) {
    setToggling(task.id)
    await fetch(`/api/clients/${clientId}/tasks`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, completed: !task.completed }),
    })
    router.refresh()
    setToggling(null)
  }

  if (activeTasks.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">No tasks for current stage.</p>
    )
  }

  return (
    <div className="space-y-6">
      {stageGroups.map(([stageCode, stageTasks]) => {
        const stage = getStage(stageCode)
        const completed = stageTasks.filter((t) => t.completed).length
        return (
          <div key={stageCode}>
            {stageGroups.length > 1 && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Stage {stageCode} — {stage?.name}
                </span>
                <span className="text-xs text-slate-400">
                  {completed}/{stageTasks.length}
                </span>
              </div>
            )}

            <div className="space-y-2">
              {stageTasks.map((task) => (
                <label
                  key={task.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${
                    toggling === task.id ? 'opacity-50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggle(task)}
                    disabled={toggling === task.id}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-800 focus:ring-slate-500 cursor-pointer"
                  />
                  <span
                    className={`text-sm ${
                      task.completed
                        ? 'line-through text-slate-400'
                        : 'text-slate-700'
                    }`}
                  >
                    {task.taskText}
                  </span>
                </label>
              ))}
            </div>

            {stageGroups.length === 1 && (
              <p className="text-xs text-slate-400 mt-2">
                {completed} of {stageTasks.length} completed
              </p>
            )}
          </div>
        )
      })}

      {/* Historical completed tasks from past stages */}
      {(() => {
        const pastTasks = tasks.filter(
          (t) => !activeStageCodes.has(t.stageCode) && t.completed
        )
        if (pastTasks.length === 0) return null
        return (
          <details className="mt-4">
            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
              {pastTasks.length} completed task{pastTasks.length !== 1 ? 's' : ''} from previous stages
            </summary>
            <div className="mt-2 space-y-1 pl-2 border-l-2 border-slate-100">
              {pastTasks.map((task) => (
                <p key={task.id} className="text-xs text-slate-400 line-through py-0.5">
                  {task.taskText}{' '}
                  <span className="not-line-through text-slate-300 no-underline">
                    (Stage {task.stageCode})
                  </span>
                </p>
              ))}
            </div>
          </details>
        )
      })()}
    </div>
  )
}
