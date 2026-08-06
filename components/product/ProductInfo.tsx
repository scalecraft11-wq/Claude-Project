"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Heart, Minus, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { RatingStars } from "@/components/ui/RatingStars";
import { Button } from "@/components/ui/Button";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const accordionItems = (product: Product) => [
  { title: "Details", content: product.details },
  {
    title: "Shipping & Returns",
    content: [
      "Free standard shipping on orders over $150",
      "Express shipping available at checkout",
      "45-day free returns and exchanges",
    ],
  },
  {
    title: "Size Guide",
    content: [
      "Most styles run true to size",
      "Knit uppers fit snug — consider sizing up half a size",
      "See full size chart for international conversions",
    ],
  },
];

export function ProductInfo({ product }: { product: Product }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const { addItem, openCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  function handleAddToCart() {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    openCart();
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-fg-faint">
          {product.category}
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <RatingStars rating={product.rating} />
          <span className="text-sm text-fg-faint">
            {product.rating.toFixed(1)} · {product.reviewCount} reviews
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-display text-3xl font-bold">{formatPrice(product.price)}</span>
        {product.oldPrice && (
          <span className="text-lg text-fg-faint line-through">
            {formatPrice(product.oldPrice)}
          </span>
        )}
        {product.oldPrice && (
          <span className="rounded-full bg-brand-3/15 px-2.5 py-1 text-xs font-bold text-brand-3">
            Save {formatPrice(product.oldPrice - product.price)}
          </span>
        )}
      </div>

      <p className="leading-relaxed text-fg-muted">{product.description}</p>

      <div>
        <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-fg-faint">
          Color — {selectedColor}
        </h4>
        <div className="flex items-center gap-2.5">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              aria-label={color.name}
              className={cn(
                "h-9 w-9 rounded-full border-2 transition-all",
                selectedColor === color.name
                  ? "border-brand scale-110"
                  : "border-transparent hover:border-border-strong"
              )}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-widest text-fg-faint">
            Size {selectedSize ? `— US ${selectedSize}` : ""}
          </h4>
          <button className="text-xs text-fg-faint underline hover:text-brand">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={cn(
                "flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition-colors",
                selectedSize === size
                  ? "border-brand bg-brand text-black"
                  : "border-border-subtle text-fg-muted hover:border-border-strong"
              )}
            >
              {size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="mt-2 text-xs text-fg-faint">Please select a size</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-4 rounded-full border border-border-subtle px-4 py-3">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="text-fg-muted hover:text-fg"
          >
            <Minus size={14} />
          </button>
          <span className="w-4 text-center text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="text-fg-muted hover:text-fg"
          >
            <Plus size={14} />
          </button>
        </div>

        <Button onClick={handleAddToCart} size="lg" className="flex-1">
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2"
              >
                <Check size={16} /> Added to Bag
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={16} /> Add to Bag
              </motion.span>
            )}
          </AnimatePresence>
        </Button>

        <button
          onClick={() => toggle(product.id)}
          aria-label="Toggle wishlist"
          className={cn(
            "flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border transition-colors",
            wishlisted
              ? "border-brand-3 text-brand-3"
              : "border-border-subtle text-fg-muted hover:border-border-strong"
          )}
        >
          <Heart size={18} className={cn(wishlisted && "fill-brand-3")} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border-subtle bg-surface p-5 sm:grid-cols-3">
        <div className="flex items-center gap-2.5 text-xs text-fg-muted">
          <Truck size={16} className="text-brand" />
          Free shipping $150+
        </div>
        <div className="flex items-center gap-2.5 text-xs text-fg-muted">
          <RotateCcw size={16} className="text-brand" />
          45-day returns
        </div>
        <div className="flex items-center gap-2.5 text-xs text-fg-muted">
          <ShieldCheck size={16} className="text-brand" />
          12-month warranty
        </div>
      </div>

      <div className="mt-2 flex flex-col divide-y divide-border-subtle border-t border-border-subtle">
        {accordionItems(product).map((item, i) => (
          <div key={item.title}>
            <button
              onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
              className="flex w-full items-center justify-between py-4 text-left font-medium"
            >
              {item.title}
              <Plus
                size={16}
                className={cn(
                  "text-fg-faint transition-transform duration-300",
                  openAccordion === i && "rotate-45 text-brand"
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {openAccordion === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-col gap-2 pb-4 text-sm text-fg-muted">
                    {item.content.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
