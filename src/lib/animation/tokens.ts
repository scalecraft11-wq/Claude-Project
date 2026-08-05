/**
 * Motion tokens — DESIGN_SYSTEM.md §25/§32, ANIMATION_BLUEPRINT.md §1.
 *
 * The canonical values live in `src/styles/tokens.css` as CSS custom
 * properties for anything CSS-driven. This module mirrors the same
 * numbers for the JS-driven animation tools (GSAP, Framer Motion, Motion
 * One, React Spring) so every tool in the stack shares one vocabulary —
 * changing a duration or easing curve means editing exactly two files
 * (this one and tokens.css), never a value buried in a component.
 */

/** Seconds — GSAP's native unit. */
export const durationsSeconds = {
  instant: 0.1,
  fast: 0.15,
  base: 0.25,
  slow: 0.4,
  cinematic: 0.7,
} as const;

/** Milliseconds — Framer Motion, Motion One, and CSS all prefer this. */
export const durationsMs = {
  instant: 100,
  fast: 150,
  base: 250,
  slow: 400,
  cinematic: 700,
} as const;

export type DurationToken = keyof typeof durationsMs;

/** Cubic-bezier control points — DESIGN_SYSTEM.md §25. */
export const easingCurves = {
  standard: [0.4, 0, 0.2, 1],
  editorial: [0.65, 0, 0.35, 1],
  luxuryOut: [0.16, 1, 0.3, 1],
  luxuryIn: [0.7, 0, 0.84, 0],
} as const satisfies Record<string, readonly [number, number, number, number]>;

export type EasingToken = keyof typeof easingCurves;

/** CSS `cubic-bezier()` strings — also valid as a GSAP `ease` value directly
 * (GSAP 3.x parses standard CSS bezier syntax without needing CustomEase). */
export const easingCss: Record<EasingToken, string> = {
  standard: `cubic-bezier(${easingCurves.standard.join(", ")})`,
  editorial: `cubic-bezier(${easingCurves.editorial.join(", ")})`,
  luxuryOut: `cubic-bezier(${easingCurves.luxuryOut.join(", ")})`,
  luxuryIn: `cubic-bezier(${easingCurves.luxuryIn.join(", ")})`,
};
