import * as React from "react";

import { cn } from "@/lib/utils";

const gapScale = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  16: "gap-16",
} as const;

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `column` (default) or `row` — matches the spacing scale in DESIGN_SYSTEM.md §5. */
  direction?: "row" | "column";
  gap?: keyof typeof gapScale;
  align?: keyof typeof alignMap;
  justify?: keyof typeof justifyMap;
  wrap?: boolean;
}

/**
 * A flex layout primitive so components never hand-roll `flex flex-col
 * gap-*` combinations — one place to keep the gap scale honest against
 * DESIGN_SYSTEM.md §5.
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = "column",
      gap = 4,
      align,
      justify,
      wrap = false,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        gapScale[gap],
        align && alignMap[align],
        justify && justifyMap[justify],
        wrap && "flex-wrap",
        className,
      )}
      {...props}
    />
  ),
);
Stack.displayName = "Stack";
