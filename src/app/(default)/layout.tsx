import type { Metadata, Viewport } from "next";

import { AppProviders } from "@/components/providers/app-providers";
import { ErrorBoundary } from "@/components/error/error-boundary";

import { fontVariables } from "@/lib/fonts";
import { buildMetadata } from "@/lib/seo/metadata";

import "@/styles/globals.css";

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcfbf9" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0c09" },
  ],
};

/**
 * Root layout for the agency experience — marketing, auth, the customer
 * dashboard, and the admin panel. `(lumora)` is a sibling route group with
 * its own independent root layout (own `<html>`/`<body>`, own brand/theme
 * defaults) rather than a `data-brand` switch on this one: Next.js
 * supports multiple root layouts precisely so two visually distinct
 * brand experiences can share one codebase without either one leaking
 * into the other's providers, fonts, or default theme (see that layout's
 * own docstring, and ARCHITECTURE.md's route-group rationale).
 */
export default function DefaultRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-brand="agency"
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
        <AppProviders brand="agency">
          <ErrorBoundary>
            <main id="main-content">{children}</main>
          </ErrorBoundary>
        </AppProviders>
      </body>
    </html>
  );
}
