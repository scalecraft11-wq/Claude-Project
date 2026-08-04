import { ChevronRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  /** Omit on the final (current) item — it renders as plain text, not a link. */
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb trail — DESIGN_SYSTEM.md §29 (semantic structure) and
 * ARCHITECTURE.md §22 (SEO). Emits its own `BreadcrumbList` JSON-LD so
 * every route that renders breadcrumbs gets the structured data for free,
 * instead of duplicating it in each route's metadata.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const jsonLd = breadcrumbJsonLd(
    items.map((item) => ({ name: item.label, path: item.href ?? "/" })),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={cn(className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li
                key={`${item.label}-${index}`}
                className="flex items-center gap-1.5"
              >
                {index > 0 && (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-content-muted"
                    aria-hidden="true"
                  />
                )}
                {isLast || !item.href ? (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className="text-body-sm font-medium text-content-primary"
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-body-sm text-content-secondary transition-colors duration-fast hover:text-content-primary"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
