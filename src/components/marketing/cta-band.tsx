import Link from "next/link";

import { Container } from "@/components/layouts";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { Button } from "@/components/ui/button";

export interface CtaBandProps {
  title: string;
  description?: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

/**
 * The closing CTA band reused at the bottom of nearly every marketing
 * page — one consistent "ready to talk?" moment rather than a bespoke
 * sign-off per page.
 */
export function CtaBand({
  title,
  description,
  primaryCta,
  secondaryCta,
}: CtaBandProps) {
  return (
    <section className="border-t border-hairline-subtle py-section-md">
      <Container size="lg">
        <ScrollReveal className="grid justify-items-center gap-6 text-center">
          <h2 className="max-w-2xl font-display text-display-02 text-content-primary">
            {title}
          </h2>
          {description && (
            <p className="max-w-measure text-body-lg text-content-secondary">
              {description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton>
              <Button asChild size="lg" variant="primary" data-cursor="view">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            </MagneticButton>
            {secondaryCta && (
              <MagneticButton>
                <Button asChild size="lg" variant="secondary">
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              </MagneticButton>
            )}
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
