import pino from "pino";

import { env } from "@/lib/env";

/**
 * Structured logging — JSON lines in production (log-aggregator-friendly:
 * Vercel, Datadog, CloudWatch all parse pino's JSON output natively),
 * human-readable pretty-printing in development. One shared instance;
 * feature areas get their own child logger via `logger.child({ module })`
 * rather than constructing a new pino instance each time, so log level
 * and destination stay centrally controlled.
 */
export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  ...(env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss",
        ignore: "pid,hostname",
      },
    },
  }),
  base: undefined,
  redact: [
    "*.password",
    "*.passwordHash",
    "*.token",
    "*.secret",
    "*.authorization",
  ],
});

export type Logger = typeof logger;
