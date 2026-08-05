import { useState } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

/**
 * Subscribes to a CSS media query (e.g. a breakpoint from
 * `tailwind.config.ts`, or `(prefers-reduced-motion: reduce)`). Returns
 * `false` on the server and on first client render before the query can be
 * evaluated — callers that need to avoid a hydration mismatch should pair
 * this with `useMounted()`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

/** Named breakpoint queries mirroring `tailwind.config.ts` `screens`. */
export const breakpoints = {
  sm: "(min-width: 480px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
  "3xl": "(min-width: 1920px)",
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint(breakpoint: Breakpoint): boolean {
  return useMediaQuery(breakpoints[breakpoint]);
}
