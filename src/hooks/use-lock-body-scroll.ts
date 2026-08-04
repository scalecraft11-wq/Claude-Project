"use client";

import { useEffect } from "react";

/**
 * Locks `<body>` scroll while `locked` is true — used by modals, drawers,
 * and the mobile full-screen nav overlay (DESIGN_SYSTEM.md §15/§18), all
 * of which are also where Lenis's global smooth-scroll is deliberately
 * bypassed (ANIMATION_BLUEPRINT.md §22).
 */
export function useLockBodyScroll(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [locked]);
}
