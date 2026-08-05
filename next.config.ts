import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

/**
 * next.config.ts
 *
 * Kept intentionally small at the foundation stage. Anything here should be
 * infrastructure, not feature logic — route-level concerns (redirects,
 * per-brand rewrites) get added alongside the routes that need them.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Traces the minimal server + dependency graph into `.next/standalone`
  // (a self-contained `server.js` plus only the node_modules it actually
  // needs) — what the Dockerfile copies into the runtime image instead of
  // the full node_modules tree. Harmless on Vercel, which uses its own
  // build output pipeline regardless of this setting.
  output: "standalone",

  // Deliberately off: typed routes validate literal `href` strings written
  // directly in JSX, but this codebase's whole component library is built
  // around reusable components that accept `href` as a runtime string prop
  // (Navbar/Footer/MegaMenu items, every card, CtaBand) sourced from
  // config/data files rather than typed at the call site — turning this on
  // makes `next/link`'s `href` reject that entire, intentional pattern.
  typedRoutes: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    // Only ever serves the hand-authored, static Lumora Skin placeholder
    // under /public — never a user- or CMS-supplied SVG — so this doesn't
    // reopen the stored-XSS risk `dangerouslyAllowSVG` normally carries.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei", "motion"],
    // The admin Media Library uploads images as base64 data URIs through a
    // Server Action (no external object storage configured) — the default
    // 1mb body limit is too small for a real photo, so it's raised here.
    serverActions: { bodySizeLimit: "4mb" },
  },

  async headers() {
    // Not a nonce-based CSP (would need per-request middleware wiring to
    // thread a nonce through every inline script Next.js itself emits) —
    // 'unsafe-inline'/'unsafe-eval' stay open on script-src for that
    // reason, but every other directive is real: no plugin/object embeds,
    // no framing by another origin, and image/connect sources scoped to
    // exactly the external hosts this app actually talks to.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com",
      "font-src 'self' data:",
      "connect-src 'self' https://api.stripe.com https://*.sentry.io",
      "frame-src https://checkout.stripe.com https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

// Wraps the build with Sentry's webpack plugin (source-map upload, release
// tagging). Source-map upload itself only activates with SENTRY_AUTH_TOKEN
// set — silent/no-op otherwise, same graceful-degradation posture as the
// runtime SDK init in sentry.*.config.ts.
export default withSentryConfig(nextConfig, {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  webpack: { treeshake: { removeDebugLogging: true } },
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
