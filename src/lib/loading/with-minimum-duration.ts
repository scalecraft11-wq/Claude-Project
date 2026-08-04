/**
 * Ensures a promise (an asset load, a data fetch backing a loading screen)
 * never resolves faster than `minimumMs` — ANIMATION_BLUEPRINT.md §2. An
 * instant loading-screen flash reads as broken, not fast; this is the
 * utility behind that "minimum display floor" rule.
 */
export async function withMinimumDuration<T>(
  promise: Promise<T>,
  minimumMs: number,
): Promise<T> {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, minimumMs)),
  ]);
  return result;
}
