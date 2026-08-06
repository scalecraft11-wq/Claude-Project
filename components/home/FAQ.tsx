"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/lib/data/testimonials";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <Container className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          align="center"
          className="mx-auto mb-12 items-center text-center"
        />

        <div className="flex flex-col gap-3">
          {faqItems.map((item) => {
            const isOpen = open === item.id;
            return (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-border-subtle bg-surface"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-medium text-fg">{item.question}</span>
                  <Plus
                    size={18}
                    className={cn(
                      "shrink-0 text-fg-faint transition-transform duration-300",
                      isOpen && "rotate-45 text-brand"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <p className="px-6 pb-5 text-sm leading-relaxed text-fg-muted">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
