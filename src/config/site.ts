import { clientEnv } from "@/lib/env";

/**
 * Site-wide constants referenced by SEO utilities, metadata defaults, and
 * (later) navigation config. Kept brand-agnostic here; brand-specific copy
 * (Lumora Skin's own name/description) lives alongside its routes once
 * those are built.
 */
export const siteConfig = {
  name: "Lumora Digital",
  title: "Lumora Digital — Premium web design for luxury brands",
  description:
    "Lumora Digital designs and builds premium digital experiences for luxury skincare, beauty, cosmetics, fashion, healthcare, and wellness brands.",
  url: clientEnv.NEXT_PUBLIC_APP_URL,
  ogImage: "/og-default.png",
  links: {
    twitter: "https://twitter.com",
  },
} as const;
