import * as Sentry from "@sentry/nextjs";

/** No-ops cleanly when NEXT_PUBLIC_SENTRY_DSN isn't set — same graceful-
 * degradation posture as every other optional integration in this app
 * (Stripe, Cloudinary, Redis): monitoring is valuable in production, but
 * its absence must never break local dev or an unconfigured deployment. */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
});
