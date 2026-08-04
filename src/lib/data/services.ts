export interface Service {
  slug: string;
  name: string;
  summary: string;
  description: string;
  deliverables: string[];
  /** Lucide icon name — resolved to a component at render time. */
  icon: "Sparkles" | "Boxes" | "ShoppingBag" | "PenTool" | "Gauge" | "Rocket";
}

export const services: Service[] = [
  {
    slug: "brand-and-art-direction",
    name: "Brand & Art Direction",
    summary:
      "A visual and verbal identity built for the medium it will actually live in — not a logo PDF handed to a developer.",
    description:
      "We design the full system — type, color, motion language, photography direction — as one connected decision, informed from day one by how it will actually render in a browser. Every brand we ship comes with a working token system, not just guidelines nobody follows.",
    deliverables: [
      "Brand identity & design tokens",
      "Art direction for photography and 3D",
      "Motion and interaction language",
      "A living design system, not a static PDF",
    ],
    icon: "PenTool",
  },
  {
    slug: "3d-and-motion",
    name: "3D & Motion",
    summary:
      "Real-time 3D product visualization and scroll-choreographed motion — built for production performance budgets, not a portfolio reel.",
    description:
      "We build real-time 3D scenes with React Three Fiber, tuned against an actual performance budget from day one — device-tier fallbacks, GPU-cost accounting, and a reduced-motion path for every signature moment. This isn't a showcase piece; it ships to production traffic.",
    deliverables: [
      "Real-time 3D product visualization",
      "Scroll-driven camera and narrative sequences",
      "Custom shader and particle systems",
      "Full device-tier and accessibility fallbacks",
    ],
    icon: "Boxes",
  },
  {
    slug: "e-commerce-engineering",
    name: "E-Commerce Engineering",
    summary:
      "Full-stack commerce builds — real checkout, real inventory, real admin tooling — on a stack your team can actually maintain.",
    description:
      "Next.js, Prisma, Postgres, Stripe. No page-builder lock-in, no theme marketplace dependency. We hand over a codebase your engineering team can read on day one, with the same CI/CD discipline we hold ourselves to.",
    deliverables: [
      "Custom storefront + checkout (Stripe)",
      "Admin console for content and orders",
      "CMS for non-technical content updates",
      "CI/CD, monitoring, and a documented handoff",
    ],
    icon: "ShoppingBag",
  },
  {
    slug: "product-design",
    name: "Product Design",
    summary:
      "Interaction design for the parts of the experience that have to actually work — checkout, booking, account flows.",
    description:
      "The signature hero moment gets the headlines; the checkout flow gets the revenue. We design both with the same rigor — research-backed flows, tested against real friction points, not just aesthetic polish.",
    deliverables: [
      "UX research and flow design",
      "High-fidelity, interaction-ready prototypes",
      "Usability testing and iteration",
      "Design-to-development handoff in the same token system",
    ],
    icon: "Sparkles",
  },
  {
    slug: "performance-optimization",
    name: "Performance Optimization",
    summary:
      "Lighthouse-95+ engineering for existing sites — the unglamorous work that actually moves conversion.",
    description:
      "Most performance audits produce a list nobody implements. We fix it ourselves — bundle splitting, image pipeline, font loading, third-party script auditing — against a Core Web Vitals budget we're accountable for in the contract.",
    deliverables: [
      "Full Core Web Vitals audit",
      "Bundle, image, and font pipeline optimization",
      "Ongoing Lighthouse CI gating",
      "Monthly performance reporting",
    ],
    icon: "Gauge",
  },
  {
    slug: "launch-and-growth",
    name: "Launch & Growth",
    summary:
      "Post-launch iteration — analytics, A/B testing, and content velocity tooling — so the site keeps improving after we ship it.",
    description:
      "A launch is a milestone, not a finish line. We stay on as a lean, ongoing partner — instrumented analytics, a prioritized experiment backlog, and content tooling your team actually enjoys using.",
    deliverables: [
      "Analytics and funnel instrumentation",
      "A/B testing framework",
      "Ongoing design and engineering retainer",
      "Quarterly roadmap reviews",
    ],
    icon: "Rocket",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
