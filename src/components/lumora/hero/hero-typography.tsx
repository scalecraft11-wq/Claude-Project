"use client";

import { motion } from "motion/react";

import { durationsMs, easingCurves } from "@/lib/animation/tokens";
import { cn } from "@/lib/utils";

export interface HeroTypographyProps {
  eyebrow?: string;
  /** One entry per visual line — line breaks are an editorial choice, not
   * something to infer from a paragraph of text. */
  lines: string[];
  description?: string;
  className?: string;
}

const toSeconds = (ms: number) => ms / 1000;

/**
 * Hero headline entrance — ANIMATION_BLUEPRINT.md §14/§19: each line
 * reveals via a mask (clipped by the `overflow-hidden` wrapper, not a
 * fade) and staggers in ~80ms apart. Body copy gets the single
 * group-fade-up used everywhere else (§20) — kinetic per-line reveals are
 * reserved for headline-scale type only.
 */
export function HeroTypography({
  eyebrow,
  lines,
  description,
  className,
}: HeroTypographyProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: toSeconds(durationsMs.slow),
            ease: easingCurves.luxuryOut,
          }}
          className="text-overline text-content-muted"
        >
          {eyebrow}
        </motion.p>
      )}

      <h1 className="font-display text-display-01 text-content-primary">
        {lines.map((line, index) => (
          <span key={line} className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: toSeconds(durationsMs.cinematic),
                ease: easingCurves.luxuryOut,
                delay: index * 0.08,
              }}
              className="block"
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: toSeconds(durationsMs.slow),
            ease: easingCurves.luxuryOut,
            delay: lines.length * 0.08 + 0.1,
          }}
          className="max-w-measure text-body-lg text-content-secondary"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
