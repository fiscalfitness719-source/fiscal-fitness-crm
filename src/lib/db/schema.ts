import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  date,
  boolean,
  timestamp,
  integer,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique(),
  // 'admin' | 'member'
  role: varchar('role', { length: 20 }).notNull().default('admin'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Pipeline stage definitions (seeded, not user-editable)
export const stages = pgTable('stages', {
  code: varchar('code', { length: 10 }).primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  // null = shared (1-5, 10), 'website', or 'bookkeeping'
  serviceTrack: varchar('service_track', { length: 20 }),
  // Decimal allows 6.1, 6.2, 7.1, 7.2, etc. for clean ordering
  displayOrder: decimal('display_order', { precision: 4, scale: 1 }).notNull(),
})

// Default task templates per stage (seeded)
export const checklistTemplates = pgTable('checklist_templates', {
  id: serial('id').primaryKey(),
  stageCode: varchar('stage_code', { length: 10 })
    .notNull()
    .references(() => stages.code),
  taskText: text('task_text').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
})

export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  email: varchar('email', { length: 255 }),
  emailNotObtained: boolean('email_not_obtained').notNull().default(false),
  phone: varchar('phone', { length: 50 }),
  // 'website' | 'bookkeeping' | 'both'
  serviceType: varchar('service_type', { length: 20 }).notNull(),
  // Each track has its own stage column.
  // For single-service clients, only the relevant column is set.
  // For 'both' clients, both are set; shared stages (1-5) are kept in sync.
  websiteStage: varchar('website_stage', { length: 10 }).references(() => stages.code),
  bookkeepingStage: varchar('bookkeeping_stage', { length: 10 }).references(
    () => stages.code
  ),
  contractValue: decimal('contract_value', { precision: 10, scale: 2 }),
  startDate: date('start_date'),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

// Append-only timestamped notes per client
export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const followUps = pgTable('follow_ups', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

// Audit trail: every time a client's stage changes
export const stageHistory = pgTable('stage_history', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  // 'website' | 'bookkeeping' | 'shared' (shared = both tracks moved together)
  serviceTrack: varchar('service_track', { length: 20 }).notNull(),
  fromStage: varchar('from_stage', { length: 10 }),
  toStage: varchar('to_stage', { length: 10 }).notNull(),
  movedAt: timestamp('moved_at', { withTimezone: true }).defaultNow().notNull(),
})

export const proposals = pgTable('proposals', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  coverNote: text('cover_note'),
  termsText: text('terms_text'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const proposalItems = pgTable('proposal_items', {
  id: serial('id').primaryKey(),
  proposalId: integer('proposal_id').notNull().references(() => proposals.id, { onDelete: 'cascade' }),
  // 'scope' | 'pricing'
  section: varchar('section', { length: 20 }).notNull(),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }),
  // 'one_time' | 'monthly' | 'annual'
  frequency: varchar('frequency', { length: 20 }),
  sortOrder: integer('sort_order').notNull().default(0),
})

// Per-client task instances, grouped by the stage they were created for
export const clientTasks = pgTable('client_tasks', {
  id: serial('id').primaryKey(),
  clientId: integer('client_id')
    .notNull()
    .references(() => clients.id, { onDelete: 'cascade' }),
  stageCode: varchar('stage_code', { length: 10 })
    .notNull()
    .references(() => stages.code),
  taskText: text('task_text').notNull(),
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
