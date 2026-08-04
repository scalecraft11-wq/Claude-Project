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
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "@react-three/drei", "motion"],
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

export default nextConfig;
