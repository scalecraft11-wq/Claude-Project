import type { DeviceTier } from "@/lib/three/device-tier";

/**
 * Shared `<Canvas>` configuration — ANIMATION_BLUEPRINT.md §25 (GPU
 * Optimization). Every R3F scene in the product mounts through these
 * defaults rather than hand-tuning `dpr`/`gl` per scene, so the
 * draw-call/resolution budget is enforced in one place.
 *
 * Usage: `<Canvas {...getCanvasProps(deviceTier)}>`
 */
export function getCanvasProps(tier: DeviceTier) {
  return {
    dpr: getDprRange(tier),
    gl: {
      antialias: tier !== "tier3",
      powerPreference: "high-performance" as const,
      alpha: true,
      stencil: false,
      depth: true,
    },
    shadows: tier === "tier1",
    // Frameloop stays "always" only where scroll/pointer-driven updates are
    // expected every frame; scenes with no continuous input can pass
    // frameloop="demand" to skip rendering entirely between changes.
    frameloop: "always" as const,
  };
}

/**
 * `devicePixelRatio` is capped at 2 regardless of what the device reports
 * (a 3x-retina phone rendering a full 3D scene at 3x is pure waste), and
 * scaled down further on constrained tiers.
 */
function getDprRange(tier: DeviceTier): [number, number] {
  switch (tier) {
    case "tier1":
      return [1, 2];
    case "tier2":
      return [1, 1.5];
    case "tier3":
      return [1, 1];
  }
}

/** Max source-texture size per tier — ANIMATION_BLUEPRINT.md §25/§26. */
export function getMaxTextureSize(tier: DeviceTier): number {
  switch (tier) {
    case "tier1":
      return 2048;
    case "tier2":
      return 1536;
    case "tier3":
      return 1024;
  }
}
