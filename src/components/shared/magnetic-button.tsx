"use client";

import { animated, useSpring } from "@react-spring/web";
import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { springPresets } from "@/lib/animation/springs";
import { clamp } from "@/lib/helpers";

export interface MagneticButtonProps {
  children: React.ReactNode;
  /** Max pull distance in px — DESIGN_SYSTEM.md §13 (8–12px, "a pull, never a chase"). */
  strength?: number;
  /** Trigger radius around the element's bounding box — DESIGN_SYSTEM.md §13. */
  radius?: number;
  className?: string;
}

/**
 * Magnetic hover wrapper — DESIGN_SYSTEM.md §13, ANIMATION_BLUEPRINT.md
 * §13. Wrap a `<Button>` (or any element) in this to give it a magnetic
 * pull toward the cursor, damped by the "Heavy Magnetic" spring preset for
 * a weighted, confident feel rather than a bouncy snap. Entirely inert on
 * touch/coarse-pointer devices — magnetic pull is a mouse-only affordance.
 */
export function MagneticButton({
  children,
  strength = 10,
  radius = 100,
  className,
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const isEnabled = hasFinePointer && !prefersReducedMotion;

  const [style, api] = useSpring(() => ({
    x: 0,
    y: 0,
    config: springPresets.heavyMagnetic,
  }));

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isEnabled) return;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;

    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    if (Math.hypot(distanceX, distanceY) > radius) return;

    void api.start({
      x: clamp(distanceX * 0.3, -strength, strength),
      y: clamp(distanceY * 0.3, -strength, strength),
    });
  };

  const handlePointerLeave = () => {
    void api.start({ x: 0, y: 0 });
  };

  return (
    <animated.div
      ref={ref}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={className ? className : "inline-block"}
    >
      {children}
    </animated.div>
  );
}
