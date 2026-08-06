"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { products } from "@/lib/data/products";
import { SneakerArt } from "@/components/ui/SneakerArt";
import { formatPrice } from "@/lib/utils";

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
  }, [query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(query)}`);
    onClose();
    setQuery("");
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 backdrop-blur-sm pt-24 px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border-strong bg-bg-elevated shadow-2xl"
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="flex items-center gap-3 border-b border-border-subtle px-6 py-5">
              <Search size={20} className="text-fg-faint" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers, categories..."
                className="flex-1 bg-transparent text-lg text-fg placeholder:text-fg-faint focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="text-fg-faint hover:text-fg"
              >
                <X size={20} />
              </button>
            </form>

            {results.length > 0 && (
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-black/[0.04]"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-xl bg-bg-elevated-2 p-2">
                      <SneakerArt art={product.art} glow={false} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-fg">{product.name}</p>
                      <p className="text-xs text-fg-faint">{product.category}</p>
                    </div>
                    <span className="text-sm font-semibold text-fg">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {query.trim() && results.length === 0 && (
              <p className="p-6 text-sm text-fg-faint">
                No products found for &ldquo;{query}&rdquo;
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
