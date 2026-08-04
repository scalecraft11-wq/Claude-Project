"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

import type { Brand } from "@/contexts/brand-context";

/**
 * Wraps `next-themes`, targeting the `data-theme` attribute our token
 * layer (`styles/tokens.css`) resolves against — DESIGN_SYSTEM.md §27/§28.
 *
 * Each brand ships a deliberately different **designed** default (Agency:
 * dark/editorial; Lumora Skin: light/porcelain) rather than deferring to
 * `prefers-color-scheme` on first visit: a first-time visitor to Lumora
 * Skin should see the porcelain-daylight experience the brand was designed
 * around, not a dark mode that happens to match their OS setting. Once a
 * visitor picks a theme explicitly, `next-themes` persists that choice
 * (localStorage) for the rest of the site.
 */
export function ThemeProvider({
  brand,
  children,
  ...props
}: {
  brand: Brand;
} & Omit<ComponentProps<typeof NextThemesProvider>, "attribute">) {
  const defaultTheme = brand === "lumora" ? "light" : "dark";

  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={defaultTheme}
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
