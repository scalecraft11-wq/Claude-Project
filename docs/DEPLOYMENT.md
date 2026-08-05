# Deployment Guide

Two supported paths: **Vercel** (what this repo's PRs already deploy to)
and **Docker** (for self-hosting on your own infrastructure). Pick one —
they're not meant to run side by side against the same database unless
you know what you're doing with migrations.

## Option A — Vercel

This repo already has Vercel's GitHub App connected: every push to a
branch with an open PR gets a Preview deployment automatically, and the
production branch deploys on merge. `vercel.json` at the repo root just
pins the framework preset:

```json
{ "framework": "nextjs" }
```

You don't need the Vercel CLI or a manual `vercel deploy` for the normal
flow — the GitHub integration handles it. What you do need is the
project's environment variables set in the Vercel dashboard
(**Project → Settings → Environment Variables**), since Vercel doesn't
read `.env.local` (that file is gitignored and never reaches Vercel).

### Required for the app to boot

| Variable | Notes |
|---|---|
| `DATABASE_URL` | A managed Postgres reachable from Vercel's network — Neon, Supabase, RDS, etc. Vercel's own serverless functions are short-lived, so prefer a provider with connection pooling (Neon/Supabase both have one built in; for RDS put PgBouncer in front). |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32`, or `npx auth secret`. One value, shared across Preview and Production — rotating it invalidates every existing session. |

`NEXTAUTH_URL` is intentionally **not** required: `trustHost: true` in
`src/auth.config.ts` lets NextAuth trust the Host header Vercel's edge
network already validates, which is what makes Preview deployments (a
fresh, unpredictable URL every time) work without per-deployment config.

### Recommended for full functionality

Set these per-environment (Vercel lets Preview and Production have
different values — use Stripe/Cloudinary test creds on Preview, live
creds only on Production):

- `REDIS_URL` — a managed Redis (Upstash's Redis-over-HTTP works well on
  serverless; anything speaking the standard Redis protocol works via
  `src/lib/redis.ts`). Without it, every Vercel function invocation gets
  its own in-memory rate limiter/cache — functionally fine, just not
  shared across instances.
- `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`,
  `STRIPE_WEBHOOK_SECRET` — checkout and the `/api/webhooks/stripe`
  handler need all three. The webhook secret is per-endpoint — see below.
- `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
  `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`,
  `SENTRY_PROJECT` — the auth token + org/project are build-time only
  (source-map upload); the DSN is what actually turns monitoring on at
  runtime. Leaving all four unset is a fully supported, zero-cost state.
- `GOOGLE_CLIENT_ID`/`SECRET`, `GITHUB_CLIENT_ID`/`SECRET`

### Stripe webhook setup

Stripe needs an endpoint URL to send events to, and that URL doesn't
exist until the first deploy — so this is a two-step, chicken-and-egg
process:

1. Deploy once (Stripe env vars can be blank).
2. In the Stripe dashboard, add a webhook endpoint pointing at
   `https://<your-domain>/api/webhooks/stripe`, copy its signing secret,
   set it as `STRIPE_WEBHOOK_SECRET` in Vercel, and redeploy (or just wait
   for the next push — env var changes apply to the next build).

### Database migrations on Vercel

Vercel does **not** run `prisma migrate deploy` automatically. Run it
yourself, pointed at the same `DATABASE_URL` your Vercel deployment uses,
before or immediately after the deploy that introduces the schema change
— see [DATABASE_MIGRATIONS.md](./DATABASE_MIGRATIONS.md).

### First deploy checklist

1. Set `DATABASE_URL` and `NEXTAUTH_SECRET` in Vercel.
2. Run `prisma migrate deploy` against that same database.
3. Push/merge — Vercel builds and deploys.
4. Check `https://<your-domain>/api/health` returns 200.
5. Add the remaining integration keys as you turn each one on; each is a
   redeploy (env var changes require a new deployment to take effect).

## Option B — Docker

For self-hosting outside Vercel. `docker-compose.yml` brings up the app
plus Postgres and Redis together:

```bash
cp .env.example .env
docker compose up -d --build
docker compose exec app npx prisma migrate deploy
docker compose exec app npx tsx prisma/seed.ts   # optional demo data
curl http://localhost:3000/api/health
```

`DATABASE_URL`/`REDIS_URL` are pre-wired in `docker-compose.yml` to the
`postgres`/`redis` service names — don't set them in `.env` yourself
unless you're pointing at external managed services instead of the
bundled containers. Every other variable comes from `.env`, same as
local dev.

### Building the image standalone (no compose)

```bash
docker build -t lumora-digital .
docker run -p 3000:3000 --env-file .env \
  -e DATABASE_URL=postgresql://user:pass@your-postgres-host:5432/db \
  -e REDIS_URL=redis://your-redis-host:6379 \
  lumora-digital
```

The image uses Next.js's `output: "standalone"` build (`next.config.ts`)
— a self-contained `server.js` plus only the `node_modules` it actually
needs, not the full dependency tree. It runs as a non-root user and
exposes a `HEALTHCHECK` against `/api/health`.

Migrations still need to be run explicitly against whatever database the
container points at:

```bash
docker run --rm --env-file .env lumora-digital npx prisma migrate deploy
```

### Reverse proxy / TLS

The image serves plain HTTP on port 3000. Put a reverse proxy (nginx,
Caddy, Traefik) in front for TLS termination and a real domain — this
repo doesn't include one, since the right choice depends entirely on your
hosting environment.

## Which one should I use?

Use **Vercel** unless you have a specific reason not to (data residency,
existing infrastructure, cost at a scale where serverless stops making
sense). It's what this project is built and tested against, and it's
where the existing PR previews already deploy.
