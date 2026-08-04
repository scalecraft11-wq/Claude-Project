"use client";

import { useBrand } from "@/contexts/brand-context";

/**
 * Full-screen branded loading shell — ANIMATION_BLUEPRINT.md §2. At the
 * foundation stage this renders the static resting mark for each brand;
 * the line-draw (Agency) / droplet-to-crescent morph (Lumora Skin) and the
 * real Drei `useProgress`-driven asset gating are wired in once the
 * corresponding routes/3D scenes exist — this component is the shell they
 * animate inside of, kept dependency-free until then.
 */
export function PageLoader() {
  const brand = useBrand();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-canvas">
      <span
        role="status"
        aria-label="Loading"
        className="font-display text-heading-02 text-content-primary"
      >
        {brand === "lumora" ? "Lumora Skin" : "Lumora Digital"}
      </span>
    </div>
  );
}
