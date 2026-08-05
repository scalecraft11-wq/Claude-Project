/** Restricts `value` to the inclusive range `[min, max]`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation between `start` and `end` at position `t` (0–1). */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/** Remaps `value` from one numeric range to another, clamped to the output range. */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

/** URL-safe slug from a title — used for case studies, blog posts, products. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Truncates `value` to `maxLength` characters on a word boundary, appending an ellipsis. */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const truncated = value.slice(0, maxLength).replace(/\s+\S*$/, "");
  return `${truncated}…`;
}

/** Type guard for filtering `(T | null | undefined)[]` down to `T[]`. */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
