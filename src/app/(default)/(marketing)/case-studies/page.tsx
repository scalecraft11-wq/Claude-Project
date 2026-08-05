import type { Metadata } from "next";

import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Container, Section } from "@/components/layouts";
import { HeroStats } from "@/components/lumora/hero/hero-stats";

import { caseStudies } from "@/lib/data/case-studies";
import { buildMetadata } from "@/lib/seo/metadata";

const CASE_STUDY_STATS = [
  { value: 6, label: "Brands featured" },
  { value: 340, prefix: "+", suffix: "%", label: "Best conversion lift" },
  { value: 48, suffix: "%", label: "Largest return-rate reduction" },
  { value: 4, label: "Years of shipped results" },
];

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  path: "/case-studies",
  description:
    "The results behind the work — conversion lift, retention, and revenue numbers from six Lumora Digital case studies, led by the Lumora Skin flagship build.",
});

export default function CaseStudiesPage() {
  const featured = caseStudies.find((study) => study.featured);
  const rest = caseStudies.filter((study) => !study.featured);

  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        lines={["Results, not just", "screenshots."]}
        description="Every project here shipped to production traffic. The numbers below are what happened after launch, not what the mockup promised."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Case Studies" }]}
      />

      {featured && (
        <Section spacing="md">
          <Container size="xl" className="grid gap-8">
            <SectionHeading
              eyebrow="The flagship"
              title={featured.clientName}
            />
            <CaseStudyCard
              id={featured.slug}
              href={featured.href ?? "#"}
              clientName={featured.clientName}
              title={featured.title}
              summary={featured.description}
              metric={featured.metric}
            />
          </Container>
        </Section>
      )}

      <Section spacing="md" className="border-t border-hairline-subtle">
        <Container size="lg">
          <HeroStats stats={CASE_STUDY_STATS} />
        </Container>
      </Section>

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="xl" className="grid gap-16">
          <SectionHeading
            eyebrow="The rest of the portfolio"
            title="Five more brands, five more problems solved."
          />
          <div className="grid gap-16">
            {rest.map((study) => (
              <CaseStudyCard
                key={study.slug}
                id={study.slug}
                href={`#${study.slug}`}
                clientName={study.clientName}
                title={study.title}
                summary={study.description}
                metric={study.metric}
              />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        title="Ready to be the next case study?"
        description="Tell us about the project — we'll respond within one business day with next steps, not a form-letter."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "See our services", href: "/services" }}
      />
    </>
  );
}
