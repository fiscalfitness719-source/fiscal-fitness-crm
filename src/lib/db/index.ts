import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Called inside each request handler so DATABASE_URL is read at runtime,
// not at module evaluation time (which would fail during `next build`).
export function getDb() {
  return drizzle(neon(process.env.DATABASE_URL!), { schema })
}
