"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/error/error-fallback";

/**
 * Route-segment error boundary (Next.js App Router convention — not a
 * page). Catches any error thrown while rendering the segment below it and
 * replaces just that segment's content, keeping the rest of the shell
 * (nav, providers) intact.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire-up point for Sentry (ARCHITECTURE.md §28) once installed.
    console.error(error);
  }, [error]);

  return <ErrorFallback onRetry={reset} />;
}
