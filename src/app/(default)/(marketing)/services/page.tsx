import type { Metadata } from "next";

import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { TechMarquee } from "@/components/marketing/tech-marquee";
import { Container, Section } from "@/components/layouts";
import { Faq } from "@/components/shared/faq";

import { services } from "@/lib/data/services";
import { buildMetadata } from "@/lib/seo/metadata";

const TECH_STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Three.js",
  "GSAP",
  "Framer Motion",
  "Prisma",
  "PostgreSQL",
  "Stripe",
];

const SERVICES_FAQ = [
  {
    question: "Do you build the 3D/animation work in-house?",
    answer:
      "Yes — our 3D and motion team works in React Three Fiber and GSAP directly, with a device-tier fallback strategy for every signature moment so performance never depends on the visitor's hardware.",
  },
  {
    question: "What's your tech stack, and can we bring our own?",
    answer:
      "Next.js, React, TypeScript, Tailwind, Prisma, and PostgreSQL by default — chosen for hiring pool size and long-term maintainability, not novelty. We're open to working within an existing stack if you already have significant infrastructure investment.",
  },
  {
    question: "How do you handle performance and accessibility?",
    answer:
      "Both are budgeted line items in the proposal, not an afterthought. We gate every build against a Lighthouse CI threshold and a WCAG 2.1 AA checklist before it ships.",
  },
  {
    question: "Can our internal team maintain the site after launch?",
    answer:
      "Yes, and we design for it deliberately. Every project ships with a documented handoff, a CMS your non-technical team can use, and a codebase built on mainstream tooling rather than a proprietary page builder.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Services",
  path: "/services",
  description:
    "Six connected disciplines — brand, 3D & motion, e-commerce engineering, product design, performance, and post-launch growth — delivered by one accountable team.",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        lines={["Six disciplines.", "One accountable team."]}
        description="No handoffs between a brand studio, a dev shop, and a motion freelancer. Pick one service or all six — the same team owns it end to end."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />

      <Section spacing="lg">
        <Container size="xl" className="grid gap-8 lg:grid-cols-2">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} expanded />
          ))}
        </Container>
      </Section>

      <Section spacing="md" className="border-t border-hairline-subtle">
        <Container size="xl" className="grid gap-12">
          <SectionHeading
            eyebrow="The stack"
            title="Mainstream tooling, no black boxes."
            description="Every build hands off on technology your engineering team can hire for and actually maintain."
            align="center"
          />
          <TechMarquee items={TECH_STACK} />
        </Container>
      </Section>

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="lg" className="grid gap-12">
          <SectionHeading
            eyebrow="Questions"
            title="Common questions about how we work."
          />
          <Faq items={SERVICES_FAQ} />
        </Container>
      </Section>

      <CtaBand
        title="Not sure which service you need?"
        description="Tell us about the project — we'll recommend a scope, not just sell you all six."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
