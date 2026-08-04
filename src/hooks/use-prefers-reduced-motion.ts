import { useMediaQuery } from "@/hooks/use-media-query";

/**
 * The single source of truth for "should motion be reduced" across the
 * whole animation system (Lenis, GSAP, Framer Motion, R3F, Motion One,
 * React Spring) — ANIMATION_BLUEPRINT.md §28. Every effect in that
 * document has a defined fallback keyed off this hook (or its context
 * equivalent, `useMotionPreference()`, for components deep in the tree
 * that shouldn't each open their own `matchMedia` subscription).
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
