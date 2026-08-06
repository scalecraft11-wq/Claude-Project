"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categories, products } from "@/lib/data/products";

export function Categories() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Categories" title="Shop by discipline" />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const sample = products.find((p) => p.category === cat.name);
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative flex h-56 flex-col justify-between overflow-hidden rounded-3xl border border-border-subtle p-7 transition-all duration-300 hover:border-border-strong"
                  style={{
                    background: sample
                      ? `linear-gradient(150deg, ${sample.art.upper}22, transparent 60%), var(--surface)`
                      : "var(--surface)",
                  }}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight">
                      {cat.name}
                    </h3>
                    <ArrowUpRight
                      size={20}
                      className="text-fg-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand"
                    />
                  </div>
                  <p className="text-sm text-fg-muted">{cat.blurb}</p>

                  <div className="pointer-events-none absolute -right-8 -bottom-8 h-40 w-40 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                    style={{ background: sample?.art.accent ?? "#d7ff3f" }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
