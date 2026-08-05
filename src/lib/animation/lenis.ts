import Lenis from "lenis";

import { registerGsap, ScrollTrigger } from "@/lib/animation/gsap";

import type { Brand } from "@/contexts/brand-context";

export interface LenisController {
  lenis: Lenis;
  destroy: () => void;
}

/**
 * Creates and wires the single Lenis instance that owns smooth scrolling
 * for the current view — ANIMATION_BLUEPRINT.md §22. Lenis is registered
 * as GSAP ScrollTrigger's scroll source so there is exactly one number
 * everyone agrees is "where the user is."
 *
 * Never call this directly from a component — use `useLenis()`, which also
 * skips instantiation entirely under `prefers-reduced-motion`.
 */
export function createLenis({ brand }: { brand: Brand }): LenisController {
  const gsap = registerGsap();

  const lenis = new Lenis({
    // Agency: slightly longer lerp — an unhurried, editorial glide.
    // Lumora: slightly shorter — commerce contexts (filtering, reading
    // ingredient lists) benefit from feeling precise, not floaty.
    lerp: brand === "lumora" ? 0.12 : 0.1,
    wheelMultiplier: 1,
    syncTouch: false, // touch stays close to native — §22
  });

  const handleScroll = () => ScrollTrigger.update();
  lenis.on("scroll", handleScroll);

  const tick = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    lenis,
    destroy: () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", handleScroll);
      lenis.destroy();
    },
  };
}
