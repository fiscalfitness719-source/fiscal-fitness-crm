# Fiscal Fitness CRM

Internal CRM for managing bookkeeping and website-building client pipelines.

## Stack

- **Framework**: Next.js 14 (App Router, edge-compatible)
- **Database**: Neon serverless Postgres
- **ORM**: Drizzle ORM (HTTP driver — works on Cloudflare Workers)
- **Auth**: JWT via `jose` + PBKDF2 password hashing (Web Crypto API)
- **Styling**: Tailwind CSS
- **Deployment**: Cloudflare Pages via `@cloudflare/next-on-pages`

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Neon database

1. Go to [neon.tech](https://neon.tech) and create a free project
2. Copy the connection string from **Project → Connection Details**

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
DATABASE_URL=postgresql://...your neon connection string...
JWT_SECRET=generate-with-openssl-rand-base64-32
ADMIN_USERNAME=admin
ADMIN_PASSWORD=yourpassword
```

Generate a JWT secret:
```bash
openssl rand -base64 32
```

### 4. Push schema to Neon

```bash
npx drizzle-kit push
```

### 5. Seed stages, checklists, and admin user

```bash
npm run db:seed
```

### 6. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with the credentials you set in `.env.local`.

---

## Database Schema

| Table | Purpose |
|---|---|
| `users` | Login credentials |
| `stages` | Pipeline stage definitions (seeded) |
| `checklist_templates` | Default tasks per stage (seeded) |
| `clients` | Client records with dual stage columns |
| `notes` | Timestamped notes per client |
| `stage_history` | Audit trail of stage transitions |
| `client_tasks` | Per-client task instances |

### Pipeline stages

Stages 1–5 and 10 are **shared** (apply to all service types). Stage 6+ branches:

| Code | Name | Track |
|---|---|---|
| 1 | Inquiry | shared |
| 2 | Discovery Call Scheduled | shared |
| 3 | Business Review | shared |
| 4 | Prepare Proposal | shared |
| 5 | Schedule Proposal Review | shared |
| 6.1 | Building In Progress | website |
| 6.2 | Pending Onboarding Documents | bookkeeping |
| 7.1 | Customer Review | website |
| 7.2 | Process Onboarding Documents | bookkeeping |
| 8.1 | Launched & Active Client | website |
| 8.2 | Active Client | bookkeeping |
| 9 | Launched & Inactive | website |
| 10 | Closed | shared |

**Both** service type clients have two independent stage columns (`website_stage` + `bookkeeping_stage`). Stages 1–5 are kept in sync; past stage 5 each track advances independently.

---

## Deployment to Cloudflare Pages

### 1. Push code to GitHub

```bash
git init && git add . && git commit -m "Initial commit"
gh repo create fiscal-fitness-crm --private --push
```

### 2. Create a Cloudflare Pages project

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages → Create → Pages → Connect to Git**
3. Select your repository
4. Set build configuration:
   - **Framework preset**: None
   - **Build command**: `npx @cloudflare/next-on-pages`
   - **Build output directory**: `.vercel/output/static`

### 3. Add environment variables in Cloudflare

In your Pages project → **Settings → Environment variables**, add:

```
DATABASE_URL   = <your Neon connection string>
JWT_SECRET     = <your JWT secret>
```

### 4. Deploy

Push any commit to `main` to trigger a deployment. Or use:

```bash
npm run cf:deploy
```

(Requires `wrangler login` first.)

---

## Adding a new user

Run this against your Neon database using the Neon SQL editor or psql:

```sql
-- Replace the hash: run `npm run db:seed` after updating ADMIN_USERNAME/ADMIN_PASSWORD in .env.local
-- Or insert directly using a PBKDF2 hash you generate via the seed script.
```

The easiest way is to update `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local` and re-run `npm run db:seed` — it uses `ON CONFLICT DO NOTHING` so it won't overwrite existing users.

---

## Project structure

```
src/
  app/
    login/           Login page
    (dashboard)/     Protected routes (layout has sidebar)
      page.tsx       Kanban dashboard
      clients/new    New client form
      clients/[id]   Client detail (tabbed: Overview, Tasks, Notes, History)
    api/
      auth/          login + logout endpoints
      clients/       CRUD + stage advance + tasks + notes
  components/        Reusable UI components
  lib/
    db/              Drizzle schema, connection, seed script
    auth.ts          JWT + PBKDF2 helpers
    stages.ts        Stage constants and helpers
  middleware.ts      JWT cookie auth guard
```
