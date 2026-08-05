# Lumora Digital

A Next.js 15 agency portfolio site with a full production e-commerce
storefront ("Lumora Skin") built in as its flagship case study — two
independently-themed brands served from one codebase, one database, and
one deployment.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · PostgreSQL
via Prisma · Redis (cache + rate limiting) · NextAuth v5 · Stripe ·
Cloudinary · Resend · Sentry · pino.

## Quick start

```bash
git clone <this-repo>
cd lumora-digital
cp .env.example .env.local        # defaults work with zero real keys set
npm install                       # runs `prisma generate` via postinstall
npx prisma migrate dev            # creates the schema (needs DATABASE_URL)
npx tsx prisma/seed.ts            # optional: realistic demo data
npm run dev
```

Open http://localhost:3000 for the agency site, http://localhost:3000/lumora
for the storefront. Full first-time setup (including getting a local
Postgres/Redis running) is in **[docs/INSTALLATION.md](docs/INSTALLATION.md)**.

Every third-party integration (Stripe, Cloudinary, Resend, Sentry, OAuth)
is optional at the code level — see `src/lib/env.ts`. The app boots and
runs with just `DATABASE_URL` set; each integration silently no-ops until
its keys are added.

## Documentation

| Doc | What it covers |
|---|---|
| [docs/INSTALLATION.md](docs/INSTALLATION.md) | First-time local setup, all prerequisites |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deploying to Vercel or via Docker |
| [docs/DATABASE_MIGRATIONS.md](docs/DATABASE_MIGRATIONS.md) | Running, writing, and rolling back Prisma migrations |
| [docs/MAINTENANCE.md](docs/MAINTENANCE.md) | Routine upkeep: dependency updates, log review, key rotation |
| [docs/MONITORING.md](docs/MONITORING.md) | Sentry, `/api/health`, structured logs, what to alert on |
| [docs/BACKUP_STRATEGY.md](docs/BACKUP_STRATEGY.md) | What's backed up, how often, and why |
| [docs/RECOVERY.md](docs/RECOVERY.md) | Incident runbooks: restore, rollback, key compromise |
| [docs/PRODUCTION_CHECKLIST.md](docs/PRODUCTION_CHECKLIST.md) | Go-live checklist |
| [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) | Auth-specific setup (OAuth apps, magic links) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Full system architecture and design rationale |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Token system, components, brand theming |
| [ANIMATION_BLUEPRINT.md](ANIMATION_BLUEPRINT.md) | Motion system, 3D hero, scroll choreography |
| [CODE_STANDARDS.md](CODE_STANDARDS.md) | Conventions this codebase follows |

## Scripts

```bash
npm run dev            # start the dev server
npm run build           # production build
npm run start           # serve a production build
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run format            # prettier --write
npm run db:migrate         # prisma migrate dev
npm run db:seed             # tsx prisma/seed.ts
npm run db:studio            # prisma studio (visual DB browser)
```

## Deployment at a glance

- **Vercel** (recommended, and what this repo's PRs already deploy to via
  the Vercel GitHub App): push to a branch, Vercel builds and previews it
  automatically. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the
  environment variables to set in the dashboard.
- **Docker / self-hosted**: `docker compose up -d` brings up the app plus
  Postgres and Redis. See the `docker-compose.yml` header comment and
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## CI

Every push/PR runs lint, typecheck, `prisma validate`, and a production
build via [`.github/workflows/ci.yml`](.github/workflows/ci.yml). There is
no automated test suite yet (see [docs/MAINTENANCE.md](docs/MAINTENANCE.md)).
