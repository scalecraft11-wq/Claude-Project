"use client";

import * as React from "react";

import { SectionHeading } from "@/components/marketing/section-heading";
import { Container } from "@/components/layouts";
import { useBreakpoint } from "@/hooks/use-media-query";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useMounted } from "@/hooks/use-mounted";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { ScrollTrigger, registerGsap } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils";
import type { StudioValue } from "@/lib/data/values";

export interface ValuesScrollProps {
  values: StudioValue[];
}

/**
 * About page's one signature scroll-scrubbed moment
 * (ANIMATION_BLUEPRINT.md §4/§20: 1–2 pinned/scrubbed sequences per page,
 * everything else is a standard `ScrollReveal`). Pins the section and
 * translates the value cards horizontally in lockstep with vertical
 * scroll — desktop, capable devices, no reduced-motion only. Mobile,
 * `tier3`, and reduced-motion visitors get the same cards in a plain
 * wrapped grid instead: identical content, no pin, no horizontal scroll
 * hijack.
 */
export function ValuesScroll({ values }: ValuesScrollProps) {
  const sectionRef = React.useRef<HTMLElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const mounted = useMounted();
  const deviceTier = useDeviceTier();
  const prefersReducedMotion = usePrefersReducedMotion();
  const isDesktop = useBreakpoint("lg");

  const shouldPin =
    mounted && isDesktop && deviceTier !== "tier3" && !prefersReducedMotion;

  React.useEffect(() => {
    if (!shouldPin || !sectionRef.current || !trackRef.current) return;

    const gsap = registerGsap();
    const section = sectionRef.current;
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      const scrollDistance = () =>
        Math.max(track.scrollWidth - section.offsetWidth, 0);

      gsap.to(track, {
        x: () => -scrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${scrollDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [shouldPin]);

  React.useEffect(() => {
    if (!shouldPin) return;
    return () => ScrollTrigger.refresh();
  }, [shouldPin]);

  return (
    <section ref={sectionRef} className={cn(shouldPin && "overflow-hidden")}>
      <Container size="xl" className="grid gap-16 py-section-lg">
        <SectionHeading
          eyebrow="What we believe"
          title="Five things we won't compromise on."
        />
        <div
          ref={trackRef}
          className={cn(
            "grid gap-6",
            shouldPin
              ? "auto-cols-[min(85vw,26rem)] grid-flow-col"
              : "sm:grid-cols-2 lg:grid-cols-3",
          )}
        >
          {values.map((value) => (
            <article
              key={value.number}
              className="grid gap-4 rounded-card border border-hairline-subtle bg-surface-raised p-8"
            >
              <span className="font-display text-display-03 text-content-muted">
                {value.number}
              </span>
              <h3 className="font-display text-heading-02 text-content-primary">
                {value.title}
              </h3>
              <p className="max-w-measure text-body-md text-content-secondary">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
