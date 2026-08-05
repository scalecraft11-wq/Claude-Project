"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import * as React from "react";

import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";

export interface ScrollProgressBarProps {
  className?: string;
}

/**
 * Fixed reading-progress bar (long-form articles/case studies). Reads
 * from `useScrollProgress()` — the same normalized value the rest of the
 * animation system treats as the single source of scroll truth
 * (ANIMATION_BLUEPRINT.md §4) — rather than Framer Motion's own
 * independent `useScroll`, then smooths it with a spring for a buttery
 * feel.
 */
export function ScrollProgressBar({ className }: ScrollProgressBarProps) {
  const progress = useScrollProgress();
  const motionProgress = useMotionValue(0);
  const smoothProgress = useSpring(motionProgress, {
    stiffness: 300,
    damping: 40,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    motionProgress.set(progress);
  }, [progress, motionProgress]);

  return (
    <motion.div
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent",
        className,
      )}
      style={{ scaleX: smoothProgress }}
    />
  );
}
