import type { Metadata } from "next";

import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { PricingGrid } from "@/components/marketing/pricing-grid";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Container, Section } from "@/components/layouts";
import { Faq } from "@/components/shared/faq";

import { faqCategories } from "@/lib/data/faqs";
import { pricingPlans } from "@/lib/data/pricing-plans";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  path: "/pricing",
  description:
    "Three transparent pricing tiers — Launch, Flagship, and Partner — with monthly retainer and project-based options. Fixed-price proposals, no moving estimates.",
});

const pricingFaq =
  faqCategories.find((category) => category.category === "Pricing")?.items ??
  [];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        lines={["Straightforward pricing.", "Fixed-price delivery."]}
        description="Three tiers, one team either way. Every proposal is a fixed price once we've scoped it — no moving estimate, no surprise change orders."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Pricing" }]}
      />

      <Section spacing="lg">
        <Container size="xl">
          <PricingGrid plans={pricingPlans} />
        </Container>
      </Section>

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="lg" className="grid gap-12">
          <SectionHeading
            eyebrow="Questions"
            title="Common questions about pricing."
          />
          <Faq items={pricingFaq} />
        </Container>
      </Section>

      <CtaBand
        title="Still not sure which tier fits?"
        description="Tell us about the project — we'll recommend a tier and a fixed price, not a range."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "Read the FAQ", href: "/faq" }}
      />
    </>
  );
}
