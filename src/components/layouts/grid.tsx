import * as React from "react";

import { cn } from "@/lib/utils";

const colsMap = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
} as const;

type ColCount = keyof typeof colsMap;

const mdColsMap: Record<ColCount, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
  6: "md:grid-cols-6",
  12: "md:grid-cols-12",
};

const lgColsMap: Record<ColCount, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

const gapMap = {
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
} as const;

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Column count at the mobile base — DESIGN_SYSTEM.md §6 (12-column grid). */
  cols?: ColCount;
  /** Column count from `md` (768px) up. */
  mdCols?: ColCount;
  /** Column count from `lg` (1024px) up. */
  lgCols?: ColCount;
  gap?: keyof typeof gapMap;
}

/**
 * The 12-column fluid grid — DESIGN_SYSTEM.md §6. Gutter defaults match the
 * spec (24px mobile / 32px desktop is expressed via the `gap` prop, not
 * hard-coded here, so a section can opt into the wider desktop gutter).
 */
export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, mdCols, lgCols, gap = 6, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid",
        colsMap[cols],
        mdCols && mdColsMap[mdCols],
        lgCols && lgColsMap[lgCols],
        gapMap[gap],
        className,
      )}
      {...props}
    />
  ),
);
Grid.displayName = "Grid";
