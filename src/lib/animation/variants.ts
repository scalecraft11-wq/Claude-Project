import type { Variants } from "motion/react";

import { durationsMs, easingCurves } from "@/lib/animation/tokens";

const toSeconds = (ms: number) => ms / 1000;

/**
 * Reusable Framer Motion variants — ANIMATION_BLUEPRINT.md §20 (Section
 * Reveal): "one shared, reusable recipe" for standard content, so entrance
 * motion isn't reinvented per section. Signature/pinned moments (hero
 * sequences) are GSAP timelines and intentionally don't use these.
 */

/** Single group fade-up, fires once on viewport entry — the default
 * section/content entrance used everywhere except the 1–2 signature
 * moments per page. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: toSeconds(durationsMs.slow),
      ease: easingCurves.luxuryOut,
    },
  },
};

/** Wraps a group of children that should stagger in together (nav items,
 * grid cards) — ANIMATION_BLUEPRINT.md §4/§20, capped stagger window. */
export const staggerContainer = (staggerMs: number = 70): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: toSeconds(staggerMs),
    },
  },
});

/** Modal / drawer panel entrance — ANIMATION_BLUEPRINT.md §18. Exit is
 * always faster than entrance (§25 core principle). */
export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: toSeconds(durationsMs.base),
      ease: easingCurves.luxuryOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: {
      duration: toSeconds(durationsMs.base) * 0.72,
      ease: easingCurves.luxuryIn,
    },
  },
};

/** Standard page-transition fallback where the View Transitions API isn't
 * available — ANIMATION_BLUEPRINT.md §3. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: toSeconds(durationsMs.base),
      ease: easingCurves.luxuryOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: toSeconds(durationsMs.fast),
      ease: easingCurves.luxuryIn,
    },
  },
};
