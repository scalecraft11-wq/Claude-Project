"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/providers/theme-provider";

import { BrandProvider, type Brand } from "@/contexts/brand-context";
import { MotionPreferenceProvider } from "@/contexts/motion-preference-context";

/**
 * Single composition root for every cross-cutting client provider. The
 * root layout renders this once around `children`; individual providers
 * are added here (and only here) as the app grows — no component should
 * reach for a provider that isn't wired through this file.
 *
 * `data-brand` itself is set server-side directly on `<html>` by the
 * layout (so there's no flash of the wrong brand) — `BrandProvider` just
 * mirrors that same value into React context for components that need to
 * branch behavior on it.
 */
export function AppProviders({
  brand,
  children,
}: {
  brand: Brand;
  children: ReactNode;
}) {
  return (
    <BrandProvider brand={brand}>
      <ThemeProvider brand={brand}>
        <MotionPreferenceProvider>{children}</MotionPreferenceProvider>
      </ThemeProvider>
    </BrandProvider>
  );
}
