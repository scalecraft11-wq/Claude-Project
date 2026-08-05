"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import * as React from "react";

import { ClientLogos } from "@/components/lumora/hero/client-logos";
import { HeroTypography } from "@/components/lumora/hero/hero-typography";
import { Container } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";

import { useDeviceTier } from "@/hooks/use-device-tier";
import { useMounted } from "@/hooks/use-mounted";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const HomeHeroScene = dynamic(
  () =>
    import("@/components/marketing/home-hero-scene").then(
      (mod) => mod.HomeHeroScene,
    ),
  { ssr: false },
);

const CLIENT_NAMES = [
  "Lumora Skin",
  "Verdant & Co",
  "Solstice Beauty",
  "Marchetti",
  "Aurelia",
];

/**
 * The Agency site's own signature hero — monochrome, editorial, an
 * abstract particle field rather than a literal product
 * (DESIGN_SYSTEM.md §2.1/§24). The Lumora Skin serum-bottle scene is that
 * client's signature, not the agency's — reusing it here would blur the
 * two brand expressions the whole system is built to keep distinct.
 */
export function HomeHero() {
  const mounted = useMounted();
  const deviceTier = useDeviceTier();
  const prefersReducedMotion = usePrefersReducedMotion();

  const canRenderScene =
    mounted && deviceTier !== "tier3" && !prefersReducedMotion;

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden bg-canvas">
      <div className="absolute inset-0" aria-hidden="true">
        {canRenderScene ? (
          <HomeHeroScene tier={deviceTier} />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 30%, var(--color-accent-subtle-bg) 0%, transparent 70%)",
            }}
          />
        )}
      </div>

      <div
        aria-hidden="true"
        className="from-canvas/90 via-canvas/30 to-canvas/95 pointer-events-none absolute inset-0 bg-gradient-to-b"
      />

      <Container
        size="xl"
        className="relative z-10 flex flex-1 flex-col justify-center gap-16 pb-section-md pt-40"
      >
        <HeroTypography
          eyebrow="Lumora Digital — Premium Web Design & Engineering"
          lines={["We build the sites", "luxury brands deserve."]}
          description="Brand, 3D, motion, and full-stack engineering under one roof — for skincare, beauty, cosmetics, fashion, healthcare, and wellness brands who need their site to prove their craft before a visitor reads a word of copy."
          className="max-w-3xl"
        />

        <div className="flex flex-wrap items-center gap-4">
          <MagneticButton>
            <Button asChild size="lg" variant="primary" data-cursor="view">
              <Link href="/contact">Start a Project</Link>
            </Button>
          </MagneticButton>
          <MagneticButton>
            <Button asChild size="lg" variant="secondary" data-cursor="view">
              <Link href="/case-studies/lumora-skin">
                See the Flagship Case Study
              </Link>
            </Button>
          </MagneticButton>
        </div>

        <ClientLogos label="Trusted by" names={CLIENT_NAMES} />
      </Container>
    </section>
  );
}
