import type { Metadata } from "next";

import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { CtaBand } from "@/components/marketing/cta-band";
import { HomeHero } from "@/components/marketing/home-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { Container, Section } from "@/components/layouts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeroStats } from "@/components/lumora/hero/hero-stats";
import { Timeline } from "@/components/shared/timeline";

import { caseStudies } from "@/lib/data/case-studies";
import { processSteps, studioStats } from "@/lib/data/stats";
import { services } from "@/lib/data/services";
import { testimonials } from "@/lib/data/testimonials";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ path: "/" });

export default function HomePage() {
  const featuredCaseStudy = caseStudies.find((study) => study.featured);
  const jsonLd = organizationJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeHero />

      <Section spacing="lg">
        <Container size="xl" className="grid gap-16">
          <SectionHeading
            eyebrow="What we do"
            title="Six disciplines, one connected team."
            description="No handoffs between a brand studio, a dev shop, and a motion freelancer. One team owns the whole build, from the first sketch to the production deploy."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Container>
      </Section>

      {featuredCaseStudy && (
        <Section spacing="lg" className="border-t border-hairline-subtle">
          <Container size="xl" className="grid gap-16">
            <SectionHeading
              eyebrow="Featured work"
              title="The project we point to first."
              description="A full 3D commerce build for a luxury skincare launch — the clearest proof of what 'premium' means when we build it."
            />
            <CaseStudyCard
              href={featuredCaseStudy.href ?? "/case-studies"}
              clientName={featuredCaseStudy.clientName}
              title={featuredCaseStudy.title}
              summary={featuredCaseStudy.summary}
              metric={featuredCaseStudy.metric}
            />
          </Container>
        </Section>
      )}

      <Section spacing="md" className="border-t border-hairline-subtle">
        <Container size="lg" className="grid gap-16">
          <SectionHeading
            eyebrow="How we work"
            title="A process built for momentum, not surprises."
            description="Two-week iterations, working software every cycle, and a fixed-price proposal before a single line of code ships."
          />
          <Timeline steps={processSteps} />
        </Container>
      </Section>

      <Section spacing="md" className="border-t border-hairline-subtle">
        <Container size="lg" className="grid gap-16">
          <SectionHeading
            eyebrow="Client results"
            title="Numbers our clients actually track."
          />
          <HeroStats stats={studioStats} />
        </Container>
      </Section>

      <Section
        spacing="md"
        className="border-t border-hairline-subtle pb-section-sm"
      >
        <Container size="xl" className="grid gap-16">
          <SectionHeading
            eyebrow="In their words"
            title="What it's like to work with us."
          />
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem
                  key={testimonial.authorName}
                  className="sm:basis-1/2 lg:basis-1/3"
                >
                  <TestimonialCard {...testimonial} className="h-full" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="mt-8 flex justify-center gap-3">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </Container>
      </Section>

      <CtaBand
        title="Ready to build the site your brand deserves?"
        description="Tell us about the project — we'll respond within one business day with next steps, not a form-letter."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "See our pricing", href: "/pricing" }}
      />
    </>
  );
}
