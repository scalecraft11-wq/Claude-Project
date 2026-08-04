import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` warns when it runs during SSR. Every hook in this
 * folder that needs to read the DOM before paint (media queries, Lenis,
 * scroll position) should use this instead of importing `useLayoutEffect`
 * directly.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
