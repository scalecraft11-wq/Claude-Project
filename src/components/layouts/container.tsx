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
    // Narrowed to a concrete div-like shape rather than the bare
    // `React.ElementType` — with @react-three/fiber in the project,
    // `JSX.IntrinsicElements` now also includes three.js tags, and casting
    // to the *unconstrained* `React.ElementType` forces TS to satisfy every
    // tag in that much larger union at once (collapsing `className` etc. to
    // `never`). Every tag this component actually renders is HTML-div-like,
    // so that's the shape we assert.
    const Component = (as ?? "div") as unknown as React.ComponentType<
      React.ComponentPropsWithRef<"div">
    >;
    return (
      <Component
        ref={ref as React.Ref<HTMLDivElement>}
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
