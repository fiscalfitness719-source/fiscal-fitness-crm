import { config } from 'dotenv'
config({ path: '.env.local' })
import { getDb } from './index'
import { stages, checklistTemplates, users } from './schema'
import { hashPassword } from '../auth'

const db = getDb()

const STAGES = [
  { code: '1',   name: 'Inquiry',                          serviceTrack: null,            displayOrder: '1.0' },
  { code: '2',   name: 'Discovery Call Scheduled',         serviceTrack: null,            displayOrder: '2.0' },
  { code: '3',   name: 'Business Review',                  serviceTrack: null,            displayOrder: '3.0' },
  { code: '4',   name: 'Prepare Proposal',                 serviceTrack: null,            displayOrder: '4.0' },
  { code: '5',   name: 'Schedule Proposal Review',         serviceTrack: null,            displayOrder: '5.0' },
  { code: '6.1', name: 'Building In Progress',             serviceTrack: 'website',       displayOrder: '6.1' },
  { code: '6.2', name: 'Pending Onboarding Documents',     serviceTrack: 'bookkeeping',   displayOrder: '6.2' },
  { code: '7.1', name: 'Customer Review',                  serviceTrack: 'website',       displayOrder: '7.1' },
  { code: '7.2', name: 'Process Onboarding Documents',     serviceTrack: 'bookkeeping',   displayOrder: '7.2' },
  { code: '8.1', name: 'Launched & Active Client',         serviceTrack: 'website',       displayOrder: '8.1' },
  { code: '8.2', name: 'Active Client',                    serviceTrack: 'bookkeeping',   displayOrder: '8.2' },
  { code: '9',   name: 'Launched & Inactive Client',       serviceTrack: 'website',       displayOrder: '9.0' },
  { code: '10',  name: 'Closed',                           serviceTrack: null,            displayOrder: '10.0' },
]

const CHECKLIST_TEMPLATES: Record<string, string[]> = {
  '1': [
    'Respond to initial inquiry',
    'Qualify lead (budget, timeline, needs)',
    'Send discovery call calendar link',
  ],
  '2': [
    'Send calendar invite confirmation',
    'Prepare discovery call agenda',
    'Research prospect\'s business',
    'Set up call recording (if applicable)',
  ],
  '3': [
    'Complete discovery call notes',
    'Identify client pain points and goals',
    'Assess scope of work',
    'Determine pricing range',
  ],
  '4': [
    'Draft proposal document',
    'Define scope of work clearly',
    'Set pricing and payment terms',
    'Include timeline and deliverables',
  ],
  '5': [
    'Send proposal to client',
    'Schedule proposal review meeting',
    'Prepare for objections and questions',
    'Follow up if no response within 3 days',
  ],
  '6.1': [
    'Collect brand assets (logo, colors, fonts)',
    'Gather content (copy, images)',
    'Set up development environment',
    'Build homepage',
    'Build inner pages',
    'Set up contact forms',
    'Test across devices and browsers',
    'Client check-in at midpoint',
  ],
  '6.2': [
    'Send onboarding document checklist to client',
    'Collect prior year financial statements',
    'Collect bank account access and statements',
    'Collect chart of accounts (if existing)',
    'Collect tax ID and business information',
    'Confirm accounting software access',
  ],
  '7.1': [
    'Send staging site link to client',
    'Document client feedback',
    'Implement revision round 1',
    'Get final approval from client',
  ],
  '7.2': [
    'Set up chart of accounts',
    'Import historical transactions',
    'Reconcile opening balances',
    'Categorize historical transactions',
    'Set up recurring transaction rules',
    'Deliver initial financial snapshot to client',
  ],
  '8.1': [
    'Transfer domain and configure DNS',
    'Verify SSL certificate',
    'Set up Google Analytics',
    'Submit sitemap to Google Search Console',
    'Deliver launch checklist to client',
    'Schedule post-launch check-in',
  ],
  '8.2': [
    'Complete first monthly close',
    'Deliver first monthly report',
    'Confirm reporting preferences with client',
    'Set up recurring invoice and payment',
  ],
  '9': [
    'Document reason for inactivity',
    'Confirm client has all access credentials',
    'Archive project files',
  ],
  '10': [
    'Send final invoice',
    'Collect outstanding payment',
    'Request testimonial or review',
    'Archive client files',
    'Document reason for closing',
  ],
}

async function seed() {
  console.log('Seeding stages...')
  await db.insert(stages).values(STAGES).onConflictDoNothing()

  console.log('Seeding checklist templates...')
  const templateRows = Object.entries(CHECKLIST_TEMPLATES).flatMap(
    ([stageCode, tasks]) =>
      tasks.map((taskText, i) => ({ stageCode, taskText, sortOrder: i }))
  )
  await db.insert(checklistTemplates).values(templateRows).onConflictDoNothing()

  console.log('Creating admin user...')
  const username = process.env.ADMIN_USERNAME ?? 'admin'
  const password = process.env.ADMIN_PASSWORD ?? 'changeme123'
  const passwordHash = await hashPassword(password)
  await db
    .insert(users)
    .values({ username, passwordHash })
    .onConflictDoUpdate({ target: users.username, set: { passwordHash } })

  console.log('Seed complete.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
