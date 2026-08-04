import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { ServiceIcon } from "@/components/marketing/service-icon";

import type { Service } from "@/lib/data/services";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  service: Service;
  /** Renders the full deliverables list — used on the Services page;
   * omitted for the lighter homepage teaser. */
  expanded?: boolean;
  className?: string;
}

export function ServiceCard({
  service,
  expanded = false,
  className,
}: ServiceCardProps) {
  return (
    <ScrollReveal as="article" id={service.slug} className="scroll-mt-28">
      <div
        className={cn(
          "hover:border-accent/40 group flex h-full flex-col gap-6 rounded-card border border-hairline-subtle bg-surface p-8 transition-colors duration-fast",
          className,
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-accent-subtle text-accent">
          <ServiceIcon
            name={service.icon}
            className="size-6"
            aria-hidden="true"
          />
        </div>

        <div className="grid gap-3">
          <h3 className="font-display text-heading-02 text-content-primary">
            {service.name}
          </h3>
          <p className="text-body-md text-content-secondary">
            {expanded ? service.description : service.summary}
          </p>
        </div>

        {expanded && (
          <ul className="mt-auto grid gap-2 border-t border-hairline-subtle pt-6">
            {service.deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-body-sm text-content-secondary"
              >
                <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        )}

        {!expanded && (
          <Link
            href={`/services#${service.slug}`}
            className="mt-auto inline-flex items-center gap-1.5 text-body-sm font-medium text-content-primary transition-colors duration-fast group-hover:text-accent"
          >
            Learn more
            <ArrowUpRight
              className="size-4 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </ScrollReveal>
  );
}
