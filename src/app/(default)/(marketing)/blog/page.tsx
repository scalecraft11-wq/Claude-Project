import type { Metadata } from "next";

import { BlogCard } from "@/components/marketing/blog-card";
import { BlogGrid } from "@/components/marketing/blog-grid";
import { CtaBand } from "@/components/marketing/cta-band";
import { PageHero } from "@/components/marketing/page-hero";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Container, Section } from "@/components/layouts";

import { blogPosts } from "@/lib/data/blog-posts";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  path: "/blog",
  description:
    "Notes on craft, engineering, motion, and studio practice from the team building Lumora Digital's client work.",
});

export default function BlogPage() {
  const [latest, ...rest] = blogPosts;

  return (
    <>
      <PageHero
        eyebrow="Blog"
        lines={["Notes from the", "studio floor."]}
        description="How we actually make the decisions behind the work — craft, engineering, motion, and the occasional argument about restraint."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      {latest && (
        <Section spacing="md">
          <Container size="xl" className="grid gap-8">
            <SectionHeading eyebrow="Latest" title="Fresh off the press." />
            <BlogCard
              id={latest.slug}
              href={`#${latest.slug}`}
              category={latest.category}
              title={latest.title}
              excerpt={latest.excerpt}
              publishedAt={latest.publishedAt}
              authorName={latest.authorName}
              className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-10"
            />
          </Container>
        </Section>
      )}

      <Section spacing="lg" className="border-t border-hairline-subtle">
        <Container size="xl" className="grid gap-10">
          <SectionHeading eyebrow="Every post" title="Browse by category." />
          <BlogGrid posts={rest} />
        </Container>
      </Section>

      <CtaBand
        title="Like how we think? See how we build."
        description="Tell us about the project — we'll respond within one business day with next steps, not a form-letter."
        primaryCta={{ label: "Start a Project", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
      />
    </>
  );
}
