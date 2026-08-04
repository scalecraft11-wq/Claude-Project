import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "@/lib/env";
import { PrismaClient } from "../../generated/prisma/client";

/**
 * Prisma Client singleton — Prisma 7 requires an explicit driver adapter
 * (no more implicit connection-string reading from the schema file), so
 * this is also where the Postgres connection actually gets configured,
 * once, in one place.
 *
 * Cached on `globalThis` in development so Next.js's hot-reload doesn't
 * spin up a fresh connection pool on every file save — in production each
 * server instance gets exactly one client for its lifetime either way.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set — see .env.example and docs/AUTHENTICATION.md for local setup.",
    );
  }

  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
