"use client";

import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface AnimatedStatProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
  className?: string;
}

/**
 * Count-up statistic — ANIMATION_BLUEPRINT.md §21. Fires once on first
 * viewport entry, eased (not linear), duration scales gently with
 * magnitude but is capped at 1.6s. Tabular numerals prevent digit-width
 * layout jitter mid-count. Snaps straight to the final value under
 * reduced motion — the number is never gated behind an animation a user
 * has opted out of.
 */
export function AnimatedStat({
  value,
  prefix = "",
  suffix = "",
  label,
  decimals = 0,
  className,
}: AnimatedStatProps) {
  const ref = React.useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = React.useState((0).toFixed(decimals));

  React.useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      setDisplayValue(value.toFixed(decimals));
      return;
    }

    const duration = Math.min(0.6 + Math.log10(Math.max(value, 1)) * 0.4, 1.6);
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (latest) => setDisplayValue(latest.toFixed(decimals)),
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion, value, decimals, motionValue]);

  return (
    <div className={cn("grid gap-2", className)}>
      <p
        ref={ref}
        className="font-display text-display-02 tabular-nums text-content-primary"
      >
        {prefix}
        {displayValue}
        {suffix}
      </p>
      <p className="text-body-sm text-content-muted">{label}</p>
    </div>
  );
}
