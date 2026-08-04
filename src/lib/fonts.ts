import {
  Cormorant_Garamond,
  Fraunces,
  Inter,
  JetBrains_Mono,
  Manrope,
} from "next/font/google";

/**
 * Font pipeline for both brand expressions (DESIGN_SYSTEM.md §3).
 *
 * Every font is self-hosted via `next/font/google` (no runtime request to
 * Google Fonts, automatic `font-display: swap`, size-adjusted fallback
 * metrics to protect CLS). Each export exposes a CSS variable that
 * `tokens.css` maps to the semantic `--font-display` / `--font-ui` tokens
 * per `data-brand` — components should never reference a font export
 * directly, only the semantic Tailwind `font-display` / `font-ui` utilities.
 */

export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  // `weight` must be "variable" (not a fixed list) when `axes` is set —
  // the full weight range loads, but DESIGN_SYSTEM.md §3 still bans bold
  // serif in practice: every `font-display` type-scale token in
  // tailwind.config.ts is authored at 400/500 only.
  weight: "variable",
  display: "swap",
});

export const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant-garamond",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Combined class name to place on `<html>` so every font's CSS variable is
 * available globally; `tokens.css` resolves the right one per brand.
 */
export const fontVariables = [
  fraunces.variable,
  cormorantGaramond.variable,
  inter.variable,
  manrope.variable,
  jetbrainsMono.variable,
].join(" ");
