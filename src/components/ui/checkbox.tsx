"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Checkbox — DESIGN_SYSTEM.md §13. `radius-xs`, fills with `accent` when
 * checked, with a short scale-in on the check mark (§13: "200ms check-mark
 * draw-in animation") rather than a hard toggle. Radix only mounts the
 * indicator once checked, so the entrance is driven by
 * `data-[state=checked]` rather than Framer Motion's `AnimatePresence`
 * (which would fight Radix's own conditional mount).
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer size-5 shrink-0 rounded-xs border border-hairline-strong",
      "transition-colors duration-fast ease-standard",
      "focus-visible:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn(
        "flex items-center justify-center text-accent-foreground",
        "data-[state=checked]:duration-fast data-[state=checked]:animate-in data-[state=checked]:zoom-in-50",
      )}
    >
      <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
