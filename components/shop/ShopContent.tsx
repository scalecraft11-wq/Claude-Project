"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Filters, PRICE_CEILING, type FilterState } from "@/components/shop/Filters";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SortDropdown, type SortOption } from "@/components/shop/SortDropdown";
import { products } from "@/lib/data/products";
import type { Category } from "@/lib/types";

const emptyFilters: FilterState = {
  categories: [],
  maxPrice: PRICE_CEILING,
  sizes: [],
};

export function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as Category | null;
  const initialQuery = searchParams.get("q") ?? "";
  const initialSort = (searchParams.get("sort") === "new" ? "newest" : "featured") as SortOption;

  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    ...emptyFilters,
    categories: initialCategory ? [initialCategory] : [],
  });

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.categories.length > 0 && !filters.categories.includes(p.category))
        return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.sizes.length > 0 && !p.sizes.some((s) => filters.sizes.includes(s)))
        return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    list = [...list];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => Number(b.isBestseller) - Number(a.isBestseller));
    }
    return list;
  }, [filters, query, sort]);

  function clearFilters() {
    setFilters(emptyFilters);
    setQuery("");
  }

  return (
    <div className="py-10 lg:py-14">
      <Container>
        <div className="mb-10 flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
            Shop All
          </span>
          <h1 className="font-display text-5xl font-extrabold uppercase tracking-tight sm:text-6xl">
            Every Pair
          </h1>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-full border border-border-subtle bg-surface py-2.5 px-5 text-sm text-fg placeholder:text-fg-faint focus:border-brand focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border border-border-subtle px-4 py-2.5 text-sm font-medium text-fg-muted lg:hidden"
            >
              <SlidersHorizontal size={14} />
              Filters
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Filters filters={filters} setFilters={setFilters} onClear={clearFilters} />
            </div>
          </aside>

          <div>
            <p className="mb-6 text-sm text-fg-faint">
              {filtered.length} {filtered.length === 1 ? "product" : "products"}
            </p>
            <ProductGrid products={filtered} onClear={clearFilters} />
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            className="fixed inset-0 z-[85] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-bg-elevated border-l border-border-subtle px-6 py-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mb-6 flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5"
              >
                <X size={18} />
              </button>
              <Filters filters={filters} setFilters={setFilters} onClear={clearFilters} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
