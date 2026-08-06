"use client";

import { X } from "lucide-react";
import { categories } from "@/lib/data/products";
import type { Category } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

export type FilterState = {
  categories: Category[];
  maxPrice: number;
  sizes: number[];
};

const allSizes = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];
export const PRICE_CEILING = 250;

export function Filters({
  filters,
  setFilters,
  onClear,
}: {
  filters: FilterState;
  setFilters: (updater: (prev: FilterState) => FilterState) => void;
  onClear: () => void;
}) {
  function toggleCategory(cat: Category) {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat],
    }));
  }

  function toggleSize(size: number) {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.sizes.length > 0 ||
    filters.maxPrice < PRICE_CEILING;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold uppercase tracking-tight">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-medium text-fg-faint hover:text-brand"
          >
            <X size={13} />
            Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-fg-faint">
          Category
        </h4>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <label
              key={cat.name}
              className="flex cursor-pointer items-center gap-3 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(cat.name)}
                onChange={() => toggleCategory(cat.name)}
                className="h-4 w-4 rounded border-border-strong bg-transparent accent-[#d7ff3f]"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-fg-faint">
          Max Price: {formatPrice(filters.maxPrice)}
        </h4>
        <input
          type="range"
          min={40}
          max={PRICE_CEILING}
          step={10}
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="w-full accent-[#d7ff3f]"
        />
      </div>

      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-fg-faint">
          Size
        </h4>
        <div className="flex flex-wrap gap-2">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "flex h-9 min-w-9 items-center justify-center rounded-lg border px-1.5 text-xs font-semibold transition-colors",
                filters.sizes.includes(size)
                  ? "border-brand bg-brand text-black"
                  : "border-border-subtle text-fg-muted hover:border-border-strong"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
