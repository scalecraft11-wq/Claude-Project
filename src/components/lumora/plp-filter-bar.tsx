"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ProductSort } from "@/lib/shop/catalog";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

export function PlpFilterBar({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  const currentSort =
    (searchParams.get("sort") as ProductSort | null) ?? "newest";
  const inStockOnly = searchParams.get("inStock") === "1";

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-hairline-subtle pb-4">
      <p className="text-body-sm text-content-secondary">
        {resultCount} {resultCount === 1 ? "product" : "products"}
      </p>
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="in-stock-only"
            checked={inStockOnly}
            onCheckedChange={(checked) =>
              updateParam("inStock", checked ? "1" : null)
            }
          />
          <Label htmlFor="in-stock-only" className="text-body-sm">
            In stock only
          </Label>
        </div>
        <Select
          value={currentSort}
          onValueChange={(value) => updateParam("sort", value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
