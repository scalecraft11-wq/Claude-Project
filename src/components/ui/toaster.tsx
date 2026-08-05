"use client";

import { useTheme } from "next-themes";
import { Toaster as SonnerToaster } from "sonner";

/**
 * Toast notifications — backed by `sonner` rather than a hand-rolled
 * Radix Toast + reducer store: it ships fully accessible (live-region
 * announcements, pause-on-hover/focus, swipe-to-dismiss) and animated out
 * of the box, which is a better use of the "production ready" budget than
 * re-implementing that state machine ourselves. Themed onto our tokens via
 * `toastOptions.classNames`; mount `<Toaster>` once near the app root and
 * call the re-exported `toast()` from anywhere.
 */
export function Toaster() {
  const { resolvedTheme } = useTheme();

  return (
    <SonnerToaster
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      position="bottom-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-surface !border-hairline-subtle !text-content-primary !shadow-elevation-4 !rounded-card",
          title: "!text-body-sm !font-medium",
          description: "!text-body-sm !text-content-secondary",
          actionButton: "!bg-button-primary !text-button-primary-foreground",
          cancelButton: "!bg-surface-raised !text-content-secondary",
          closeButton:
            "!bg-surface !border-hairline-subtle !text-content-muted",
        },
      }}
    />
  );
}

export { toast } from "sonner";
