import * as React from "react";

import { cn } from "@/lib/utils";

const containerSizes = {
  lg: "max-w-container-lg",
  xl: "max-w-container-xl",
  "2xl": "max-w-container-2xl",
  "3xl": "max-w-container-3xl",
} as const;

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Max-width tier — DESIGN_SYSTEM.md §6 (Grid System). Defaults to the
   * standard content width; wide/editorial sections opt into a larger tier. */
  size?: keyof typeof containerSizes;
  as?: "div" | "section" | "article" | "header" | "footer";
}

/**
 * Horizontal content container — DESIGN_SYSTEM.md §6. Centers content and
 * applies the responsive margin scale (20px → 32px) so no page section
 * hand-rolls its own max-width/padding.
 */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ className, size = "xl", as, ...props }, ref) => {
    const Component = (as ?? "div") as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn(
          "mx-auto w-full px-5 md:px-8",
          containerSizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";
