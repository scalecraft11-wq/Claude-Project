"use client";

import { motion } from "motion/react";

import { staggerContainer } from "@/lib/animation/variants";
import { cn } from "@/lib/utils";

export interface ClientLogosProps {
  label?: string;
  /** Rendered as styled wordmarks — no external logo assets required. */
  names: string[];
  className?: string;
}

/**
 * "As featured in" / partner-brand strip. Wordmarks are typographic
 * (no image assets to source for a case-study demo brand), grayscale at
 * rest and gaining full contrast on hover — a quiet trust signal, not a
 * second competing visual moment next to the hero product.
 */
export function ClientLogos({
  label = "As seen in",
  names,
  className,
}: ClientLogosProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {label && <p className="text-overline text-content-muted">{label}</p>}
      <motion.ul
        variants={staggerContainer(80)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex flex-wrap items-center gap-x-10 gap-y-4"
      >
        {names.map((name) => (
          <motion.li
            key={name}
            variants={{
              hidden: { opacity: 0, y: 8 },
              visible: { opacity: 1, y: 0 },
            }}
            className={cn(
              "font-display text-heading-03 text-content-muted",
              "opacity-50 grayscale transition-all duration-fast hover:text-content-primary hover:opacity-100 hover:grayscale-0",
            )}
          >
            {name}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
