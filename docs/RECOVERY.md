# Recovery Guide

Incident runbooks. If you're here because something is actively broken,
find the matching section below rather than reading top to bottom.

## The app is down / `/api/health` is failing

1. Check the deployment platform's status first:
   - **Vercel**: dashboard → Deployments — is the latest deploy actually
     live, or stuck/failed? Check the build log.
   - **Docker**: `docker compose ps` — is the `app` container running and
     healthy? `docker compose logs app --tail=200`.
2. Hit `/api/health` directly and read which check failed
   (`database`/`redis`):
   - `database: "error"` — the database is unreachable. Check the
     provider's status page, and confirm `DATABASE_URL` wasn't rotated/
     expired without updating the deploy's env vars.
   - `redis: "error"` — Redis is unreachable but configured. The app
     itself keeps running (rate limiting/caching degrade to per-instance
     in-memory behavior), so this is not the reason the whole app is
     down — keep looking.
3. If the database itself is the problem and it's a managed provider,
   this is usually a provider-side incident — check their status page
   before assuming it's something in this app.
4. If a recent deploy is the cause: roll back.
   - **Vercel**: dashboard → Deployments → find the last known-good
     deployment → "Promote to Production" (or redeploy that commit).
   - **Docker**: `git checkout <last-good-sha>`, rebuild, redeploy — or
     if you tag images, `docker compose up -d` with the previous image
     tag.

## Rolling back a bad deploy

**Vercel**: every deployment is immutable and independently addressable —
promoting an older one to Production is instant and doesn't require a new
build. This is the fastest recovery path for a bad code deploy that
doesn't involve a database migration.

**If the bad deploy included a database migration**: rolling back the
*code* doesn't undo the *schema* change. Check whether the migration is
backward-compatible with the previous code version before rolling back
code alone:

- If the old code still works against the new schema (e.g., a migration
  only added a new nullable column) — safe to just roll back the deploy.
- If not (e.g., a column the old code reads was dropped/renamed) — you
  need a forward-fixing migration, not a rollback. See
  [DATABASE_MIGRATIONS.md](./DATABASE_MIGRATIONS.md#rolling-back) — write
  a new migration that restores what the old code needs, or fix forward
  instead of rolling back.

**Docker**: redeploy the previous image/commit the same way you deployed
the bad one.

## Restoring PostgreSQL from a backup

**Managed provider (Neon/Supabase/RDS point-in-time recovery):** use the
provider's own restore flow (dashboard-driven on all three) to restore to
a point in time before the data loss. This typically creates a *new*
database/instance rather than overwriting the live one — confirm that's
the behavior before relying on it during a real incident, since you'll
need to repoint `DATABASE_URL` at the restored instance afterward.

**Self-hosted, from a `pg_dump`:**

```bash
# Restoring into a fresh database (recommended — never restore directly
# on top of a database still receiving writes):
createdb lumora_digital_restored
gunzip -c /backups/lumora-20260101.sql.gz | psql lumora_digital_restored

# Verify it looks right before cutting over:
psql lumora_digital_restored -c "SELECT count(*) FROM \"Order\";"

# Cut over: point DATABASE_URL at the restored database, redeploy.
```

After cutover, run `npx prisma migrate status` against the restored
database — a restore from before a migration was applied needs
`prisma migrate deploy` to catch it back up, same as any fresh database.

## Compromised or leaked credentials

**Any Stripe key** (secret or webhook secret): roll immediately in the
Stripe dashboard (Developers → API keys / Webhooks). Rolling a webhook
signing secret requires updating `STRIPE_WEBHOOK_SECRET` and redeploying
before the old secret stops being valid, or webhook deliveries fail in
the gap.

**`NEXTAUTH_SECRET`**: rotate it (generate a new value, redeploy). This
signs/encrypts session JWTs — rotating it invalidates every existing
session immediately (every user gets signed out and must log back in).
There's no partial mitigation here; do it as soon as compromise is
suspected, the forced logout is the acceptable cost.

**`DATABASE_URL` credentials**: rotate the password at the provider level
first, confirm the app can still connect with the new credentials
deployed, *then* the old credentials stop working — don't do this in the
reverse order or you'll take the app down mid-rotation.

**Cloudinary/Resend/Sentry keys**: roll at the provider, update the env
var, redeploy. None of these have session-invalidation side effects like
`NEXTAUTH_SECRET` does.

**A user's `tokenVersion`-based session revocation** (not a credential
leak, but related): `src/auth.ts`'s JWT callback re-checks
`User.tokenVersion` against the database at most once a minute. Bumping
a specific user's `tokenVersion` (e.g., via `prisma studio` or a direct
query) forces that one user's existing sessions to re-authenticate within
a minute, without touching `NEXTAUTH_SECRET` or affecting anyone else —
this is the right tool for "this one account looks compromised," as
opposed to `NEXTAUTH_SECRET` rotation which is the tool for "the secret
itself leaked."

## Stuck/inconsistent order state (payment succeeded, order didn't update)

This means a Stripe webhook delivery failed or was missed. Recovery path:

1. Stripe dashboard → the specific PaymentIntent/Checkout Session → check
   its actual status.
2. Stripe dashboard → Webhooks → the endpoint → check delivery attempts
   for that event; Stripe retries automatically for a while, but you can
   also manually resend a specific event from this screen.
3. If Stripe shows delivery succeeded but the order still looks wrong,
   the bug is in `/api/webhooks/stripe`'s handler logic itself — check
   Sentry/logs for an error at that request's timestamp before assuming
   it's a Stripe-side problem.

## When none of the above is enough

If a recovery scenario doesn't fit any runbook above, the general
principle: **prefer restoring from a known-good state over attempting a
clever in-place fix under pressure.** A restored backup you've tested
before (see [BACKUP_STRATEGY.md](./BACKUP_STRATEGY.md)) is more
predictable than a hand-rolled data repair invented during an incident.
