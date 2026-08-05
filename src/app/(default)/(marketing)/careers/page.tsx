import type { Metadata } from "next";
import {
  Globe,
  HeartPulse,
  Laptop,
  PiggyBank,
  Plane,
  Sparkles,
} from "lucide-react";

import { CareersJobList } from "@/components/marketing/careers-job-list";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Container, Section } from "@/components/layouts";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { jobOpenings } from "@/lib/data/jobs";
import { buildMetadata } from "@/lib/seo/metadata";

const CULTURE_POINTS = [
  {
    title: "Senior-only bench",
    description:
      "No junior rotation learning on a client's budget. Every project gets people who've shipped this exact kind of work before.",
  },
  {
    title: "Two-week iterations",
    description:
      "Working software every cycle, on every project — including internal ones. Nobody disappears into a black box for a month.",
  },
  {
    title: "Remote-first, genuinely",
    description:
      "No headquarters everyone quietly commutes to. Async by default, with overlap hours for the calls that need to be live.",
  },
  {
    title: "Craft over crunch",
    description:
      "We turn down work that doesn't fit the timeline honestly, rather than absorb it as unpaid overtime on the next project.",
  },
];

const BENEFITS = [
  { icon: Globe, label: "Remote-first, US/EU overlap hours" },
  { icon: HeartPulse, label: "Full health, dental, and vision coverage" },
  { icon: PiggyBank, label: "Profit-sharing on studio-wide performance" },
  { icon: Laptop, label: "Equipment budget, refreshed every 2 years" },
  { icon: Plane, label: "4 weeks PTO, plus studio-wide closure at year-end" },
  { icon: Sparkles, label: "Annual conference/learning budget" },
];

export const metadata: Metadata = buildMetadata({
  title: "Careers",
  path: "/careers",
  description:
    "Open roles at Lumora Digital — a small, senior, remote-first studio building premium sites for brands with taste.",
});

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        lines={["Join a studio that", "ships, not pitches."]}
        description="Six people today, growing slowly and on purpose. If you'd rather do fewer, better projects than a high-volume agency treadmill, this is that studio."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
      />

      <Section spacing="lg">
        <Container size="xl" className="grid gap-16">
          <SectionHeading eyebrow="Culture" title="How we actually work." />
          <div className="grid gap-6 sm:grid-cols-2">
            {CULTURE_POINTS.map((point, index) => (
              <ScrollReveal
                key={point.title}
                delay={index * 60}
                as="article"
                className="grid gap-3 rounded-card border border-hairline-subtle bg-surface p-8"
              >
                <h3 className="font-display text-heading-03 text-content-primary">
                  {point.title}
                </h3>
                <p className="max-w-measure text-body-md text-content-secondary">
                  {point.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-t border-hairline-subtle">
        <Container size="xl" className="grid gap-12">
          <SectionHeading eyebrow="Benefits" title="What you get, day one." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <p className="text-body-sm text-content-secondary">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="lg" className="grid gap-10">
          <SectionHeading
            eyebrow="Open roles"
            title="Where we need help right now."
          />
          <CareersJobList jobs={jobOpenings} />
        </Container>
      </Section>

      <CtaBand
        title="Don't see the right role?"
        description="We're always open to hearing from people who'd be great here — tell us what you'd want to work on."
        primaryCta={{ label: "Get in touch", href: "/contact" }}
        secondaryCta={{ label: "Read about us", href: "/about" }}
      />
    </>
  );
}
