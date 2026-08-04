/**
 * Device capability tiering — ANIMATION_BLUEPRINT.md §26 (Fallbacks for
 * Mobile) and §27 (Performance Strategy). Capability detection, not
 * viewport width, decides how much of the 3D/motion experience a visitor
 * receives.
 *
 * - `tier1` — full experience: real transmission glass, full particle
 *   density, DOF/bloom, all scroll-scrubbed 3D.
 * - `tier2` — simplified materials, reduced particle count, capped pixel
 *   ratio, DOF/bloom disabled.
 * - `tier3` — no live 3D canvas at all; static/video fallback only.
 */
export type DeviceTier = "tier1" | "tier2" | "tier3";

const KNOWN_WEAK_GPU_PATTERNS: RegExp[] = [
  /PowerVR/i,
  /Mali-4/i,
  /Adreno\s*(2|3)0\d/i,
  /SwiftShader/i,
];

const SLOW_CONNECTION_TYPES = new Set(["slow-2g", "2g", "3g"]);

function hasSlowConnection(): boolean {
  const connection = navigator.connection;
  if (!connection) return false;
  if (connection.saveData) return true;
  return connection.effectiveType
    ? SLOW_CONNECTION_TYPES.has(connection.effectiveType)
    : false;
}

function getWebglRendererString(gl: WebGLRenderingContext): string {
  const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
  if (!debugInfo) return "";
  const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as
    | string
    | undefined;
  return renderer ?? "";
}

/**
 * Synchronous, one-shot capability check. Safe to call only on the client
 * (guarded internally) — use the `useDeviceTier()` hook from a component so
 * SSR/first-paint gets a deterministic, conservative default.
 */
export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "tier3";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "tier3";
  }

  if (hasSlowConnection()) {
    return "tier3";
  }

  const canvas = document.createElement("canvas");
  const gl2 = canvas.getContext("webgl2");
  const gl = gl2 ?? canvas.getContext("webgl");

  if (!gl) {
    return "tier3";
  }

  const renderer = getWebglRendererString(gl as WebGLRenderingContext);
  if (KNOWN_WEAK_GPU_PATTERNS.some((pattern) => pattern.test(renderer))) {
    return "tier3";
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = navigator.deviceMemory ?? 4;

  if (gl2 && cores >= 6 && memory >= 6) {
    return "tier1";
  }
  if (cores >= 4 && memory >= 4) {
    return "tier2";
  }
  return "tier3";
}
