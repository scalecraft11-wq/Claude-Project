import type { SpringConfig } from "@react-spring/web";

/**
 * Shared React Spring presets — ANIMATION_BLUEPRINT.md §24 (Physics).
 * "Physics" in this system means spring/damping feel, not simulation —
 * these four presets are the entire vocabulary; every spring-driven
 * interaction (magnetic buttons, drag inertia, camera follow, tilt cards)
 * reuses one of them so the product feels like one physical world rather
 * than a pile of hand-tuned one-offs.
 */
export const springPresets = {
  /** Toggle/switch thumbs, small state flips. */
  snappyUi: { tension: 300, friction: 30, mass: 1 } satisfies SpringConfig,

  /** Camera follow-damping behind a GSAP-driven scroll target — §7. */
  organicCamera: {
    tension: 120,
    friction: 24,
    mass: 1.2,
  } satisfies SpringConfig,

  /** Magnetic buttons (§13), tilt-response cards (§6). */
  heavyMagnetic: { tension: 220, friction: 26, mass: 1 } satisfies SpringConfig,

  /** Product drag-rotate (§23), swipe-to-dismiss drawers. */
  looseDragInertia: {
    tension: 90,
    friction: 18,
    mass: 1.5,
  } satisfies SpringConfig,
} as const;

export type SpringPreset = keyof typeof springPresets;
