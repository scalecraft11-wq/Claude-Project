import type { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { apiError, apiServerError } from "@/lib/api/response";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "api" });

type RouteHandler<Context> = (
  request: NextRequest,
  context: Context,
) => Promise<NextResponse>;

/** Wraps a Route Handler so an unexpected throw becomes a clean, logged
 * 500 (or 400 for a Zod validation error) instead of Next's generic
 * unhandled-error page — the same "never leak a raw stack trace to the
 * caller" boundary every Server Action already gets for free via its own
 * try/catch + ActionResult return, applied here for the REST layer. */
export function withApiErrorHandling<Context>(
  handler: RouteHandler<Context>,
): RouteHandler<Context> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = {};
        for (const issue of error.issues) {
          const key = issue.path.join(".") || "_root";
          (fieldErrors[key] ??= []).push(issue.message);
        }
        return apiError("Validation failed.", 400, fieldErrors);
      }

      log.error(
        { err: error, path: request.nextUrl.pathname, method: request.method },
        "unhandled API error",
      );
      return apiServerError();
    }
  };
}
