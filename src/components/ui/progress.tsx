"use client";

import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    value={value}
    className={cn(
      "relative h-1.5 w-full overflow-hidden rounded-full bg-surface-raised",
      className,
    )}
    {...props}
  >
    <motion.div
      className="h-full rounded-full bg-accent"
      initial={{ width: 0 }}
      animate={{ width: `${value ?? 0}%` }}
      transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
