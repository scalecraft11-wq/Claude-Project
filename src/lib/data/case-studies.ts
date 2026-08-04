export interface CaseStudy {
  slug: string;
  clientName: string;
  industry: string;
  title: string;
  summary: string;
  description: string;
  metric: { label: string; value: string };
  services: string[];
  year: string;
  featured?: boolean;
  /** Present only for the flagship — an internal route actually exists for it. */
  href?: string;
}

/**
 * Shared across Home, Portfolio, and Case Studies — one source of truth
 * so the flagship's numbers never drift between pages.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "lumora-skin",
    clientName: "Lumora Skin",
    industry: "Luxury Skincare",
    title: "A flagship skincare launch, built like a product, not a brochure",
    summary:
      "A full 3D commerce experience for a luxury skincare launch — cinematic product visualization, real Stripe checkout, and a CMS the client's own team runs without us.",
    description:
      "Lumora Skin needed a launch site that could stand next to Aesop and Chanel Beauty without flinching. We built a real-time 3D product viewer, a scroll-choreographed hero sequence, and a full commerce backend — then handed over a CMS their marketing team could run alone. It's the project we point to when a prospective client asks what 'premium' actually means in code.",
    metric: { label: "Conversion lift vs. previous site", value: "+340%" },
    services: [
      "Brand & Art Direction",
      "3D & Motion",
      "E-Commerce Engineering",
    ],
    year: "2026",
    featured: true,
    href: "/case-studies/lumora-skin",
  },
  {
    slug: "verdant-co",
    clientName: "Verdant & Co",
    industry: "Wellness",
    title: "Turning a supplement subscription into a members' club",
    summary:
      "A subscription-commerce rebuild that reframed a supplement brand as a members' club — replatformed checkout, a redesigned retention flywheel, and a 60% lift in second-order rate.",
    description:
      "Verdant & Co had healthy traffic and a leaking cart. We rebuilt the subscription flow around a members'-club framing — clearer plan comparison, transparent billing previews, and a redesigned first-30-days email sequence — without touching their existing fulfillment stack.",
    metric: { label: "Second-order rate", value: "+60%" },
    services: ["E-Commerce Engineering", "Lifecycle Design"],
    year: "2025",
  },
  {
    slug: "solstice-beauty",
    clientName: "Solstice Beauty",
    industry: "Cosmetics",
    title: "A shade-matching tool that cut returns in half",
    summary:
      "An interactive shade-finder and AR try-on integration for a color-cosmetics brand, reducing shade-mismatch returns by 48% in the first quarter.",
    description:
      "Color cosmetics live or die on shade accuracy online. We designed and built a guided shade-finder (skin-tone quiz plus AR try-on integration) that sits directly in the PDP, cutting the brand's single largest return reason by nearly half.",
    metric: { label: "Shade-mismatch returns", value: "-48%" },
    services: ["Product Design", "Front-End Engineering"],
    year: "2025",
  },
  {
    slug: "marchetti",
    clientName: "Marchetti",
    industry: "Fashion",
    title: "A lookbook that behaves like an editorial magazine",
    summary:
      "An editorial-first collection site for a contemporary fashion house — scroll-driven lookbook sequences, a custom CMS content-block system, and a 41% increase in average session time.",
    description:
      "Marchetti's collections deserved more than a product grid. We built a magazine-style content-block system (the same engine now powering our own case studies) so their team could publish lookbooks with real editorial pacing — pull quotes, full-bleed spreads, embedded video — without a developer in the loop.",
    metric: { label: "Average session time", value: "+41%" },
    services: ["Brand & Art Direction", "CMS Engineering"],
    year: "2024",
  },
  {
    slug: "aurelia",
    clientName: "Aurelia",
    industry: "Wellness",
    title: "A booking flow that finally matched the brand",
    summary:
      "A full brand and booking-flow redesign for a boutique wellness studio chain, unifying five studio locations under one reservation system.",
    description:
      "Aurelia ran five studio locations on three different booking tools. We unified them under one brand system and one reservation flow, cutting checkout steps from seven to three and giving the front-desk team a single dashboard instead of three logins.",
    metric: { label: "Booking completion rate", value: "+52%" },
    services: ["Brand Identity", "Product Design", "Front-End Engineering"],
    year: "2024",
  },
  {
    slug: "nordique",
    clientName: "Nordique",
    industry: "Skincare",
    title: "Proving a direct-to-consumer relaunch could outperform retail",
    summary:
      "A direct-to-consumer relaunch for a Scandinavian skincare brand exiting big-box retail, replacing a legacy Shopify theme with a fully custom build.",
    description:
      "Nordique was leaving retail behind and needed their DTC channel to carry the whole business. We replaced a heavily-customized legacy Shopify theme with a from-scratch build on the same stack we use for every client — same performance budget, same accessibility bar, same design-token discipline.",
    metric: { label: "DTC revenue, first 6 months", value: "+215%" },
    services: ["E-Commerce Engineering", "Performance Optimization"],
    year: "2023",
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
