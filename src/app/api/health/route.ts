import { NextResponse } from "next/server";

import { getRedisClient } from "@/lib/redis";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Uptime-monitor target — reports real connectivity to the two stateful
 * dependencies that matter (DB, Redis), not just "the process is up."
 * Redis is optional (falls back to in-memory rate limiting/caching), so
 * its absence is reported but never fails the check; a failed DB
 * connection does. */
export async function GET() {
  const checks: Record<string, "ok" | "error" | "not_configured"> = {
    database: "ok",
    redis: "not_configured",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    checks.database = "error";
  }

  const redis = getRedisClient();
  if (redis) {
    try {
      await redis.ping();
      checks.redis = "ok";
    } catch {
      checks.redis = "error";
    }
  }

  const healthy = checks.database === "ok" && checks.redis !== "error";

  return NextResponse.json(
    {
      status: healthy ? "healthy" : "unhealthy",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: healthy ? 200 : 503 },
  );
}
