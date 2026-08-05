"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const TabsActiveValueContext = React.createContext<string | undefined>(
  undefined,
);

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ value, defaultValue, onValueChange, ...props }, ref) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const activeValue = value ?? internalValue;

  return (
    <TabsActiveValueContext.Provider value={activeValue}>
      <TabsPrimitive.Root
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next) => {
          setInternalValue(next);
          onValueChange?.(next);
        }}
        {...props}
      />
    </TabsActiveValueContext.Provider>
  );
});
Tabs.displayName = TabsPrimitive.Root.displayName;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-center gap-6 border-b border-hairline-subtle",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * The active tab's underline is a single Framer Motion element sharing a
 * `layoutId` — when the active value changes, Motion animates it from its
 * previous position/width to the new one rather than each trigger owning
 * a static underline (ANIMATION_BLUEPRINT.md §12).
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, value, children, ...props }, ref) => {
  const activeValue = React.useContext(TabsActiveValueContext);
  const isActive = activeValue === value;

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(
        "relative py-3 text-body-sm font-medium transition-colors duration-fast focus-visible:outline-none",
        isActive
          ? "text-content-primary"
          : "text-content-secondary hover:text-content-primary",
        className,
      )}
      {...props}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="tabs-active-indicator"
          className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 duration-base animate-in fade-in focus-visible:outline-none",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
