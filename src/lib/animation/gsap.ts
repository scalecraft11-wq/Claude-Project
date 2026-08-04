import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let pluginsRegistered = false;

/**
 * Registers GSAP plugins exactly once, client-side only. Import
 * `registerGsap()` (not `gsap` directly) at the top of any module that
 * builds a ScrollTrigger timeline, so registration is guaranteed to have
 * run first regardless of import order — ANIMATION_BLUEPRINT.md §1/§4.
 */
export function registerGsap(): typeof gsap {
  if (!pluginsRegistered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    pluginsRegistered = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };
