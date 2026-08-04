import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

/**
 * Loading-state placeholder — used instead of a spinner wherever the
 * final content's shape is known ahead of time (a card, a line of text),
 * so the layout doesn't shift when real content arrives.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-sm bg-surface-raised motion-safe:animate-pulse",
        className,
      )}
      {...props}
    />
  );
}
