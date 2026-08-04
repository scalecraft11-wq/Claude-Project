import { siteConfig } from "@/config/site";

/**
 * Structured-data builders — ARCHITECTURE.md §22 (SEO Architecture),
 * DESIGN_SYSTEM.md's editorial/commerce split. Each function returns a
 * plain JSON-LD object; render it with:
 *
 *   <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
 *
 * from the route that owns that content type — this module only builds
 * the data, it never renders anything itself.
 */

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, path }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: new URL(path, siteConfig.url).toString(),
    })),
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  imageUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    url: new URL(article.path, siteConfig.url).toString(),
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: { "@type": "Person", name: article.authorName },
    ...(article.imageUrl ? { image: [article.imageUrl] } : {}),
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  path: string;
  imageUrl: string;
  priceCents: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.imageUrl],
    offers: {
      "@type": "Offer",
      url: new URL(product.path, siteConfig.url).toString(),
      priceCurrency: product.currency ?? "USD",
      price: (product.priceCents / 100).toFixed(2),
      availability: `https://schema.org/${product.availability ?? "InStock"}`,
    },
  };
}
