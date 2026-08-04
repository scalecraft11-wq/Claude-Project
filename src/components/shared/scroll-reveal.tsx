"use client";

import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import * as React from "react";

import { durationsMs, easingCurves } from "@/lib/animation/tokens";

export interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  /** Delay this element's reveal behind others in the same grid/list (ms). */
  delay?: number;
  as?: "div" | "article" | "li";
}

/**
 * Fire-once fade-up on first viewport entry — the single shared reveal
 * recipe for standard content (cards, grid items) per
 * ANIMATION_BLUEPRINT.md §4/§20, rather than a bespoke entrance per
 * component. Signature pinned/scrubbed sequences are GSAP timelines and
 * intentionally don't use this.
 */
export function ScrollReveal({
  delay = 0,
  as = "div",
  ...props
}: ScrollRevealProps) {
  // `motion[as]` is a union across element types whose event-handler prop
  // shapes don't structurally unify — every usage in this codebase only
  // relies on the shared div-like subset (className, variants, etc.), so
  // this narrows to one concrete shape rather than fighting the union.
  const MotionComponent = motion[as] as React.ComponentType<
    HTMLMotionProps<"div">
  >;

  const variants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: durationsMs.slow / 1000,
        ease: easingCurves.luxuryOut,
        delay: delay / 1000,
      },
    },
  };

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      {...props}
    />
  );
}
