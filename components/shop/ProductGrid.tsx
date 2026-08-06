"use client";

import { SearchX } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";

export function ProductGrid({
  products,
  onClear,
}: {
  products: Product[];
  onClear?: () => void;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
          <SearchX size={26} className="text-fg-faint" />
        </div>
        <p className="text-lg font-medium text-fg">No products found</p>
        <p className="max-w-sm text-sm text-fg-muted">
          Try adjusting your filters or search term to find what you&rsquo;re
          looking for.
        </p>
        {onClear && (
          <Button variant="outline" onClick={onClear}>
            Clear Filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <motion.div layout className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            layout
            exit={{ opacity: 0, scale: 0.92 }}
          >
            <ProductCard product={product} index={i} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
