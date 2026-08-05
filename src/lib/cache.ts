import { getRedisClient } from "@/lib/redis";

/**
 * Redis-backed cache-aside helper for expensive, read-heavy queries
 * (catalog listings, category/collection trees) that change far less
 * often than they're read. Same fallback posture as the rate limiter:
 * without `REDIS_URL` (local dev), it degrades to an in-process `Map` —
 * fine for one instance, never appropriate for a real multi-instance
 * deployment. Fails **open** on a Redis error by falling straight through
 * to `fn()` rather than throwing — a cache outage should degrade
 * performance, never availability.
 */

interface MemoryCacheEntry {
  value: string;
  expiresAt: number;
}

const memoryCache = new Map<string, MemoryCacheEntry>();

function readMemoryCache<T>(key: string): T | undefined {
  const entry = memoryCache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return undefined;
  }
  return JSON.parse(entry.value) as T;
}

function writeMemoryCache(
  key: string,
  value: unknown,
  ttlSeconds: number,
): void {
  memoryCache.set(key, {
    value: JSON.stringify(value),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

/** Reads `key`; on a miss, computes `fn()`, caches it for `ttlSeconds`,
 * and returns it. `fn()` only ever runs on a genuine cache miss. */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  const redis = getRedisClient();

  if (!redis) {
    const cached = readMemoryCache<T>(key);
    if (cached !== undefined) return cached;
    const value = await fn();
    writeMemoryCache(key, value, ttlSeconds);
    return value;
  }

  try {
    const cached = await redis.get(`cache:${key}`);
    if (cached !== null) return JSON.parse(cached) as T;
  } catch (error) {
    console.error("[cache] Redis read error, falling through:", error);
  }

  const value = await fn();

  try {
    await redis.set(`cache:${key}`, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    console.error("[cache] Redis write error:", error);
  }

  return value;
}

/** Invalidates one or more cache keys — call after a mutation that would
 * otherwise leave a stale cached read (e.g. a product/category edit). */
export async function invalidateCache(...keys: string[]): Promise<void> {
  for (const key of keys) memoryCache.delete(key);

  const redis = getRedisClient();
  if (!redis || keys.length === 0) return;

  try {
    await redis.del(...keys.map((key) => `cache:${key}`));
  } catch (error) {
    console.error("[cache] Redis invalidation error:", error);
  }
}
