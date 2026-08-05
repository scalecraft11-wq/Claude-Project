import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Input — DESIGN_SYSTEM.md §13. Pair with `<Label>` above it (static label,
 * never placeholder-as-label) and reserve space for helper/error text below
 * so validation never shifts layout — see §14 (Forms).
 */
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-sm border border-hairline-subtle bg-surface px-4",
        "text-body-md text-content-primary placeholder:text-content-muted",
        "transition-colors duration-fast ease-standard",
        "focus-visible:ring-accent/40 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-content-muted",
        "aria-[invalid=true]:focus-visible:ring-danger/40 aria-[invalid=true]:border-danger",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
