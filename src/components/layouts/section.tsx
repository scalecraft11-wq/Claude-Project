import * as React from "react";

import { cn } from "@/lib/utils";

const spacingTop = {
  none: "pt-0",
  sm: "pt-section-sm",
  md: "pt-section-md",
  lg: "pt-section-lg",
} as const;

const spacingBottom = {
  none: "pb-0",
  sm: "pb-section-sm",
  md: "pb-section-md",
  lg: "pb-section-lg",
} as const;

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Vertical rhythm tier — DESIGN_SYSTEM.md §5 (macro/section spacing). */
  spacing?: keyof typeof spacingTop;
  as?: "section" | "div" | "article";
}

/**
 * A page section's vertical rhythm — DESIGN_SYSTEM.md §1 ("whitespace is
 * the primary design material") and §5. Composes with `<Container>` for
 * horizontal measure; this component owns only the top/bottom spacing.
 */
export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", as, ...props }, ref) => {
    // See Container.tsx for why this is narrowed rather than cast to the
    // bare `React.ElementType`.
    const Component = (as ?? "section") as unknown as React.ComponentType<
      React.ComponentPropsWithRef<"div">
    >;
    return (
      <Component
        ref={ref as React.Ref<HTMLDivElement>}
        className={cn(spacingTop[spacing], spacingBottom[spacing], className)}
        {...props}
      />
    );
  },
);
Section.displayName = "Section";
