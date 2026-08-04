"use client";

import * as React from "react";

import { useBrand } from "@/contexts/brand-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

type CursorVariant = "default" | "link" | "drag" | "view";

const CURSOR_LABEL: Record<CursorVariant, string> = {
  default: "",
  link: "",
  drag: "Drag",
  view: "View",
};

/**
 * Premium custom cursor — DESIGN_SYSTEM.md §17, ANIMATION_BLUEPRINT.md §17.
 *
 * Position and hover-state are applied via direct DOM mutation inside a
 * `requestAnimationFrame` loop rather than React state — pointer events
 * fire at 60–120Hz and a `setState` per event would blow the frame budget
 * immediately (ANIMATION_BLUEPRINT.md §25).
 *
 * Elements opt into a non-default state via `data-cursor="drag"` or
 * `data-cursor="view"`; any `a`/`button`/`[role=button]` gets the default
 * "link" enlarge automatically. Scope tracking to a subtree by passing
 * `containerRef`; omit it to track the whole viewport.
 *
 * Inert on touch/coarse-pointer devices and under `prefers-reduced-motion`
 * — the custom cursor is a bonus affordance, never the only way to
 * perceive an interactive element (real focus/hover states still apply).
 */
export function CustomCursor({
  containerRef,
}: {
  containerRef?: React.RefObject<HTMLElement | null>;
}) {
  const brand = useBrand();
  const hasFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const prefersReducedMotion = usePrefersReducedMotion();
  const isEnabled = hasFinePointer && !prefersReducedMotion;

  const rootRef = React.useRef<HTMLDivElement>(null);
  const labelRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!isEnabled) return;

    const scope: HTMLElement | Document = containerRef?.current ?? document;
    const root = rootRef.current;
    const label = labelRef.current;
    if (!root) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let variant: CursorVariant = "default";
    let isVisible = false;
    let rafId = 0;

    const resolveVariant = (element: Element | null): CursorVariant => {
      const cursorTarget = element?.closest<HTMLElement>("[data-cursor]");
      const value = cursorTarget?.dataset.cursor;
      if (value === "drag" || value === "view" || value === "link") {
        return value;
      }
      if (element?.closest("a, button, [role='button'], summary")) {
        return "link";
      }
      return "default";
    };

    const isNativeControl = (element: Element | null): boolean =>
      !!element?.closest("input, textarea, select, [contenteditable='true']");

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      isVisible = !isNativeControl(event.target as Element);
      variant = resolveVariant(event.target as Element);
    };

    const handlePointerLeave = () => {
      isVisible = false;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.2;
      current.y += (target.y - current.y) * 0.2;

      root.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      root.style.opacity = isVisible ? "1" : "0";
      root.dataset.variant = variant;

      if (label) label.textContent = CURSOR_LABEL[variant];

      rafId = requestAnimationFrame(tick);
    };

    scope.addEventListener("pointermove", handlePointerMove as EventListener, {
      passive: true,
    });
    document.addEventListener("pointerleave", handlePointerLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      scope.removeEventListener(
        "pointermove",
        handlePointerMove as EventListener,
      );
      document.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isEnabled, containerRef]);

  if (!isEnabled) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-variant="default"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full opacity-0",
        "transition-[width,height,background-color,border-color] duration-fast ease-standard",
        // Resting + "link" states: an outline that never obscures content.
        "data-[variant=default]:size-3 data-[variant=link]:size-11",
        brand === "lumora"
          ? "border-content-primary data-[variant=default]:border data-[variant=link]:border"
          : "bg-content-primary data-[variant=link]:border data-[variant=link]:border-content-primary data-[variant=default]:bg-content-primary data-[variant=link]:bg-transparent",
        // "view"/"drag" states: a solid, label-bearing fill.
        brand === "lumora"
          ? "data-[variant=drag]:size-16 data-[variant=view]:size-16 data-[variant=drag]:bg-accent data-[variant=view]:bg-accent"
          : "data-[variant=drag]:size-16 data-[variant=view]:size-16 data-[variant=drag]:bg-content-primary data-[variant=view]:bg-content-primary",
      )}
    >
      <span
        ref={labelRef}
        className={cn(
          "whitespace-nowrap text-overline",
          brand === "lumora"
            ? "text-accent-foreground"
            : "text-content-inverse",
        )}
      />
    </div>
  );
}
