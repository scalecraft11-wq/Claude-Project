import type { Metadata, Viewport } from "next";

import { AppProviders } from "@/components/providers/app-providers";
import { ErrorBoundary } from "@/components/error/error-boundary";

import { DEFAULT_BRAND } from "@/contexts/brand-context";
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
 * The single root layout Next.js requires. `data-brand` defaults to
 * `"agency"` for now — there is only one experience mounted at this stage
 * (ARCHITECTURE.md §11 route groups don't exist yet: "no homepage yet").
 *
 * Once `(marketing)` and `(lumora)` route groups are built, revisit this:
 * per ARCHITECTURE.md §11, Next.js allows each top-level route group to
 * define its *own* root layout (own `<html>`/`<body>`) when there's no
 * shared layout above them — that's the zero-FOUC way to give Lumora Skin
 * a genuinely independent brand root instead of a runtime-branched
 * `data-brand` on one shared `<html>`. Deferred deliberately: building
 * that now would mean building the route groups themselves, which is out
 * of scope for this pass ("do not build pages").
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-brand={DEFAULT_BRAND}
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
        <AppProviders brand={DEFAULT_BRAND}>
          <ErrorBoundary>
            <main id="main-content">{children}</main>
          </ErrorBoundary>
        </AppProviders>
      </body>
    </html>
  );
}
