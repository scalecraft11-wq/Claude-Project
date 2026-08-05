# Installation Guide

First-time local setup. For deploying somewhere else, see
[DEPLOYMENT.md](./DEPLOYMENT.md) instead.

## Prerequisites

- Node.js >= 20.9.0 (the repo is developed against 22 — see `.nvmrc`-less
  `engines` field in `package.json`)
- npm (ships with Node)
- A PostgreSQL 14+ database — a local install, Docker, or a managed
  provider (Neon, Supabase, Railway, RDS all work; Prisma just needs a
  connection string)
- Redis — optional. Without it, rate limiting falls back to an in-memory
  limiter and caching is skipped entirely (`src/lib/redis.ts`,
  `src/lib/cache.ts`). Fine for local dev, not for a real multi-instance
  production deploy.

Everything else (Stripe, Cloudinary, Resend, Sentry, Google/GitHub OAuth)
is genuinely optional — the relevant feature no-ops or degrades gracefully
without it. You do not need real API keys for any of them to run the app
locally.

## 1. Clone and install

```bash
git clone <this-repo>
cd lumora-digital
npm install
```

`npm install` runs `prisma generate` automatically via the `postinstall`
script — it needs `prisma/schema.prisma` present but not a live database
connection.

## 2. Get a database running

**Option A — Docker (fastest):**

```bash
docker run -d --name lumora-postgres \
  -e POSTGRES_USER=lumora -e POSTGRES_PASSWORD=lumora -e POSTGRES_DB=lumora_digital \
  -p 5432:5432 postgres:16-alpine
```

**Option B — a local Postgres install:** create a database and user any
way you normally would; just note the connection string.

**Option C — a managed provider:** copy the connection string it gives you.

## 3. Configure environment variables

```bash
cp .env.example .env.local
```

At minimum, set:

```bash
DATABASE_URL=postgresql://lumora:lumora@localhost:5432/lumora_digital
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: npx auth secret>
```

Everything else in `.env.example` can stay blank for local development.
See `src/lib/env.ts` for the full validated schema — it's the source of
truth for what's required vs. optional.

## 4. Run migrations and seed data

```bash
npx prisma migrate dev
npx tsx prisma/seed.ts   # optional, but recommended — every admin page
                         # and the storefront catalog expect real rows
```

`prisma migrate dev` creates the schema from `prisma/migrations/`. See
[DATABASE_MIGRATIONS.md](./DATABASE_MIGRATIONS.md) for what this actually
does and how to write new migrations.

The seed script creates demo users too — check `prisma/seed.ts`'s console
output for the seeded admin/customer login credentials.

## 5. Start the dev server

```bash
npm run dev
```

- Agency site: http://localhost:3000
- Lumora Skin storefront: http://localhost:3000/lumora
- Admin dashboard: http://localhost:3000/admin (needs an ADMIN-role user —
  seeded by step 4, or promote one via `npx prisma studio`)

## 6. Optional integrations

Each of these is fully optional; add the keys only when you want to
exercise that feature locally:

| Integration | Env vars | What breaks without it |
|---|---|---|
| Stripe | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Checkout can't create a real payment session |
| Cloudinary | `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Admin media uploads fail |
| Resend | `RESEND_API_KEY`, `RESEND_FROM_EMAIL` | Magic-link/order-confirmation emails aren't sent (link/content still logged to the console in dev) |
| Sentry | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN` | No error monitoring — the SDK stays fully inert without a DSN (see `src/instrumentation-client.ts`) |
| Google/GitHub OAuth | `GOOGLE_CLIENT_ID`/`SECRET`, `GITHUB_CLIENT_ID`/`SECRET` | Only the credentials + email-magic-link sign-in methods are available |

Use Stripe's test-mode keys only (`sk_test_...`/`pk_test_...`) — never
live keys in this project.

## Verifying the install

```bash
npm run typecheck
npm run lint
npm run build
curl http://localhost:3000/api/health   # after `npm run dev` / `npm start`
```

`/api/health` returns 200 with `"status": "healthy"` once the database is
reachable (Redis is reported but doesn't fail the check if absent).

## Troubleshooting

- **`Invalid server environment variables`** at boot — a set env var
  fails its Zod schema in `src/lib/env.ts` (e.g. a non-URL `DATABASE_URL`,
  a non-email `RESEND_FROM_EMAIL`). The console error names the exact
  field.
- **`UntrustedHost` / `/api/auth/session` 500s** — `NEXTAUTH_URL` doesn't
  match the host/port you're actually running on. Either match them, or
  rely on `trustHost: true` (already set in `src/auth.config.ts`) which
  covers this in most cases.
- **Prisma client type errors right after pulling new schema changes** —
  run `npx prisma generate` (this only happens automatically on
  `npm install`, not on every `git pull`).
