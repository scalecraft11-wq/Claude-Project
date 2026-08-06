"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, MousePointer2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((m) => m.HeroCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-40 w-40 animate-pulse-glow rounded-full bg-brand/20 blur-2xl" />
      </div>
    ),
  }
);

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-fg">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-brand/15 blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[500px] rounded-full bg-brand-2/12 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <Container className="relative grid grid-cols-1 items-center gap-10 pb-16 pt-10 sm:pt-16 lg:grid-cols-2 lg:gap-6 lg:pb-24 lg:pt-20">
        <div className="flex flex-col items-start gap-6">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-ink-border bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand"
          >
            Fall / Winter Collection
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-6xl font-bold leading-[1.02] tracking-tight text-ink-fg sm:text-7xl lg:text-[5rem]"
          >
            Move
            <br />
            <span className="text-gradient-ink">Beyond</span>
            <br />
            Limits
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="max-w-md text-base text-ink-fg-muted sm:text-lg"
          >
            Precision-engineered sneakers built for speed, comfort, and
            everyday style. Discover the collection redefining performance
            footwear.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32 }}
            className="flex flex-wrap items-center gap-4"
          >
            <ButtonLink href="/shop" size="lg">
              Shop Collection
              <ArrowRight size={17} />
            </ButtonLink>
            <ButtonLink href="/about" size="lg" variant="outline">
              Our Story
            </ButtonLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-6 grid grid-cols-3 gap-6 border-t border-ink-border pt-6 sm:gap-10"
          >
            {[
              ["120K+", "Happy Runners"],
              ["4.8/5", "Average Rating"],
              ["45 Day", "Free Returns"],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-bold text-ink-fg sm:text-3xl">{stat}</p>
                <p className="mt-1 text-xs text-ink-fg-muted">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[360px] sm:h-[440px] lg:h-[560px]"
        >
          <HeroCanvas />
          <div className="pointer-events-none absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-ink-fg-muted">
            <MousePointer2 size={13} />
            Drag to rotate
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
