import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "size-4 border-2",
  md: "size-6 border-2",
  lg: "size-10 border-[3px]",
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizeMap;
  className?: string;
  /** Accessible label — spinners are always meaningful to assistive tech,
   * never purely decorative (DESIGN_SYSTEM.md §29). */
  label?: string;
}

/**
 * Minimal, brand-neutral loading indicator for inline/button contexts.
 * The full branded loading *sequence* (mark draw/morph) lives in
 * `PageLoader` — this is for smaller, secondary loading moments.
 */
export function Spinner({
  size = "md",
  className,
  label = "Loading",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block animate-spin rounded-full border-content-muted border-t-accent motion-reduce:animate-none",
        sizeMap[size],
        className,
      )}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}
