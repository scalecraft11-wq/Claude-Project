import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export interface ErrorFallbackProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

/**
 * Default presentational error state — deliberately quiet and on-brand
 * (DESIGN_SYSTEM.md §1: restraint applies to failure states too, no
 * cartoon illustrations or alarming red screens). Used by both the
 * generic `<ErrorBoundary>` and the framework-level `app/error.tsx`.
 */
export function ErrorFallback({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again — if the problem persists, it's on us, not you.",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="font-display text-heading-02">{title}</p>
      <p className="max-w-measure text-body-md text-content-secondary">
        {description}
      </p>
      {onRetry ? (
        <Button variant="secondary" size="md" onClick={onRetry}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Try again
        </Button>
      ) : null}
    </div>
  );
}
