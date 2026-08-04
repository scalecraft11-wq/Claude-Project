import type { ReactNode } from "react";

import { AgencyLogo } from "@/components/marketing/agency-logo";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { CookieBanner } from "@/components/shared/cookie-banner";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { Footer } from "@/components/shared/footer";
import { Navbar } from "@/components/shared/navbar";

import { footerColumns, primaryNav } from "@/config/nav";

/**
 * Root layout for every Agency-brand marketing route. Owns the one Lenis
 * instance for the whole page (ANIMATION_BLUEPRINT.md §22), the site-wide
 * chrome (Navbar/Footer), and the two cross-page affordances the design
 * system specifies for the Agency site: the custom cursor and the cookie
 * consent banner.
 */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  // No <main> here — the root layout (app/layout.tsx) already provides the
  // page's single <main id="main-content"> landmark around everything this
  // layout renders; a second nested <main> (and a duplicate id) would be
  // invalid.
  return (
    <LenisProvider>
      <CustomCursor />
      <Navbar
        logo={<AgencyLogo />}
        items={primaryNav}
        cta={{ label: "Start a Project", href: "/contact" }}
      />
      {children}
      <Footer
        logo={<AgencyLogo />}
        description="We design and build premium digital experiences for luxury skincare, beauty, cosmetics, fashion, healthcare, and wellness brands."
        columns={footerColumns}
        copyrightText={`© ${new Date().getFullYear()} Lumora Digital. All rights reserved.`}
      />
      <CookieBanner />
    </LenisProvider>
  );
}
