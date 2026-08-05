"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** `right` (default, cart/details) · `left` (mobile nav) · `bottom` (mobile sheet). */
  side?: "left" | "right" | "bottom";
  title: string;
  /** Set false when `title` is only for assistive tech (visually hidden) —
   * e.g. a drawer whose visible content already makes its purpose clear. */
  showTitle?: boolean;
  children: React.ReactNode;
  className?: string;
}

const sideConfig = {
  right: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
    panelClassName: "inset-y-0 right-0 h-full w-full max-w-md",
  },
  left: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
    panelClassName: "inset-y-0 left-0 h-full w-full max-w-md",
  },
  bottom: {
    initial: { y: "100%" },
    animate: { y: 0 },
    exit: { y: "100%" },
    panelClassName: "inset-x-0 bottom-0 max-h-[85vh] w-full rounded-t-2xl",
  },
} as const;

/**
 * Slide-in panel — DESIGN_SYSTEM.md §18/§10 (glass scrim, `elevation-4`
 * surface). Built on Radix Dialog's primitives directly (not the
 * `<Dialog>` wrapper) with `forceMount` + an outer `AnimatePresence`, so
 * Framer Motion — not Radix's CSS data-state transitions — owns the slide
 * physics per side (ANIMATION_BLUEPRINT.md §18). Radix still supplies the
 * focus trap, `Esc`-to-close, and scroll lock.
 */
export function Drawer({
  open,
  onOpenChange,
  side = "right",
  title,
  showTitle = true,
  children,
  className,
}: DrawerProps) {
  const variant = sideConfig[side];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="glass-surface fixed inset-0 z-50"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                initial={variant.initial}
                animate={variant.animate}
                exit={variant.exit}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "fixed z-50 flex flex-col bg-surface shadow-elevation-5",
                  variant.panelClassName,
                  className,
                )}
              >
                <div className="flex items-center justify-between border-b border-hairline-subtle p-6">
                  <DialogPrimitive.Title
                    className={cn(
                      "font-display text-heading-02",
                      !showTitle && "sr-only",
                    )}
                  >
                    {title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close className="rounded-xs text-content-muted transition-colors duration-fast hover:text-content-primary focus-visible:outline-none">
                    <X className="size-5" aria-hidden="true" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
