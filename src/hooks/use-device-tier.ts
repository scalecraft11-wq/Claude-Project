"use client";

import { useState } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { detectDeviceTier, type DeviceTier } from "@/lib/three/device-tier";

/**
 * React binding for `detectDeviceTier()` — ANIMATION_BLUEPRINT.md §26.
 * Returns the conservative `"tier3"` default until the client-only
 * capability check has run once, so SSR/first paint never assumes more
 * GPU headroom than a device may actually have. Resolved in a layout
 * effect (not a passive effect) so the real tier is known before the
 * browser paints the first frame — a tier1/2 device never visibly flashes
 * the tier3 fallback first.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("tier3");

  useIsomorphicLayoutEffect(() => {
    setTier(detectDeviceTier());
  }, []);

  return tier;
}
