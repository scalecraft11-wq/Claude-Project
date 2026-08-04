"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Called when a page is selected — omit if using `hrefForPage` for
   * link-based (SEO-friendly) pagination instead. */
  onPageChange?: (page: number) => void;
  /** Renders page controls as links (e.g. `/blog/page/3`) instead of
   * buttons — use for server-rendered, crawlable paginated lists. */
  hrefForPage?: (page: number) => string;
  siblingCount?: number;
  className?: string;
}

const ELLIPSIS = "ellipsis" as const;

function buildPageRange(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): Array<number | typeof ELLIPSIS> {
  const totalVisible = siblingCount * 2 + 5; // first + last + current + 2 ellipses
  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const pages: Array<number | typeof ELLIPSIS> = [1];
  if (showLeftEllipsis) pages.push(ELLIPSIS);
  for (let page = leftSibling; page <= rightSibling; page += 1) {
    if (page !== 1 && page !== totalPages) pages.push(page);
  }
  if (showRightEllipsis) pages.push(ELLIPSIS);
  pages.push(totalPages);

  return pages;
}

/**
 * Pagination — keyboard/screen-reader accessible (`aria-current="page"`,
 * `nav[aria-label="Pagination"]`), works either as client-side buttons or
 * server-rendered links depending on which callback prop is supplied.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  hrefForPage,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages, siblingCount);

  const renderControl = (
    page: number,
    content: React.ReactNode,
    label: string,
    disabled?: boolean,
  ) => {
    const isCurrent = page === currentPage;
    const sharedClassName = cn(
      "flex size-10 items-center justify-center rounded-sm text-body-sm font-medium",
      "transition-colors duration-fast",
      isCurrent
        ? "bg-button-primary text-button-primary-foreground"
        : "text-content-secondary hover:bg-surface-raised hover:text-content-primary",
      disabled && "pointer-events-none opacity-40",
    );

    if (hrefForPage) {
      return (
        <a
          href={hrefForPage(page)}
          aria-label={label}
          aria-current={isCurrent ? "page" : undefined}
          className={sharedClassName}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        type="button"
        aria-label={label}
        aria-current={isCurrent ? "page" : undefined}
        disabled={disabled}
        onClick={() => onPageChange?.(page)}
        className={sharedClassName}
      >
        {content}
      </button>
    );
  };

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center gap-1", className)}
    >
      {renderControl(
        currentPage - 1,
        <ChevronLeft className="size-4" aria-hidden="true" />,
        "Previous page",
        currentPage <= 1,
      )}

      {pages.map((page, index) =>
        page === ELLIPSIS ? (
          <span
            key={`ellipsis-${index}`}
            className="flex size-10 items-center justify-center text-content-muted"
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </span>
        ) : (
          <React.Fragment key={page}>
            {renderControl(page, page, `Go to page ${page}`)}
          </React.Fragment>
        ),
      )}

      {renderControl(
        currentPage + 1,
        <ChevronRight className="size-4" aria-hidden="true" />,
        "Next page",
        currentPage >= totalPages,
      )}
    </nav>
  );
}
