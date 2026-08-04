import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Textarea — DESIGN_SYSTEM.md §13. Same visual language as `<Input>`:
 * static label above (never placeholder-as-label), min-height of ~3 lines,
 * vertical resize only.
 */
const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full resize-y rounded-sm border border-hairline-subtle bg-surface px-4 py-3",
      "text-body-md text-content-primary placeholder:text-content-muted",
      "transition-colors duration-fast ease-standard",
      "focus-visible:ring-accent/40 focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
      "disabled:cursor-not-allowed disabled:bg-surface-raised disabled:text-content-muted",
      "aria-[invalid=true]:focus-visible:ring-danger/40 aria-[invalid=true]:border-danger",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
