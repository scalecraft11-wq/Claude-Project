import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the Velocity Shoes team.",
};

const info = [
  {
    icon: Mail,
    title: "Email",
    lines: ["support@velocityshoes.com", "press@velocityshoes.com"],
  },
  {
    icon: Phone,
    title: "Phone",
    lines: ["+1 (800) 555-0142", "Mon-Fri, 9am-6pm EST"],
  },
  {
    icon: MapPin,
    title: "Studio",
    lines: ["482 Velocity Ave", "Portland, OR 97209"],
  },
  {
    icon: Clock,
    title: "Support Hours",
    lines: ["Mon-Fri: 9am - 6pm", "Sat: 10am - 4pm"],
  },
];

export default function ContactPage() {
  return (
    <div className="py-16 lg:py-24">
      <Container>
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
            Get In Touch
          </span>
          <h1 className="mt-5 font-display text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
            We&rsquo;d love to hear from you
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-fg-muted">
            Questions about an order, a partnership idea, or just want to say
            hi? Our team typically responds within one business day.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {info.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="flex h-full flex-col gap-3 rounded-3xl border border-border-subtle bg-surface p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
                  <item.icon size={17} />
                </div>
                <h3 className="font-display text-sm font-bold uppercase tracking-wide">
                  {item.title}
                </h3>
                <div className="flex flex-col gap-0.5 text-sm text-fg-muted">
                  {item.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <div className="rounded-[2rem] border border-border-subtle bg-surface p-7 sm:p-10">
              <h2 className="mb-6 font-display text-2xl font-extrabold uppercase tracking-tight">
                Send us a message
              </h2>
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full min-h-[420px] overflow-hidden rounded-[2rem] border border-border-subtle bg-bg-elevated-2">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                  backgroundSize: "34px 34px",
                }}
              />
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[80px]" />
              <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-black shadow-[0_0_40px_-6px_var(--brand)]">
                  <MapPin size={22} />
                </span>
                <div className="rounded-xl border border-border-subtle bg-bg/80 px-4 py-2 text-center backdrop-blur">
                  <p className="text-sm font-semibold text-fg">Velocity Studio HQ</p>
                  <p className="text-xs text-fg-faint">482 Velocity Ave, Portland, OR</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
