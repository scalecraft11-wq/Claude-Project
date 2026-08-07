"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RatingStars } from "@/components/ui/RatingStars";
import { testimonials } from "@/lib/data/testimonials";

export function Testimonials() {
  return (
    <section className="border-y border-border-subtle bg-bg-elevated py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by athletes everywhere"
          align="center"
          className="mx-auto mb-14 items-center text-center"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className="flex flex-col gap-4 rounded-3xl border border-border-subtle bg-surface p-7 transition-colors hover:border-border-strong"
            >
              <Quote className="text-brand" size={26} strokeWidth={1.5} />
              <blockquote className="flex-1 text-[15px] leading-relaxed text-fg/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <RatingStars rating={t.rating} />
              <figcaption className="mt-1 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-2 text-xs font-bold text-black">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-fg">{t.name}</p>
                  <p className="text-xs text-fg-faint">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
