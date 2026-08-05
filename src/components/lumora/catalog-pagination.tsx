"use client";

import { Pagination } from "@/components/ui/pagination";

/** Thin wrapper so the `hrefForPage` callback — which can't cross the
 * Server → Client Component boundary as a prop — is built here, inside
 * the Client Component, from plain serializable data instead. */
export function CatalogPagination({
  currentPage,
  totalPages,
  basePath,
  params,
  className,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  params: Record<string, string | undefined>;
  className?: string;
}) {
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      className={className}
      hrefForPage={(page) => {
        const query = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value) query.set(key, value);
        }
        query.set("page", String(page));
        return `${basePath}?${query.toString()}`;
      }}
    />
  );
}
