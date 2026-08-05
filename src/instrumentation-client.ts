const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

/** Client-side counterpart — captures browser errors/replays. The
 * `@sentry/nextjs` browser SDK is ~130KB; a static top-level import would
 * ship it to every page's shared bundle even when no DSN is configured
 * (the common case pre-launch). Gating the import itself behind the DSN
 * check — not just Sentry's own `enabled` flag — keeps that weight out of
 * the shared chunk entirely until monitoring is actually wired up. */
let captureRouterTransitionStart:
  | ((url: string, navigationType: "push" | "replace" | "traverse") => void)
  | undefined;

if (dsn) {
  import("@sentry/nextjs").then((Sentry) => {
    Sentry.init({ dsn, tracesSampleRate: 0.1 });
    captureRouterTransitionStart = Sentry.captureRouterTransitionStart;
  });
}

export const onRouterTransitionStart = (
  url: string,
  navigationType: "push" | "replace" | "traverse",
) => captureRouterTransitionStart?.(url, navigationType);
