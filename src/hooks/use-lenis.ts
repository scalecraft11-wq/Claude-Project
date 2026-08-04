"use client";

import type Lenis from "lenis";
import { useEffect, useRef } from "react";

import { createLenis } from "@/lib/animation/lenis";

import { useBrand } from "@/contexts/brand-context";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Initializes the page's single Lenis instance for the lifetime of the
 * mounted component — ANIMATION_BLUEPRINT.md §22. Under
 * `prefers-reduced-motion`, Lenis is never created at all and native
 * scroll takes over, per §28.
 *
 * Mount this once near the root of a scroll-owning layout (not per
 * section) — every consumer that needs scroll progress reads from the
 * returned ref rather than creating its own instance.
 */
export function useLenis(): React.RefObject<Lenis | null> {
  const brand = useBrand();
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const controller = createLenis({ brand });
    lenisRef.current = controller.lenis;

    return () => {
      controller.destroy();
      lenisRef.current = null;
    };
  }, [brand, prefersReducedMotion]);

  return lenisRef;
}
