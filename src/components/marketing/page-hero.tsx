import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/layouts";
import { HeroTypography } from "@/components/lumora/hero/hero-typography";

export interface PageHeroProps {
  eyebrow: string;
  lines: string[];
  description?: string;
  breadcrumbs: BreadcrumbItem[];
}

/**
 * The quiet page-intro banner used by every marketing page except Home —
 * one full-3D, scroll-scrubbed signature hero per the whole site is the
 * point (ANIMATION_BLUEPRINT.md §0/§20); everywhere else gets the same
 * calm, kinetic-headline recipe. Reuses `<HeroTypography>` (already
 * brand-generic) rather than re-implementing the line-mask reveal.
 */
export function PageHero({
  eyebrow,
  lines,
  description,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="pb-section-sm pt-32 md:pt-40">
      <Container size="lg" className="grid gap-8">
        <Breadcrumbs items={breadcrumbs} />
        <HeroTypography
          eyebrow={eyebrow}
          lines={lines}
          description={description}
          className="max-w-3xl"
        />
      </Container>
    </section>
  );
}
