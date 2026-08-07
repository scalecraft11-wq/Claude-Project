import type { Metadata } from "next";
import { Compass, Leaf, Sparkles, Users } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { SneakerArt } from "@/components/ui/SneakerArt";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Velocity Shoes — our story, our craft, and our mission to help you move beyond limits.",
};

const values = [
  {
    icon: Sparkles,
    title: "Relentless Innovation",
    description:
      "Every silhouette starts as a question: how do we make this faster, lighter, better? We test obsessively before anything ships.",
  },
  {
    icon: Compass,
    title: "Uncompromising Craft",
    description:
      "From premium materials to precision stitching, every pair is held to a standard that respects the athlete wearing it.",
  },
  {
    icon: Leaf,
    title: "Conscious Production",
    description:
      "We're reducing waste across our supply chain and investing in recycled materials without ever compromising performance.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Velocity is built with input from the runners, ballers, and everyday movers who put our shoes through the real world.",
  },
];

const process = [
  {
    step: "01",
    title: "Design",
    description: "Our team sketches hundreds of concepts before a single prototype is built.",
  },
  {
    step: "02",
    title: "Prototype",
    description: "Rapid 3D prototyping lets us test fit, flex, and feel in days, not months.",
  },
  {
    step: "03",
    title: "Test",
    description: "Athletes put every silhouette through thousands of miles of real-world wear.",
  },
  {
    step: "04",
    title: "Produce",
    description: "Small-batch production keeps quality control tight from cutting to box.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-brand/25 blur-[140px]" />
        </div>
        <Container className="relative">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border-subtle bg-black/[0.03] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand-2">
              Our Story
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-7xl">
              Built for those who
              <span className="text-gradient"> refuse to stand still</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-fg-muted sm:text-lg">
              Velocity Shoes was founded on a simple belief: performance
              footwear shouldn&rsquo;t force a choice between speed, comfort,
              and style. We engineer all three, every time.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
              Since 2018
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl">
              From a garage prototype to a global movement
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-fg-muted">
              <p>
                Velocity started in a small studio with one goal: build a
                racing shoe fast enough for competition and comfortable
                enough for everyday miles. Our founders — a former track
                athlete and a footwear engineer — spent two years and over
                200 prototypes chasing that balance.
              </p>
              <p>
                Today, Velocity Shoes is worn by athletes and everyday
                movers in more than 30 countries. But the mission hasn&rsquo;t
                changed: engineer footwear that helps you move beyond your
                limits, whatever that means for you.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-border-subtle pt-8">
              {[
                ["2018", "Founded"],
                ["30+", "Countries"],
                ["1.2M", "Pairs Sold"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-extrabold">{stat}</p>
                  <p className="mt-1 text-xs text-fg-faint">{label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-border-subtle bg-gradient-to-br from-bg-elevated-2 to-bg-elevated p-14">
              <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-brand/30 blur-[100px]" />
              <div className="absolute -bottom-10 -right-10 h-56 w-56 rounded-full bg-brand-3/25 blur-[100px]" />
              <SneakerArt
                art={{ upper: "#181818", sole: "#cb9328", accent: "#d1373c", laces: "#f4f4f0" }}
                className="relative"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-y border-border-subtle bg-bg-elevated py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="What We Stand For"
            title="Our values in motion"
            align="center"
            className="mx-auto mb-14 items-center text-center"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal key={value.title} delay={i * 0.08}>
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-border-subtle bg-surface p-7 transition-colors hover:border-border-strong">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/18 text-brand-2">
                    <value.icon size={20} />
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-fg">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-fg-muted">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Our Process" title="From sketch to stride" className="mb-14" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {process.map((item, i) => (
              <Reveal key={item.step} delay={i * 0.08} className="relative">
                <span className="font-display text-5xl font-extrabold text-black/[0.06]">
                  {item.step}
                </span>
                <h3 className="-mt-3 font-display text-xl font-bold tracking-tight text-fg">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-20 lg:pb-28">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-border-subtle bg-gradient-to-br from-bg-elevated-2 via-surface to-bg-elevated-2 px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/32 blur-[120px]" />
            <h2 className="relative font-display text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl">
              Ready to move beyond limits?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-fg-muted">
              Explore the full collection and find your next pair.
            </p>
            <ButtonLink href="/shop" size="lg" className="relative mt-8">
              Shop The Collection
            </ButtonLink>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
