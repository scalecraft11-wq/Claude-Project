"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Switch — DESIGN_SYSTEM.md §13: "pill track, thumb slides with a slight
 * overshoot easing — the one place a 'bouncy' feeling is allowed, because
 * it's a direct-manipulation toggle." The thumb is a Framer Motion spring
 * (`motion.span` via Radix's `asChild`) rather than a CSS transition, since
 * only a physically-modeled spring can overshoot past its resting position.
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(
    checked ?? defaultChecked ?? false,
  );

  React.useEffect(() => {
    if (checked !== undefined) setIsChecked(checked);
  }, [checked]);

  return (
    <SwitchPrimitive.Root
      ref={ref}
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(value) => {
        setIsChecked(value);
        onCheckedChange?.(value);
      }}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-surface-raised",
        "border border-hairline-strong transition-colors duration-fast ease-standard",
        "focus-visible:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
        "disabled:cursor-not-allowed disabled:opacity-40",
        "data-[state=checked]:border-accent data-[state=checked]:bg-accent",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb asChild>
        <motion.span
          className="block size-5 rounded-full bg-surface shadow-elevation-1"
          animate={{ x: isChecked ? 22 : 2 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 22,
            mass: 0.6,
          }}
        />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch };
