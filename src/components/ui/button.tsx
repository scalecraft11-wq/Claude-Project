import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Button — DESIGN_SYSTEM.md §11.
 *
 * Variant fills resolve per `data-brand`/`data-theme` automatically through
 * the `button-primary` / `accent` token pair (tokens.css) — this component
 * never branches on brand itself. At most one `primary` button should be
 * visible per viewport (Design System "rule of one").
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-ui text-button transition-[transform,background-color,color,box-shadow]",
    "duration-fast ease-standard active:scale-[0.98] active:duration-instant",
    "disabled:pointer-events-none disabled:opacity-40 disabled:active:scale-100",
  ],
  {
    variants: {
      variant: {
        primary:
          "rounded-button bg-button-primary text-button-primary-foreground hover:opacity-90",
        secondary:
          "rounded-button border border-hairline-strong bg-transparent text-content-primary hover:bg-surface-raised",
        ghost:
          "rounded-button bg-transparent text-content-primary underline-offset-4 hover:underline",
        link: "text-accent underline-offset-4 hover:underline",
        icon: "rounded-button bg-transparent text-content-primary hover:bg-surface-raised",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-11 px-5",
        lg: "h-14 px-8 text-base",
        icon: "size-11",
      },
    },
    compoundVariants: [
      // Icon buttons keep a square/circular hit area regardless of `size`.
      { variant: "icon", size: "sm", class: "size-8 p-0" },
      { variant: "icon", size: "md", class: "size-11 p-0" },
      { variant: "icon", size: "lg", class: "size-14 p-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the child element (Radix `Slot`) instead of a `<button>`. */
    asChild?: boolean;
    /**
     * Shows a spinner in place of the label and locks the button's current
     * width so loading never causes layout shift — DESIGN_SYSTEM.md §11.
     */
    isLoading?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled ?? isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            <span className="sr-only">Loading</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
