# Maintenance Guide

Routine upkeep for keeping the app healthy after launch. This is not an
incident runbook — for "something broke, fix it now," see
[RECOVERY.md](./RECOVERY.md).

## Dependency updates

```bash
npm outdated          # see what's behind
npm update             # bump within semver ranges
npx npm-check-updates   # see what's behind *outside* semver ranges too
```

After any dependency bump:

```bash
npm run typecheck
npm run lint
npm run build
```

Pay particular attention to major-version bumps of: `next`, `react`/
`react-dom`, `prisma`/`@prisma/client`, `next-auth`, `@sentry/nextjs` —
these five have historically had the most breaking API changes across
major versions in this stack. Check each package's own migration guide
before bumping a major version, not just the changelog summary.

Security patches specifically:

```bash
npm audit
npm audit fix   # non-breaking fixes only — review anything it can't auto-fix
```

## Log review

Structured logs go through `src/lib/logger.ts` (pino) — in production
they're JSON lines, one per event, meant to be shipped to whatever log
aggregator your host provides (Vercel's own log drains, or a self-hosted
stack's `docker compose logs`). Look for:

- Repeated `error`-level entries from the same route — usually the
  earliest signal of a real problem, ahead of user reports.
- Rate-limit rejections (`src/lib/auth/rate-limit.ts`) spiking — could be
  legitimate traffic growth or could be a credential-stuffing attempt.
- `/api/webhooks/stripe` failures — a missed webhook (bad signature, 5xx
  response) means an order can get stuck without its payment status ever
  updating. See [MONITORING.md](./MONITORING.md) for what to alert on.

## Database maintenance

- **Vacuum/analyze**: if self-hosting Postgres directly, `autovacuum` is
  on by default and is almost always sufficient — don't disable it.
  Managed providers (Neon, Supabase, RDS) handle this for you.
- **Index review**: as real traffic patterns emerge, revisit
  `prisma/schema.prisma`'s `@@index` declarations against actual slow
  queries (`EXPLAIN ANALYZE` the specific query, don't guess). Adding an
  index is itself a schema migration — see
  [DATABASE_MIGRATIONS.md](./DATABASE_MIGRATIONS.md).
- **Connection count**: serverless (Vercel) deployments can exhaust a
  small Postgres's max connections under load if you're not going through
  a pooler — see the note at the end of DATABASE_MIGRATIONS.md.

## Key rotation

| Key | How to rotate | Impact |
|---|---|---|
| `NEXTAUTH_SECRET` | Generate a new one, update env var, redeploy | Invalidates every existing session — every logged-in user is signed out |
| `STRIPE_SECRET_KEY` / webhook secret | Roll in the Stripe dashboard, update env var | No impact on in-flight checkouts if rotated between deploys; do during low traffic |
| `CLOUDINARY_API_SECRET` | Roll in Cloudinary dashboard, update env var | Uploads fail until the new secret is deployed |
| `DATABASE_URL` password | Rotate at the provider, update env var, redeploy | Brief downtime unless the provider supports zero-downtime credential rotation |
| OAuth client secrets (Google/GitHub) | Roll in the provider console, update env var | OAuth sign-in fails until redeployed; existing sessions unaffected |

Rotate on a schedule (annually, at minimum) and immediately on any
suspected leak — see [RECOVERY.md](./RECOVERY.md)'s key-compromise runbook.

## No automated test suite yet

There is currently no unit/integration/e2e test suite in this repo —
correctness is enforced by TypeScript's type system, ESLint, and manual
verification (typecheck + lint + build + a live smoke test) before every
change ships. If you add one, wire it into
`.github/workflows/ci.yml` alongside the existing lint/typecheck/build
steps so it actually gates merges.

## Periodic checks

A reasonable cadence, adjust to actual traffic:

- **Weekly**: skim error logs / Sentry issues, check `/api/health`.
- **Monthly**: `npm outdated`, review Stripe/Cloudinary/Resend dashboards
  for anything unusual (failed charges, quota usage).
- **Quarterly**: dependency major-version review, re-run the Lighthouse
  audit workflow (performance regressions creep in silently as features
  get added).
- **Annually**: rotate long-lived secrets, review RBAC role assignments
  in `/admin` for accounts that shouldn't still have access.
