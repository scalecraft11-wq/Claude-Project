export interface PricingPlan {
  slug: string;
  name: string;
  description: string;
  priceMonthly: string;
  priceProject: string;
  features: string[];
  featured?: boolean;
  cta: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    slug: "launch",
    name: "Launch",
    description:
      "For a brand-new site or a focused rebuild — one core experience, done properly.",
    priceMonthly: "$4,900/mo",
    priceProject: "From $28,000",
    features: [
      "Brand & design system foundation",
      "Up to 6 core page templates",
      "Framer Motion + GSAP interaction layer",
      "CMS for content updates",
      "Core Web Vitals performance budget",
      "4-week engagement window",
    ],
    cta: "Start a project",
  },
  {
    slug: "flagship",
    name: "Flagship",
    description:
      "Our full capability — 3D product visualization, full commerce, and a system built to scale with your team.",
    priceMonthly: "$9,800/mo",
    priceProject: "From $65,000",
    features: [
      "Everything in Launch",
      "Real-time 3D product visualization",
      "Full e-commerce build (Stripe, inventory, admin)",
      "Custom animation system (particles, scroll-scrubbed sequences)",
      "Dedicated engineering + design pod",
      "8–12 week engagement window",
    ],
    featured: true,
    cta: "Start a project",
  },
  {
    slug: "partner",
    name: "Partner",
    description:
      "An ongoing retainer for brands that ship continuously — new features, experiments, and content velocity tooling.",
    priceMonthly: "Custom",
    priceProject: "Retainer, from $12,000/mo",
    features: [
      "Everything in Flagship",
      "Dedicated monthly capacity block",
      "Quarterly roadmap and experiment backlog",
      "Priority response SLA",
      "Direct Slack channel with the team that built it",
    ],
    cta: "Talk to us",
  },
];
