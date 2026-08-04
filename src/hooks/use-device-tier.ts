"use client";

import { useEffect, useState } from "react";

import { detectDeviceTier, type DeviceTier } from "@/lib/three/device-tier";

/**
 * React binding for `detectDeviceTier()` — ANIMATION_BLUEPRINT.md §26.
 * Returns the conservative `"tier3"` default until the client-only
 * capability check has run once, so SSR/first paint never assumes more
 * GPU headroom than a device may actually have.
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("tier3");

  useEffect(() => {
    setTier(detectDeviceTier());
  }, []);

  return tier;
}
