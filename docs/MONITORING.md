# Monitoring Setup

Three pieces, already built into the codebase and all fully optional at
the code level — each one no-ops cleanly until its keys are configured, so
enabling monitoring is a config change, not a code change.

## 1. Error monitoring — Sentry

`sentry.server.config.ts`, `sentry.edge.config.ts`, and
`src/instrumentation-client.ts` wire up Sentry for the server, edge
runtime, and browser respectively. All three are gated on
`NEXT_PUBLIC_SENTRY_DSN` (client) / the same DSN server-side — with it
unset, none of them send anything, and the client bundle doesn't even
download the Sentry SDK (`instrumentation-client.ts` dynamically imports
it only when a DSN is present, specifically so an unconfigured deploy
doesn't pay for monitoring code it isn't using).

**To turn it on:**

1. Create a Sentry project (Next.js platform).
2. Set `NEXT_PUBLIC_SENTRY_DSN` (client + server error capture),
   `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` (the latter three
   are build-time only, for source-map upload — see `next.config.ts`'s
   `withSentryConfig` call).
3. Redeploy.

`tracesSampleRate: 0.1` is set in the client config — 10% of transactions
get performance tracing. Adjust in `src/instrumentation-client.ts` and
`sentry.server.config.ts` if you need more/less sampling.

**What to alert on** in Sentry: error rate spikes, and specifically any
error inside `/api/webhooks/stripe` or the checkout Server Actions
(`src/lib/shop/actions/`) — those directly affect revenue and order
correctness.

## 2. Health check — `/api/health`

```bash
curl https://your-domain/api/health
```

Returns:

```json
{
  "status": "healthy",
  "checks": { "database": "ok", "redis": "ok" },
  "timestamp": "..."
}
```

`status: "unhealthy"` and HTTP 503 if the database is unreachable, or if
Redis is configured but unreachable (Redis being entirely unconfigured is
reported as `"not_configured"` and does **not** fail the check — that's
an intentional, supported deployment state, not a degradation).

Point your uptime monitor (UptimeRobot, Better Uptime, Vercel's own
Checks, a status-page provider, whatever you use) at this endpoint. It's
marked `force-dynamic` — every request does a real `SELECT 1` and a real
Redis `PING`, so don't poll it more often than roughly once a minute in
production; a real database round-trip on every check adds up.

## 3. Structured logs — pino

See [MAINTENANCE.md](./MAINTENANCE.md#log-review) for the log-review
routine. In production, `src/lib/logger.ts` emits JSON lines to stdout —
Vercel's log drains and any `docker compose logs`-based setup both pick
this up natively without extra configuration. Sensitive fields
(`password`, `passwordHash`, `token`, `secret`, `authorization`) are
redacted automatically at the logger level, not opt-in per call site.

## What to actually alert on

In rough priority order:

1. `/api/health` returning non-200 for more than a minute or two —
   something is actually down.
2. Sentry error-rate spike, especially in checkout/webhook code paths.
3. Elevated rate-limit rejection counts (`src/lib/auth/rate-limit.ts`) —
   could be an attack, could be a legitimate traffic spike; worth a human
   look either way.
4. Stripe dashboard's own webhook-delivery failure notifications — Stripe
   retries failed webhook deliveries for a while, but a sustained failure
   means orders stop reconciling.

## Setting up alert routing

This repo doesn't prescribe a specific alerting stack — wire Sentry's own
alert rules (Sentry → Alerts) to however your team already gets paged
(email, Slack, PagerDuty — all first-class Sentry integrations), and set
an uptime monitor's notification channel the same way. Nothing here
requires code changes; it's dashboard configuration on the Sentry/
uptime-monitor side.
