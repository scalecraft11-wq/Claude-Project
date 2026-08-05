import { Redis } from "ioredis";

import { env } from "@/lib/env";

/**
 * Shared Redis client — a single lazily-connected singleton reused by
 * every Redis-backed subsystem (rate limiting, caching), rather than each
 * one opening its own connection pool. Returns `null` when `REDIS_URL`
 * isn't set so callers can fall back to a single-instance-only substitute
 * (in-memory map) — that fallback is never appropriate in a real,
 * multi-instance production deployment, which is why it's opt-in per
 * caller rather than a silent default here.
 */
let redisClient: Redis | null | undefined;

export function getRedisClient(): Redis | null {
  if (redisClient !== undefined) return redisClient;

  if (!env.REDIS_URL) {
    redisClient = null;
    return null;
  }

  redisClient = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    reconnectOnError: () => false,
  });
  redisClient.on("error", (error) => {
    console.error("[redis] connection error:", error.message);
  });

  return redisClient;
}
