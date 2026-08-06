"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { SneakerArt } from "@/components/ui/SneakerArt";
import { RatingStars } from "@/components/ui/RatingStars";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, cn } from "@/lib/utils";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { isWishlisted, toggle } = useWishlist();
  const { addItem } = useCart();
  const wishlisted = isWishlisted(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface transition-colors duration-300 group-hover:border-border-strong">
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
            {product.isNew && <Badge tone="new">New</Badge>}
            {product.oldPrice && <Badge tone="sale">Sale</Badge>}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label="Toggle wishlist"
            className={cn(
              "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60",
              wishlisted && "text-brand-3"
            )}
          >
            <Heart size={16} className={cn(wishlisted && "fill-brand-3")} />
          </button>

          <div className="relative aspect-[4/3.4] w-full overflow-hidden bg-gradient-to-b from-bg-elevated-2 to-bg-elevated p-6 transition-transform duration-500 group-hover:scale-[1.04]">
            <SneakerArt art={product.art} className="drop-shadow-2xl" />
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-faint">
              {product.category}
            </p>
            <h3 className="mt-1 truncate font-display text-lg font-bold leading-tight">
              {product.name}
            </h3>
            <div className="mt-1.5 flex items-center gap-2">
              <RatingStars rating={product.rating} size={12} />
              <span className="text-xs text-fg-faint">({product.reviewCount})</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            <span className="font-display text-lg font-bold text-fg">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-fg-faint line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <button
        onClick={() =>
          addItem({
            productId: product.id,
            size: product.sizes[Math.floor(product.sizes.length / 2)],
            color: product.colors[0].name,
            quantity: 1,
          })
        }
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border-subtle py-2.5 text-xs font-semibold uppercase tracking-wider text-fg-muted opacity-0 transition-all duration-300 hover:border-brand hover:text-brand group-hover:opacity-100"
      >
        <ShoppingBag size={14} />
        Quick Add
      </button>
    </motion.div>
  );
}
