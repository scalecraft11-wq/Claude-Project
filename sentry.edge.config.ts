import * as Sentry from "@sentry/nextjs";

/** Edge runtime counterpart of sentry.server.config.ts (middleware and any
 * Edge Route Handlers) — same DSN-gated no-op when unconfigured. */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
