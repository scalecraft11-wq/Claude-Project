"use client";

import Link from "next/link";
import * as React from "react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Faq } from "@/components/shared/faq";
import { SearchBar } from "@/components/shared/search-bar";
import type { FaqCategory } from "@/lib/data/faqs";

export interface FaqBrowserProps {
  categories: FaqCategory[];
}

/**
 * FAQ index — search narrows every category's items in place rather than
 * flattening to a single result list, so a category anchor (e.g. the
 * cookie banner's link to `#privacy-and-cookies`) keeps working even
 * after a search has been typed.
 */
export function FaqBrowser({ categories }: FaqBrowserProps) {
  const [query, setQuery] = React.useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = categories
    .map((category) => ({
      ...category,
      items:
        normalizedQuery.length === 0
          ? category.items
          : category.items.filter(
              (item) =>
                item.question.toLowerCase().includes(normalizedQuery) ||
                item.answer.toLowerCase().includes(normalizedQuery),
            ),
    }))
    .filter((category) => category.items.length > 0);

  const totalMatches = filteredCategories.reduce(
    (sum, category) => sum + category.items.length,
    0,
  );

  return (
    <div className="grid gap-16">
      <div className="mx-auto grid w-full max-w-xl gap-3">
        <SearchBar
          placeholder="Search questions..."
          onSearch={setQuery}
          aria-label="Search FAQ"
        />
        <p aria-live="polite" className="sr-only">
          {normalizedQuery
            ? `Showing ${totalMatches} matching question${totalMatches === 1 ? "" : "s"}.`
            : ""}
        </p>
      </div>

      {filteredCategories.length === 0 ? (
        <p className="py-8 text-center text-body-md text-content-secondary">
          No questions match &ldquo;{query}&rdquo;. Try a different search, or{" "}
          <Link
            href="/contact"
            className="text-content-primary underline underline-offset-2"
          >
            ask us directly
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-16">
          {filteredCategories.map((category) => (
            <section
              key={category.slug}
              id={category.slug}
              className="scroll-mt-28"
            >
              <div className="grid gap-8">
                <SectionHeading title={category.category} />
                <Faq items={category.items} />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
