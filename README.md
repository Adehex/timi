# The Light Music Institute (TLMI)

A digital music academy platform. This is **Phase 1 + slices of Phases 2–4**
of a much larger build — see "What's built" and "What's next" below for an
honest accounting.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- PostgreSQL, schema defined in `prisma/schema.prisma`
- Data access via a typed repository layer over `pg` (see "A note on Prisma" below)
- bcrypt password hashing, DB-backed revocable sessions (HttpOnly cookies)
- Zod validation on every form input
- Vitest for unit tests

## Getting started

```bash
npm install
cp .env.example .env   # then set DATABASE_URL and other values

# Apply the schema to a fresh Postgres database:
psql "$DATABASE_URL" -f prisma/migrations/0001_init/migration.sql
# (or, once you have normal network access: npx prisma migrate deploy)

npm run db:seed        # realistic dev data — see credentials below
npm run dev
```

### Seeded login credentials (password for all: `Password123`)

| Role | Email |
|---|---|
| Super admin | `super.admin@tlmi.academy` |
| Admin | `admin@tlmi.academy` |
| Teacher | `emeka.teacher@tlmi.academy` |
| Teacher | `grace.teacher@tlmi.academy` |
| Student (onboarded, enrolled) | `adekunle.student@tlmi.academy` |
| Student (onboarded, enrolled) | `chioma.student@tlmi.academy` |
| Student (not onboarded yet) | `tobi.student@tlmi.academy` |

Certificate verification demo: go to `/verify` and enter `TLMI-GTR-000184`.

## A note on Prisma

`prisma/schema.prisma` is the authoritative schema — 41 tables, 20 enums,
fully normalized, with the instrument-agnostic hierarchy the spec called for
(`Instrument → Course → CourseModule → Lesson`, plus every other domain
table: enrollments, progress, assignments, feedback, practice, chords/scales/
tunings, songs, scheduling, payments, achievements, certificates,
notifications, audit log).

In the sandbox this was built in, the Prisma CLI's engine-binary CDN
(`binaries.prisma.sh`) was blocked by network policy, for every command,
across two major versions — a sandbox-specific restriction, not a schema
problem. The schema was verified instead by hand-writing the equivalent SQL
(`prisma/migrations/0001_init/migration.sql`) and applying it directly to a
live Postgres instance: **41 tables and 73 foreign keys created with zero
errors.**

Because of that, application code queries Postgres through a typed
repository layer (`src/lib/db/repositories/*`) built on `pg` instead of
`@prisma/client`, so the app actually runs. In any environment with normal
internet access — your machine, Claude Code, CI, Vercel — `npx prisma
generate && npx prisma migrate deploy` will work against this same schema
file, and `@prisma/client` can be swapped in behind the repository
functions with no change to calling code.

## What's built

- **Schema & migrations**: full 41-table schema, applied and verified against live Postgres.
- **Auth**: register, login, logout, forgot/reset password, email verification. Bcrypt hashing, DB-backed sessions (hashed tokens, revocable, invalidated on password reset), RBAC enforced server-side in every layout (not just hidden in the UI).
- **Onboarding**: instrument/level/goals form → writes to `student_profiles`.
- **Student app**: responsive sidebar (desktop) + bottom nav (mobile), dashboard pulling live data (active enrollment, next lesson, pending assignment, upcoming class, practice streak, recent feedback, achievements, announcements), course catalog + enrollment (free courses; paid checkout is Phase 5), course detail page with real lesson-completion tracking that recalculates course progress from actual completions.
- **Teacher app**: dashboard scoped to *only* that teacher's assigned students and *only* submissions tied to assignments they created — enforced in SQL, not just the UI. Verified with an explicit cross-teacher authorization test.
- **Admin app**: dashboard with real aggregate stats (students, teachers, courses, revenue, pending reviews, upcoming classes, new registrations).
- **Public site**: landing page pulling live instrument/course data with graceful empty states pre-seed, certificate verification page (privacy-preserving — never exposes email or other private fields).
- **Design system**: warm gold/ink/ember brand palette, typography tokens, and UI primitives (Button, Card, Input, Label, Badge, Progress, Avatar, Tabs, Dialog, Alert, EmptyState, Loading/Skeleton).
- **Storage & payment abstraction layers**: `.env.example` wired for S3-compatible storage and Paystack/Flutterwave, ready for real credentials (not built into UI flows yet — see below).
- **Tests**: 30 unit tests (progress calculation, certificate number formatting, achievement criteria evaluation, password hashing/strength, payment idempotency keys) + a live-database integration script (`scripts/verify-core-flows.ts`) exercising login, dashboard aggregation, teacher RBAC scoping, admin stats, and certificate verification against real seeded data.
- **Verified**: `tsc --noEmit` clean, `eslint` clean, `next build` succeeds for all 30 routes, seed script runs cleanly, production server serves real DB-backed pages.

## What's next (not yet built)

- Video upload (direct-to-storage), video assessment/timestamped feedback UI, teacher assignment creation UI
- Practice tools: tuner, metronome, interactive fretboard, chord/scale library UI (schema exists; no UI yet)
- Song library UI, backing track player
- Class scheduling/attendance management UI
- Payment checkout flow wired to Paystack/Flutterwave + webhook handlers
- Certificate PDF generation, achievement auto-unlocking on real events
- Notifications UI (in-app/email/push)
- Admin CRUD tables for students/teachers/courses, analytics charts
- Integration/E2E tests beyond the current unit + live-flow verification

## Scripts

```bash
npm run dev        # start dev server
npm run build      # production build
npm run lint       # eslint
npm test           # vitest unit tests
npm run db:seed    # reset + seed the database
npx tsx scripts/verify-core-flows.ts   # live integration check against seeded data
```
