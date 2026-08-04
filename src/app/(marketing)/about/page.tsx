import type { Metadata } from "next";

import { ArtworkTile } from "@/components/marketing/artwork-tile";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ValuesScroll } from "@/components/marketing/values-scroll";
import { Container, Section } from "@/components/layouts";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Timeline } from "@/components/shared/timeline";
import { HeroStats } from "@/components/lumora/hero/hero-stats";

import { processSteps, studioStats } from "@/lib/data/stats";
import { teamMembers } from "@/lib/data/team";
import { studioValues } from "@/lib/data/values";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  path: "/about",
  description:
    "Lumora Digital is an eight-year-old studio building premium, technically ambitious websites for brands that refuse to look ordinary. Meet the team.",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Lumora Digital"
        lines={["Eight years building", "for brands with taste."]}
        description="We're a small, senior studio — designers and engineers in the same room, on every project, from the first sketch to the production deploy."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      <Section spacing="lg">
        <Container
          size="lg"
          className="grid items-center gap-16 lg:grid-cols-2"
        >
          <ScrollReveal className="grid gap-6">
            <p className="text-overline text-content-muted">How we started</p>
            <h2 className="font-display text-display-03 text-content-primary">
              A studio built out of frustration with the handoff.
            </h2>
            <p className="max-w-measure text-body-lg text-content-secondary">
              Our founder spent a decade leading brand campaigns at two large
              agencies, watching beautiful design get bolted onto slow,
              unmaintainable code by a separate dev shop that never saw the
              original vision. Lumora Digital exists to close that gap: one
              team, designers and engineers together, accountable for the
              finished build — not just the mockup.
            </p>
            <p className="max-w-measure text-body-md text-content-secondary">
              Eight years and thirty-four brand launches later, that&rsquo;s
              still the whole pitch. We keep the studio small and senior on
              purpose — every project gets the people who&rsquo;ve shipped this
              exact kind of work before, not a rotating bench of juniors
              learning on a client&rsquo;s budget.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={120} className="relative">
            <ArtworkTile
              seed="about-mission"
              className="aspect-[4/5] w-full rounded-card"
            />
            <div className="bg-surface/90 absolute inset-x-6 bottom-6 rounded-card border border-hairline-subtle p-6 backdrop-blur">
              <p className="font-display text-heading-03 text-content-primary">
                &ldquo;Design that doesn&rsquo;t survive the build isn&rsquo;t
                design. It&rsquo;s a mood board.&rdquo;
              </p>
              <p className="mt-3 text-body-sm text-content-muted">
                Sam Okonkwo, Creative Director &amp; Founder
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      <ValuesScroll values={studioValues} />

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="lg" className="grid gap-16">
          <SectionHeading
            eyebrow="How we work"
            title="Consistent process, senior people, every single time."
            description="The same four-stage rhythm regardless of project size — the thing that lets a six-person studio deliver work this considered on a schedule clients can actually plan around."
          />
          <Timeline steps={processSteps} />
        </Container>
      </Section>

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="xl" className="grid gap-16">
          <SectionHeading eyebrow="The team" title="Six people, no bench." />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => (
              <ScrollReveal
                key={member.name}
                delay={index * 60}
                as="article"
                className="grid gap-4"
              >
                <ArtworkTile
                  seed={member.name}
                  className="aspect-square w-full rounded-full"
                />
                <div className="grid gap-1">
                  <h3 className="font-display text-heading-03 text-content-primary">
                    {member.name}
                  </h3>
                  <p className="text-body-sm text-content-muted">
                    {member.role}
                  </p>
                </div>
                <p className="max-w-measure text-body-sm text-content-secondary">
                  {member.bio}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section
        spacing="md"
        className="border-t border-hairline-subtle pb-section-sm"
      >
        <Container size="lg" className="grid gap-16">
          <SectionHeading
            eyebrow="Eight years in"
            title="The numbers behind the studio."
          />
          <HeroStats stats={studioStats} />
        </Container>
      </Section>

      <CtaBand
        title="Want to work with a team like this?"
        description="Tell us about the project — we'll respond within one business day with next steps, not a form-letter."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
      />
    </>
  );
}
