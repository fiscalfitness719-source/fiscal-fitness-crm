export type ServiceTrack = 'website' | 'bookkeeping' | 'shared'
export type ServiceType = 'website' | 'bookkeeping' | 'both'

export interface StageDefinition {
  code: string
  name: string
  serviceTrack: ServiceTrack
  displayOrder: number
}

export const STAGES: StageDefinition[] = [
  { code: '1',   name: 'Inquiry',                        serviceTrack: 'shared',       displayOrder: 1.0  },
  { code: '2',   name: 'Discovery Call Scheduled',       serviceTrack: 'shared',       displayOrder: 2.0  },
  { code: '3',   name: 'Business Review',                serviceTrack: 'shared',       displayOrder: 3.0  },
  { code: '4',   name: 'Prepare Proposal',               serviceTrack: 'shared',       displayOrder: 4.0  },
  { code: '5',   name: 'Schedule Proposal Review',       serviceTrack: 'shared',       displayOrder: 5.0  },
  { code: '6.1', name: 'Building In Progress',           serviceTrack: 'website',      displayOrder: 6.1  },
  { code: '6.2', name: 'Pending Onboarding Docs',        serviceTrack: 'bookkeeping',  displayOrder: 6.2  },
  { code: '7.1', name: 'Customer Review',                serviceTrack: 'website',      displayOrder: 7.1  },
  { code: '7.2', name: 'Process Onboarding Docs',        serviceTrack: 'bookkeeping',  displayOrder: 7.2  },
  { code: '8.1', name: 'Launched & Active',              serviceTrack: 'website',      displayOrder: 8.1  },
  { code: '8.2', name: 'Active Client',                  serviceTrack: 'bookkeeping',  displayOrder: 8.2  },
  { code: '9',   name: 'Launched & Inactive',            serviceTrack: 'website',      displayOrder: 9.0  },
  { code: '10',  name: 'Closed',                         serviceTrack: 'shared',       displayOrder: 10.0 },
]

export const SHARED_STAGE_CODES = new Set(['1', '2', '3', '4', '5', '10'])

const WEBSITE_SEQUENCE = ['1', '2', '3', '4', '5', '6.1', '7.1', '8.1', '9', '10']
const BOOKKEEPING_SEQUENCE = ['1', '2', '3', '4', '5', '6.2', '7.2', '8.2', '10']

export function getStage(code: string): StageDefinition | undefined {
  return STAGES.find((s) => s.code === code)
}

export function getValidNextStages(
  currentCode: string,
  track: 'website' | 'bookkeeping'
): StageDefinition[] {
  const sequence = track === 'website' ? WEBSITE_SEQUENCE : BOOKKEEPING_SEQUENCE
  const idx = sequence.indexOf(currentCode)
  if (idx === -1) return []
  return sequence
    .slice(idx + 1)
    .map((code) => STAGES.find((s) => s.code === code)!)
    .filter(Boolean)
}

export function stageTrackColor(track: ServiceTrack): string {
  switch (track) {
    case 'website':     return 'bg-purple-100 text-purple-800'
    case 'bookkeeping': return 'bg-emerald-100 text-emerald-800'
    case 'shared':      return 'bg-blue-100 text-blue-800'
  }
}

export function serviceTypeBadgeColor(type: ServiceType): string {
  switch (type) {
    case 'website':     return 'bg-purple-100 text-purple-800'
    case 'bookkeeping': return 'bg-emerald-100 text-emerald-800'
    case 'both':        return 'bg-amber-100 text-amber-800'
  }
}

export function serviceTypeLabel(type: ServiceType): string {
  switch (type) {
    case 'website':     return 'Website'
    case 'bookkeeping': return 'Bookkeeping'
    case 'both':        return 'Both'
  }
}
