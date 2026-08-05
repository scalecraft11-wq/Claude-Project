import type { captureRequestError } from "@sentry/nextjs";

/**
 * Next.js instrumentation hook — runs once per server/edge runtime
 * instance at boot, before any request is handled. Loads the matching
 * Sentry config for whichever runtime actually started.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export const onRequestError: typeof captureRequestError = async (...args) => {
  const Sentry = await import("@sentry/nextjs");
  return Sentry.captureRequestError(...args);
};
