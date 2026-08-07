"use client";

import { ChevronDown } from "lucide-react";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating";

const options: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="appearance-none rounded-full border border-border-subtle bg-surface py-2.5 pl-4 pr-9 text-sm font-medium text-fg focus:border-brand focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-faint"
      />
    </div>
  );
}
