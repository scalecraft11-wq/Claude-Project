"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";
import { SneakerArt } from "@/components/ui/SneakerArt";
import { Button, ButtonLink } from "@/components/ui/Button";

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem } = useCart();

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
            onClick={closeCart}
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
                Your Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                  <ShoppingBag size={26} className="text-fg-faint" />
                </div>
                <p className="text-fg-muted">Your bag is empty.</p>
                <ButtonLink href="/shop" variant="outline" onClick={closeCart}>
                  Continue Shopping
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="flex flex-col gap-5">
                    {items.map((line) => {
                      const product = products.find((p) => p.id === line.productId);
                      if (!product) return null;
                      return (
                        <div
                          key={`${line.productId}-${line.size}-${line.color}`}
                          className="flex gap-4"
                        >
                          <div className="h-24 w-24 shrink-0 rounded-2xl bg-bg-elevated-2 p-3">
                            <SneakerArt art={product.art} glow={false} />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="font-display text-sm font-bold leading-tight">
                                  {product.name}
                                </p>
                                <p className="mt-1 text-xs text-fg-faint">
                                  Size {line.size} · {line.color}
                                </p>
                              </div>
                              <button
                                onClick={() =>
                                  removeItem(line.productId, line.size, line.color)
                                }
                                aria-label="Remove item"
                                className="text-fg-faint transition-colors hover:text-brand-3"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 rounded-full border border-border-subtle px-2.5 py-1">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      line.productId,
                                      line.size,
                                      line.color,
                                      line.quantity - 1
                                    )
                                  }
                                  aria-label="Decrease quantity"
                                  className="text-fg-muted hover:text-fg"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-4 text-center text-xs font-semibold">
                                  {line.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      line.productId,
                                      line.size,
                                      line.color,
                                      line.quantity + 1
                                    )
                                  }
                                  aria-label="Increase quantity"
                                  className="text-fg-muted hover:text-fg"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                              <span className="font-display text-sm font-bold">
                                {formatPrice(product.price * line.quantity)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border-subtle px-6 py-6">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-fg-muted">Subtotal</span>
                    <span className="font-display text-lg font-bold">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                  <p className="mt-3 text-center text-[11px] text-fg-faint">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
