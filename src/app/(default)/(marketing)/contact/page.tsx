import type { Metadata } from "next";
import { Mail, Clock, MapPin } from "lucide-react";

import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero } from "@/components/marketing/page-hero";
import { Container, Section } from "@/components/layouts";
import { Faq } from "@/components/shared/faq";

import { faqCategories } from "@/lib/data/faqs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  path: "/contact",
  description:
    "Tell us about your project — project type, budget, and timeline — and we'll respond within one business day with next steps, not a form-letter.",
});

const workingWithUsFaq =
  faqCategories
    .find((category) => category.category === "Working with us")
    ?.items.slice(0, 3) ?? [];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        lines={["Let's build something", "worth the case study."]}
        description="Four short steps — project type, budget, timeline, and how to reach you. No account creation, no sales call required to get a real answer."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      <Section spacing="lg">
        <Container size="xl" className="grid gap-12 lg:grid-cols-[1fr_360px]">
          <ContactForm />

          <div className="grid content-start gap-10">
            <div className="grid gap-6 rounded-card border border-hairline-subtle bg-surface p-8">
              <h2 className="font-display text-heading-03 text-content-primary">
                Prefer to reach us directly?
              </h2>
              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <Mail
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-body-sm font-medium text-content-primary">
                      Email
                    </p>
                    <p className="text-body-sm text-content-secondary">
                      hello@lumoradigital.studio
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-body-sm font-medium text-content-primary">
                      Response time
                    </p>
                    <p className="text-body-sm text-content-secondary">
                      Within one business day, every time.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-body-sm font-medium text-content-primary">
                      Studio
                    </p>
                    <p className="text-body-sm text-content-secondary">
                      Remote-first, working across US and EU time zones.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <h2 className="font-display text-heading-03 text-content-primary">
                Before you write in
              </h2>
              <Faq items={workingWithUsFaq} />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
