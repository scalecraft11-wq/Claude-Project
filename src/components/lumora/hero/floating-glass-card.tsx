"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

import { durationsMs, easingCurves } from "@/lib/animation/tokens";
import { cn } from "@/lib/utils";

export interface FloatingGlassCardProps {
  icon?: ReactNode;
  title: string;
  description: string;
  /** Entrance stagger, in ms. */
  delay?: number;
  /** Ambient float-loop timing, so multiple cards don't bob in unison. */
  floatDurationS?: number;
  className?: string;
}

/**
 * A glassmorphism ingredient/benefit callout floating over the hero
 * scene. DESIGN_SYSTEM.md §10 scopes glass to functional overlays only —
 * this hero is the one deliberate signature exception the Animation
 * Blueprint's governing principle carves out (§0: "a signature moment
 * used exactly once"), so it reuses the same `.glass-surface` recipe
 * rather than inventing a second glass treatment.
 */
export function FloatingGlassCard({
  icon,
  title,
  description,
  delay = 0,
  floatDurationS = 7,
  className,
}: FloatingGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: durationsMs.cinematic / 1000,
        ease: easingCurves.luxuryOut,
        delay: delay / 1000,
      }}
      className={cn("absolute motion-safe:animate-float", className)}
      style={{ animationDuration: `${floatDurationS}s` }}
    >
      <div className="glass-surface flex max-w-[260px] items-start gap-3 rounded-card p-5 shadow-elevation-3">
        {icon && (
          <span className="mt-0.5 shrink-0 text-accent" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="grid gap-1">
          <p className="text-body-sm font-medium text-content-primary">
            {title}
          </p>
          <p className="text-body-sm text-content-secondary">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
