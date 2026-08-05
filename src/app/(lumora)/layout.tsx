import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { BagIndicator } from "@/components/lumora/bag-indicator";
import { LumoraLogo } from "@/components/lumora/lumora-logo";
import { AppProviders } from "@/components/providers/app-providers";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

import { lumoraFooterColumns, lumoraNav } from "@/config/lumora-nav";
import { fontVariables } from "@/lib/fonts";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Lumora Skin", template: "%s | Lumora Skin" },
  description:
    "Skincare, formulated like an argument. Shop the Lumora Skin collection.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fbf7f1",
};

/**
 * Independent root layout for the Lumora Skin experience — its own
 * `<html>`/`<body>`, own fixed brand default (light/porcelain, per
 * `ThemeProvider`'s per-brand default), own provider tree. A sibling of
 * `(default)`'s root layout rather than a nested branch of it: this is
 * the moment ARCHITECTURE.md's route-group rationale and the old root
 * layout's docstring both pointed at — two visually distinct premium
 * brands sharing one codebase, neither leaking into the other's chrome.
 * (Navigating between `(default)` and `(lumora)` is a full page load
 * rather than a client transition — an accepted, standard trade-off of
 * Next.js's multi-root-layout support.)
 */
export default function LumoraRootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang="en"
      data-brand="lumora"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <a
          href="#main-content"
          className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-sm bg-surface px-4 py-2 text-body-sm shadow-elevation-3"
        >
          Skip to content
        </a>
        <AppProviders brand="lumora">
          <ErrorBoundary>
            <LenisProvider>
              <Navbar
                logo={<LumoraLogo />}
                items={lumoraNav}
                cta={{
                  label: "Shop the Collection",
                  href: "/lumora/collections",
                }}
                rightExtra={<BagIndicator />}
              />
              <main id="main-content">{children}</main>
              <Footer
                logo={<LumoraLogo />}
                description="A flagship case study by Lumora Digital: a real, purchasable luxury skincare storefront demonstrating what a premium e-commerce build should feel like."
                columns={lumoraFooterColumns}
                copyrightText={`© ${new Date().getFullYear()} Lumora Skin. Demo storefront — Stripe test mode.`}
              />
            </LenisProvider>
          </ErrorBoundary>
        </AppProviders>
      </body>
    </html>
  );
}
