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
