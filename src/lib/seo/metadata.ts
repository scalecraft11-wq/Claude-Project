import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  /** Set for any route that must never be indexed (admin, account pages). */
  noIndex?: boolean;
}

/**
 * Central metadata builder — ARCHITECTURE.md §22 (SEO Architecture).
 * Every route calls this from its own `generateMetadata()` rather than
 * hand-assembling a `Metadata` object, so title templating, canonical
 * URLs, and Open Graph/Twitter defaults never drift between routes.
 */
export function buildMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  ogImage = siteConfig.ogImage,
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const resolvedTitle = title
    ? `${title} · ${siteConfig.name}`
    : siteConfig.title;
  const url = new URL(path, siteConfig.url).toString();

  return {
    title: resolvedTitle,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      siteName: siteConfig.name,
      images: [{ url: ogImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
