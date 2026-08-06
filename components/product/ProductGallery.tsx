"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/types";
import { SneakerArt } from "@/components/ui/SneakerArt";
import { cn, getSilhouette } from "@/lib/utils";

const variants = [
  { label: "Side", transform: "" },
  { label: "Angle", transform: "rotate(-6deg) scale(1.08)" },
  { label: "Reverse", transform: "scaleX(-1)" },
  { label: "Detail", transform: "rotate(4deg) scale(1.35)" },
];

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const silhouette = getSilhouette(product.category);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-border-subtle bg-gradient-to-b from-bg-elevated-2 to-bg-elevated">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full w-full items-center justify-center p-14"
            style={{ transform: variants[active].transform }}
          >
            <SneakerArt art={product.art} silhouette={silhouette} />
          </motion.div>
        </AnimatePresence>

        {product.isNew && (
          <span className="absolute left-5 top-5 rounded-full bg-[#181818] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
            New
          </span>
        )}
        {product.oldPrice && (
          <span className="absolute right-5 top-5 rounded-full bg-brand-3 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
            Sale
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3">
        {variants.map((v, i) => (
          <button
            key={v.label}
            onClick={() => setActive(i)}
            className={cn(
              "flex aspect-square items-center justify-center rounded-2xl border bg-surface p-4 transition-colors",
              active === i ? "border-brand" : "border-border-subtle hover:border-border-strong"
            )}
          >
            <div style={{ transform: v.transform }} className="h-full w-full">
              <SneakerArt art={product.art} silhouette={silhouette} glow={false} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
