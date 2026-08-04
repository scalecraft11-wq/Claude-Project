"use client";

import type { ReactNode } from "react";

import { useLenis } from "@/hooks/use-lenis";

/**
 * Mounts the page's single Lenis instance — ANIMATION_BLUEPRINT.md §22:
 * "mount this once near the root of a scroll-owning layout, not per
 * section." Every route-group layout that owns real page scroll (the
 * marketing site, eventually the Lumora Skin experience) wraps its
 * children in this once; individual sections (the hero, etc.) read scroll
 * state through their own GSAP ScrollTrigger instances, which stay synced
 * to whichever single Lenis instance exists — they never create their own.
 */
export function LenisProvider({ children }: { children: ReactNode }) {
  useLenis();
  return <>{children}</>;
}
