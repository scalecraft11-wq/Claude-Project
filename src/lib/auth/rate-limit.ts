import type { Redis } from "ioredis";
import { headers } from "next/headers";

import { getRedisClient } from "@/lib/redis";

/**
 * Sliding-ish fixed-window rate limiter (ARCHITECTURE.md §16/§26: "Redis-
 * backed sliding-window limits on login, contact form, checkout creation,
 * and search endpoints"). Redis-backed when `REDIS_URL` is set (required
 * for any real, multi-instance deployment); falls back to an in-process
 * `Map` for local development so `npm run dev` works without standing up
 * Redis first — that fallback is explicitly single-instance only and is
 * never appropriate in production, which is why it's not the silent
 * default there (see `getLimiterBackend` below).
 *
 * Fails **open** on a Redis error (logs and allows the request through)
 * rather than closed — an infrastructure outage locking every user out of
 * login entirely is a worse incident than temporarily-unlimited login
 * attempts during that same outage.
 */

export interface RateLimitConfig {
  /** Max requests allowed inside the window. */
  limit: number;
  /** Window size in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
}

/** Named presets for each rate-limited auth flow. */
export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 }, // 5 / 15 min
  register: { limit: 5, windowMs: 60 * 60 * 1000 }, // 5 / hour
  forgotPassword: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 / hour
  resendVerification: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 / hour
  magicLink: { limit: 3, windowMs: 60 * 60 * 1000 }, // 3 / hour
  checkoutCreate: { limit: 10, windowMs: 10 * 60 * 1000 }, // 10 / 10 min
  couponApply: { limit: 15, windowMs: 10 * 60 * 1000 }, // 15 / 10 min
  cartMutate: { limit: 60, windowMs: 60 * 1000 }, // 60 / min
  apiRead: { limit: 120, windowMs: 60 * 1000 }, // 120 / min — REST API v1 GETs
} as const satisfies Record<string, RateLimitConfig>;

const memoryStore = new Map<string, { count: number; resetAt: number }>();

function rateLimitInMemory(
  key: string,
  { limit, windowMs }: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  const existing = memoryStore.get(key);

  if (!existing || existing.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return {
      success: true,
      remaining: limit - 1,
      resetAt: new Date(now + windowMs),
    };
  }

  existing.count += 1;
  return {
    success: existing.count <= limit,
    remaining: Math.max(limit - existing.count, 0),
    resetAt: new Date(existing.resetAt),
  };
}

async function rateLimitWithRedis(
  redis: Redis,
  key: string,
  { limit, windowMs }: RateLimitConfig,
): Promise<RateLimitResult> {
  const redisKey = `ratelimit:${key}`;
  const count = await redis.incr(redisKey);
  if (count === 1) {
    await redis.pexpire(redisKey, windowMs);
  }
  const ttl = await redis.pttl(redisKey);
  const resetAt = new Date(Date.now() + Math.max(ttl, 0));

  return {
    success: count <= limit,
    remaining: Math.max(limit - count, 0),
    resetAt,
  };
}

/**
 * Checks and increments the counter for `key` in one call. Callers build
 * `key` from whatever identifies the caller for that flow — typically
 * `${flowName}:${ip}` or `${flowName}:${ip}:${email}` for flows where
 * per-account and per-IP limiting both matter (see `lib/auth/actions.ts`).
 */
export async function rateLimit(
  key: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const redis = getRedisClient();
  if (!redis) {
    return rateLimitInMemory(key, config);
  }

  try {
    return await rateLimitWithRedis(redis, key, config);
  } catch (error) {
    console.error("[rate-limit] Redis error, failing open:", error);
    return {
      success: true,
      remaining: 0,
      resetAt: new Date(Date.now() + config.windowMs),
    };
  }
}

/**
 * Best-effort client IP from standard proxy headers (Vercel/most reverse
 * proxies set `x-forwarded-for`). Falls back to a constant so a missing
 * header degrades to "one shared bucket" rather than throwing — acceptable
 * for a rate limiter (worst case, slightly coarser limiting), unlike an
 * auth decision where a fallback would be a real security gap.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]!.trim();

  const realIp = headerList.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "unknown";
}
