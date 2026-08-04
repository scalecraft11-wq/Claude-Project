import type { Metadata } from "next";

import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { PortfolioGrid } from "@/components/marketing/portfolio-grid";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Container, Section } from "@/components/layouts";

import { caseStudies } from "@/lib/data/case-studies";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Portfolio",
  path: "/work",
  description:
    "Six brands, six different problems — luxury skincare, wellness subscriptions, color cosmetics, fashion editorial, and direct-to-consumer relaunches, all built by Lumora Digital.",
});

export default function WorkPage() {
  const featured = caseStudies.find((study) => study.featured);
  const rest = caseStudies.filter((study) => !study.featured);

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        lines={["Work that earns", "the case study."]}
        description="Six brands, six different problems. Every project below shipped to production traffic — this is the work, not a highlight reel."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
      />

      {featured && (
        <Section spacing="md">
          <Container size="xl" className="grid gap-8">
            <SectionHeading eyebrow="Start here" title="The flagship." />
            <CaseStudyCard
              href={featured.href ?? "/case-studies"}
              clientName={featured.clientName}
              title={featured.title}
              summary={featured.summary}
              metric={featured.metric}
            />
          </Container>
        </Section>
      )}

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="xl" className="grid gap-10">
          <SectionHeading eyebrow="Every project" title="Filter by industry." />
          <PortfolioGrid caseStudies={rest} />
        </Container>
      </Section>

      <CtaBand
        title="Want your brand's site in this list?"
        description="Tell us about the project — we'll respond within one business day with next steps, not a form-letter."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "Read the case studies", href: "/case-studies" }}
      />
    </>
  );
}
