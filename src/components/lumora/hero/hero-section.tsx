"use client";

import { Sparkles as SparklesIcon, Droplet } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import * as React from "react";

import { ClientLogos } from "@/components/lumora/hero/client-logos";
import { FloatingGlassCard } from "@/components/lumora/hero/floating-glass-card";
import { HeroFallback } from "@/components/lumora/hero/hero-fallback";
import { HeroStats } from "@/components/lumora/hero/hero-stats";
import { HeroTypography } from "@/components/lumora/hero/hero-typography";
import { Button } from "@/components/ui/button";
import { CustomCursor } from "@/components/shared/custom-cursor";
import { MagneticButton } from "@/components/shared/magnetic-button";

import { useBreakpoint } from "@/hooks/use-media-query";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useMounted } from "@/hooks/use-mounted";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ScrollTrigger, registerGsap } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils";

const HeroScene = dynamic(
  () =>
    import("@/components/lumora/hero/hero-scene").then((mod) => mod.HeroScene),
  { ssr: false },
);

const CLIENT_NAMES = [
  "Nordique",
  "Verdant & Co",
  "Solstice Beauty",
  "Marchetti",
  "Aurelia",
];

const HERO_STATS = [
  { value: 340, prefix: "+", suffix: "%", label: "Conversion lift" },
  { value: 150, suffix: "K+", label: "Orders fulfilled" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Average rating" },
  { value: 12, label: "Weeks to launch" },
];

/**
 * The Lumora Skin flagship hero — ANIMATION_BLUEPRINT.md's centerpiece
 * moment. Composes the 3D product scene, scroll-controlled camera,
 * kinetic typography, floating glass cards, animated stats, client
 * logos, magnetic CTAs, and a premium custom cursor into one signature
 * sequence, with full device-tier/reduced-motion fallbacks.
 *
 * Scroll behavior: on desktop, capable devices, this section pins itself
 * for one viewport-height of scroll (via GSAP ScrollTrigger — no manual
 * spacer needed, ScrollTrigger inserts one automatically) while the
 * camera dollies in; mobile and reduced-motion visitors get a normal,
 * unpinned section instead (ANIMATION_BLUEPRINT.md §26).
 */
export function HeroSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const scrollProgressRef = React.useRef({ value: 0 });

  const mounted = useMounted();
  const deviceTier = useDeviceTier();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useBreakpoint("lg");
  const [mobileExploreEnabled, setMobileExploreEnabled] = React.useState(false);

  // Lenis is mounted once at the page/layout root (see
  // components/providers/lenis-provider.tsx), not here — a section must
  // never create its own competing scroll-smoothing instance
  // (hooks/use-lenis.ts's own docstring says as much). This section's GSAP
  // ScrollTrigger pin below still stays in sync with it: any single Lenis
  // instance feeding `ScrollTrigger.update()` keeps every ScrollTrigger on
  // the page correctly synced, not just the one that created it.

  const canRenderScene =
    mounted && deviceTier !== "tier3" && !prefersReducedMotion;
  const shouldPin = canRenderScene && isDesktop;
  const shouldRenderCanvas =
    canRenderScene && (isDesktop || mobileExploreEnabled);

  React.useEffect(() => {
    if (!shouldPin || !sectionRef.current) return;

    const gsap = registerGsap();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%",
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          scrollProgressRef.current.value = self.progress;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [shouldPin]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative flex w-full flex-col bg-canvas",
        // Exactly one viewport tall only while GSAP pins it (desktop) —
        // pinning assumes the pinned element represents one fixed "screen."
        // Everywhere else, the section must be free to grow: cramming
        // eyebrow + headline + description + CTA + stats + logos into a
        // hard-capped, overflow-hidden `100svh` on narrow viewports clipped
        // the client-logos row entirely (found via device-emulated testing
        // — it rendered but was permanently unreachable, not just off
        // fold), which is a real content-loss bug, not a cosmetic one.
        shouldPin ? "h-[100svh] overflow-hidden" : "min-h-[100svh]",
      )}
    >
      <CustomCursor containerRef={sectionRef} />

      {/*
        3D scene / fallback layer — capped to exactly one viewport height
        and anchored to the top, rather than stretching to `inset-0` of a
        (possibly taller, unpinned-mobile) section. If content ever
        overflows one screen on a very small viewport, it flows below this
        visual band onto the plain canvas background instead of dragging
        the product image down with it.
      */}
      <div className="absolute inset-x-0 top-0 h-[100svh]" aria-hidden="true">
        {shouldRenderCanvas ? (
          <HeroScene
            tier={deviceTier}
            scrollProgressRef={scrollProgressRef}
            interactive={!prefersReducedMotion}
          />
        ) : (
          <HeroFallback className="size-full" />
        )}
      </div>

      {/*
        Ambient gradient wash — DESIGN_SYSTEM.md §18. Stronger at top and
        bottom (where the headline and CTA/stats/logos sit) than in the
        middle (where the product should read clearly), so foreground text
        keeps real contrast against either the 3D scene or the static
        fallback behind it, on any viewport.
      */}
      <div
        aria-hidden="true"
        className="from-canvas/85 via-canvas/10 to-canvas/80 pointer-events-none absolute inset-x-0 top-0 h-[100svh] bg-gradient-to-b"
      />

      {/* Mobile progressive-engagement gate — ANIMATION_BLUEPRINT.md §26 */}
      {mounted && canRenderScene && !isDesktop && !mobileExploreEnabled && (
        <div
          // Anchored from the top of the fixed 100svh visual band (not
          // `bottom-*`, which would anchor to the bottom of the section's
          // own box — unpinned/mobile sections can grow taller than one
          // screen, which would drag a bottom-anchored button down with it.
          className="absolute inset-x-0 top-[calc(100svh-8rem)] flex justify-center"
        >
          <Button
            variant="secondary"
            size="sm"
            className="glass-surface"
            onClick={() => setMobileExploreEnabled(true)}
          >
            Explore in 3D
          </Button>
        </div>
      )}

      {/*
        Floating glass cards — desktop-only (xl+), pinned to a narrow
        right-hand column clear of the headline (left-aligned, max-w-2xl),
        the centered bottle, and the full-width stats/CTA band at the
        bottom. Two cards, generously spaced, rather than three crammed
        into that column — safer across the range of common desktop
        viewport heights.
      */}
      <FloatingGlassCard
        icon={<Droplet className="size-5" />}
        title="Hyaluronic Acid"
        description="Deep hydration that visibly lasts 24 hours."
        delay={700}
        floatDurationS={7}
        className="right-[4%] top-[10%] hidden max-w-[220px] xl:block"
      />
      <FloatingGlassCard
        icon={<SparklesIcon className="size-5" />}
        title="Vitamin C"
        description="Brightens and evens tone with daily use."
        delay={950}
        floatDurationS={8.5}
        className="right-[4%] top-[42%] hidden max-w-[220px] xl:block"
      />

      {/* Foreground content */}
      <div
        className={cn(
          "relative z-10 flex flex-col px-5 pb-8 pt-28 md:px-8 md:pb-10 md:pt-32",
          // `justify-between` spread across a full-height flex column only
          // makes sense when the section is a fixed one-screen box
          // (pinned/desktop); unpinned, content stacks with its own gap
          // instead of being forced to fill a height it may exceed.
          shouldPin
            ? "h-full justify-between"
            : "min-h-full justify-start gap-10",
        )}
      >
        <HeroTypography
          eyebrow="Lumora Skin — Renewal Collection"
          lines={["Skincare, formulated", "like an argument."]}
          description="Every ingredient earns its place. Lumora Skin is a flagship case study in what a premium, technically ambitious e-commerce build should feel like — designed, built, and shipped by Lumora Digital."
          className="max-w-2xl"
        />

        <div className="grid gap-10">
          <div className="flex flex-wrap items-center gap-4">
            <MagneticButton>
              <Button size="lg" variant="primary" data-cursor="view" asChild>
                <Link href="/lumora/collections">Shop the Collection</Link>
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/case-studies">Watch the Film</Link>
              </Button>
            </MagneticButton>
          </div>

          <HeroStats stats={HERO_STATS} />

          <ClientLogos names={CLIENT_NAMES} />
        </div>
      </div>
    </section>
  );
}
