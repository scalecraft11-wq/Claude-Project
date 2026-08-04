"use client";

import type Lenis from "lenis";
import { useEffect, useState } from "react";

/**
 * Normalized (0–1) scroll progress for the whole document. Prefers the
 * shared Lenis instance (pass the ref from `useLenis()`, called earlier in
 * the same component) so the value is driven by the same smoothed number
 * GSAP ScrollTrigger consumes; falls back to native scroll listening when
 * no Lenis instance is available (e.g. under `prefers-reduced-motion`,
 * where `useLenis()` intentionally never creates one).
 */
export function useScrollProgress(
  lenisRef?: React.RefObject<Lenis | null>,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lenis = lenisRef?.current;

    if (lenis) {
      const handleLenisScroll = (event: { progress: number }) => {
        setProgress(event.progress);
      };
      lenis.on("scroll", handleLenisScroll);
      return () => {
        lenis.off("scroll", handleLenisScroll);
      };
    }

    const handleNativeScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0);
    };

    handleNativeScroll();
    window.addEventListener("scroll", handleNativeScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleNativeScroll);
  }, [lenisRef]);

  return progress;
}
