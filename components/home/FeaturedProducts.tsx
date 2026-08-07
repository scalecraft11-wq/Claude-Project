"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";
import { getFeaturedProducts, products as allProducts } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const tabs = ["Featured", "New Arrivals", "Bestsellers"] as const;

export function FeaturedProducts() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Featured");

  const list =
    tab === "Featured"
      ? getFeaturedProducts()
      : tab === "New Arrivals"
      ? allProducts.filter((p) => p.isNew)
      : allProducts.filter((p) => p.isBestseller);

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="The Collection" title="Engineered to perform" />
          <div className="flex items-center gap-1 rounded-full border border-border-subtle p-1">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors",
                  tab === t ? "bg-fg text-bg" : "text-fg-muted hover:text-fg"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {list.slice(0, 8).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <ButtonLink href="/shop" variant="outline" size="lg">
            View All Products
            <ArrowRight size={16} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
