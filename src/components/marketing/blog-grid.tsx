"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { BlogCard } from "@/components/marketing/blog-card";
import { Skeleton } from "@/components/loading/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { SearchBar } from "@/components/shared/search-bar";
import { withMinimumDuration } from "@/lib/loading/with-minimum-duration";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/lib/data/blog-posts";
import { blogCategories } from "@/lib/data/blog-posts";

export interface BlogGridProps {
  posts: BlogPost[];
  className?: string;
}

const PAGE_SIZE = 3;
const FILTER_DELAY_MS = 350;

async function filterPosts(
  posts: BlogPost[],
  category: string,
  query: string,
): Promise<BlogPost[]> {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = posts.filter((post) => {
    const matchesCategory = category === "All" || post.category === category;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      post.title.toLowerCase().includes(normalizedQuery) ||
      post.excerpt.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  return withMinimumDuration(Promise.resolve(filtered), FILTER_DELAY_MS);
}

/**
 * Blog index — category filter + debounced search, both driving a real
 * (if simulated) async request behind a skeleton loading state rather
 * than an instant in-memory splice. A jump-cut filter reads as broken on
 * a page whose whole premise is considered motion; ~350ms with a
 * `withMinimumDuration` floor (ANIMATION_BLUEPRINT.md §2) is enough to
 * register as "the page did something" without feeling sluggish.
 */
export function BlogGrid({ posts, className }: BlogGridProps) {
  const [category, setCategory] = React.useState<string>("All");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [results, setResults] = React.useState(posts);
  const [isLoading, setIsLoading] = React.useState(false);
  const requestId = React.useRef(0);

  React.useEffect(() => {
    const thisRequest = (requestId.current += 1);
    setIsLoading(true);

    filterPosts(posts, category, query).then((filtered) => {
      if (requestId.current !== thisRequest) return;
      setResults(filtered);
      setPage(1);
      setIsLoading(false);
    });
  }, [posts, category, query]);

  const totalPages = Math.max(Math.ceil(results.length / PAGE_SIZE), 1);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={className}>
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="group"
          aria-label="Filter posts by category"
          className="flex flex-wrap gap-3"
        >
          {blogCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "rounded-full border px-4 py-2 text-body-sm font-medium transition-colors duration-fast",
                category === cat
                  ? "border-accent bg-accent-subtle text-accent"
                  : "border-hairline-subtle text-content-secondary hover:text-content-primary",
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <SearchBar
          placeholder="Search posts..."
          onSearch={setQuery}
          aria-label="Search blog posts"
          className="sm:max-w-xs"
        />
      </div>

      <p aria-live="polite" className="sr-only">
        {isLoading
          ? "Loading posts"
          : `Showing ${results.length} post${results.length === 1 ? "" : "s"}.`}
      </p>

      <div className="mt-10 min-h-[26rem]">
        {isLoading ? (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <div key={index} className="grid gap-4">
                <Skeleton className="aspect-[16/10] w-full rounded-sm" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="py-16 text-center text-body-md text-content-secondary">
            No posts match &ldquo;{query}&rdquo;. Try a different search or
            category.
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${query}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
            >
              {pageItems.map((post) => (
                <BlogCard
                  key={post.slug}
                  id={post.slug}
                  href={`#${post.slug}`}
                  category={post.category}
                  title={post.title}
                  excerpt={post.excerpt}
                  publishedAt={post.publishedAt}
                  authorName={post.authorName}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {!isLoading && results.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          className="mt-12 justify-center"
        />
      )}
    </div>
  );
}
