# Production Checklist

Go through this before pointing real users at a production deployment.
Each item links to the doc that covers it in depth.

## Environment & secrets

- [ ] `DATABASE_URL` points at a production-grade Postgres (managed
      provider or a properly backed-up self-hosted instance), not a dev
      database.
- [ ] `NEXTAUTH_SECRET` is a fresh, random value (`npx auth secret`) —
      not reused from a dev environment.
- [ ] All Stripe keys are **live mode**, not test mode, if this is an
      actual production launch — double-check `sk_live_`/`pk_live_`
      prefixes.
- [ ] `STRIPE_WEBHOOK_SECRET` matches a webhook endpoint actually pointed
      at this deployment's real domain (see
      [DEPLOYMENT.md](./DEPLOYMENT.md#stripe-webhook-setup)).
- [ ] Cloudinary, Resend, Sentry keys set (or deliberately left unset if
      you're consciously deferring that integration — see
      [INSTALLATION.md](./INSTALLATION.md#6-optional-integrations)).
- [ ] Secrets are stored in the deployment platform's env var UI (or a
      secrets manager), not committed anywhere in git. Confirm
      `.env`/`.env.local` are actually gitignored (`git check-ignore
      .env.local` should print the filename).

## Database

- [ ] `npx prisma migrate deploy` has been run against the production
      database — check `npx prisma migrate status` shows nothing
      pending.
- [ ] The seed script has **not** been run against production data (see
      [DATABASE_MIGRATIONS.md](./DATABASE_MIGRATIONS.md#seeding)).
- [ ] Automated backups are confirmed enabled — see
      [BACKUP_STRATEGY.md](./BACKUP_STRATEGY.md); this is not something to
      assume is on by default.
- [ ] At least one test restore has actually been performed (not just
      planned) — see
      [RECOVERY.md](./RECOVERY.md#restoring-postgresql-from-a-backup).

## Application

- [ ] `npm run typecheck && npm run lint && npm run build` all pass
      clean on the exact commit being deployed.
- [ ] `/api/health` returns 200 against the production database/Redis.
- [ ] At least one full checkout runs end-to-end against Stripe test mode
      *before* flipping to live keys (add a product to cart → checkout →
      confirm the order appears in `/admin/orders` and the confirmation
      email sends).
- [ ] An account with the `ADMIN` role exists and can reach `/admin` —
      confirm this before launch, not after (promoting the first admin
      requires direct database access via `prisma studio` or a query,
      there's no self-service "become admin" flow by design).
- [ ] Security headers are live — `curl -I https://your-domain` and
      confirm `Content-Security-Policy`, `Strict-Transport-Security`,
      `X-Frame-Options` are present (they're set globally in
      `next.config.ts`, but confirm the deployed build actually serves
      them — a CDN/proxy in front can sometimes strip headers).

## Monitoring

- [ ] Sentry DSN configured and confirmed receiving events (trigger a
      test error, check it shows up in the Sentry dashboard).
- [ ] An uptime monitor is pointed at `/api/health`.
- [ ] Someone is actually subscribed to Sentry/uptime-monitor alerts —
      configuring alerting and having nobody receive it is equivalent to
      not having it. See [MONITORING.md](./MONITORING.md).

## Domain & TLS

- [ ] Production domain's DNS points at the deployment (Vercel domain
      settings, or your reverse proxy if self-hosting).
- [ ] TLS certificate is valid and auto-renewing (Vercel handles this
      automatically; self-hosted needs Let's Encrypt or equivalent — see
      [DEPLOYMENT.md](./DEPLOYMENT.md#reverse-proxy--tls)).
- [ ] `NEXT_PUBLIC_APP_URL` matches the real production domain (used in
      generated links — password reset emails, order confirmation
      emails, SEO canonical URLs).

## CI/CD

- [ ] `.github/workflows/ci.yml` is green on the branch being deployed.
- [ ] Confirm what auto-deploys on merge to your production branch
      (Vercel's GitHub integration, if that's your path) actually matches
      what you expect — check Vercel's Git integration settings for which
      branch is "Production."

## Post-launch (first 24–48 hours)

- [ ] Watch Sentry and logs actively, not just passively — a launch is
      exactly when unusual traffic patterns surface bugs that dev/staging
      never hit.
- [ ] Confirm at least one real order completes successfully end-to-end
      (not just the pre-launch test above) if this is an e-commerce
      launch.
- [ ] Revisit [MAINTENANCE.md](./MAINTENANCE.md)'s periodic-check cadence
      and actually put the weekly/monthly items on someone's calendar —
      a checklist that isn't scheduled doesn't happen.
