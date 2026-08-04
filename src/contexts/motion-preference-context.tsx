"use client";

import * as React from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * Shares a single `prefers-reduced-motion` subscription across the whole
 * tree instead of every animated component opening its own `matchMedia`
 * listener — ANIMATION_BLUEPRINT.md §28. This is the value every
 * animation utility (Lenis, GSAP, Framer Motion variants, R3F scenes)
 * should ultimately be gated by.
 */
const MotionPreferenceContext = React.createContext(false);

export function MotionPreferenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <MotionPreferenceContext.Provider value={prefersReducedMotion}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

/** `true` when the user has requested reduced motion at the OS/browser level. */
export function useMotionPreference(): boolean {
  return React.useContext(MotionPreferenceContext);
}
