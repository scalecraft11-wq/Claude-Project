"use client";

import * as React from "react";

/**
 * Brand context — DESIGN_SYSTEM.md §0/§27/§28.
 *
 * The active brand is resolved server-side (the `data-brand` attribute is
 * set directly on `<html>` by the layout that knows which experience is
 * rendering — see components/providers/app-providers.tsx) so there is
 * never a client-side flash. This context exists so components can *read*
 * the active brand for behavioral branching (e.g. which cursor variant to
 * mount, per ANIMATION_BLUEPRINT.md §17) without re-deriving it from the
 * DOM or duplicating the value.
 */
export type Brand = "agency" | "lumora";

export const DEFAULT_BRAND: Brand = "agency";

const BrandContext = React.createContext<Brand>(DEFAULT_BRAND);

export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand;
  children: React.ReactNode;
}) {
  return (
    <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>
  );
}

export function useBrand(): Brand {
  return React.useContext(BrandContext);
}
