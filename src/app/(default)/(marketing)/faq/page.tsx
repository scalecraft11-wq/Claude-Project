import type { Metadata } from "next";

import { CtaBand } from "@/components/marketing/cta-band";
import { FaqBrowser } from "@/components/marketing/faq-browser";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/layouts";

import { faqCategories } from "@/lib/data/faqs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  path: "/faq",
  description:
    "Answers to the questions we hear most — how engagements work, timelines, our tech stack, pricing, and how we handle your data.",
});

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        lines={["Answers, without the", "sales call."]}
        description="Search or browse by category. If your question isn't here, it's one message away."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <Section spacing="lg">
        <Container size="lg">
          <FaqBrowser categories={faqCategories} />
        </Container>
      </Section>

      <CtaBand
        title="Still have a question?"
        description="Tell us about the project — we'll respond within one business day with a real answer."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
