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

  typedRoutes: true,

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
