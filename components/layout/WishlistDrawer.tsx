"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, X } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { SneakerArt } from "@/components/ui/SneakerArt";
import { ButtonLink } from "@/components/ui/Button";

export function WishlistDrawer() {
  const { productIds, isOpen, closeWishlist, remove } = useWishlist();
  const { addItem } = useCart();

  const wishlistedProducts = products.filter((p) => productIds.includes(p.id));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={closeWishlist}
          />
          <motion.div
            className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-bg-elevated border-l border-border-subtle"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-5">
              <h2 className="font-display text-xl font-extrabold uppercase tracking-tight">
                Wishlist ({wishlistedProducts.length})
              </h2>
              <button
                onClick={closeWishlist}
                aria-label="Close wishlist"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {wishlistedProducts.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                  <Heart size={26} className="text-fg-faint" />
                </div>
                <p className="text-fg-muted">Nothing saved yet.</p>
                <ButtonLink href="/shop" variant="outline" onClick={closeWishlist}>
                  Explore Shop
                </ButtonLink>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="flex flex-col gap-5">
                  {wishlistedProducts.map((product) => (
                    <div key={product.id} className="flex gap-4">
                      <div className="h-24 w-24 shrink-0 rounded-2xl bg-bg-elevated-2 p-3">
                        <SneakerArt art={product.art} glow={false} />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-display text-sm font-bold leading-tight">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-fg-faint">{product.category}</p>
                          </div>
                          <button
                            onClick={() => remove(product.id)}
                            aria-label="Remove from wishlist"
                            className="text-fg-faint transition-colors hover:text-brand-3"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold">
                            {formatPrice(product.price)}
                          </span>
                          <button
                            onClick={() =>
                              addItem({
                                productId: product.id,
                                size: product.sizes[Math.floor(product.sizes.length / 2)],
                                color: product.colors[0].name,
                                quantity: 1,
                              })
                            }
                            aria-label="Add to bag"
                            className="flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1.5 text-xs font-semibold text-fg-muted hover:border-brand hover:text-brand"
                          >
                            <ShoppingBag size={12} />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
