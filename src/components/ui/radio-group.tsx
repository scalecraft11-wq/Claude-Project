"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("grid gap-3", className)}
    {...props}
  />
));
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/** Radio items stay circular regardless of brand — a convention, not a
 * `radius-button` token consumer (DESIGN_SYSTEM.md §13). */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "aspect-square size-5 shrink-0 rounded-full border border-hairline-strong",
      "transition-colors duration-fast ease-standard",
      "focus-visible:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
      "disabled:cursor-not-allowed disabled:opacity-40",
      "data-[state=checked]:border-accent",
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator
      className={cn(
        "flex items-center justify-center",
        "data-[state=checked]:duration-fast data-[state=checked]:animate-in data-[state=checked]:zoom-in-50",
      )}
    >
      <span className="size-2.5 rounded-full bg-accent" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
