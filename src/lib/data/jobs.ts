export interface JobOpening {
  slug: string;
  title: string;
  department: "Engineering" | "Design" | "Client Partnerships";
  location: string;
  type: "Full-time" | "Contract";
  summary: string;
}

export const jobOpenings: JobOpening[] = [
  {
    slug: "senior-three-fiber-engineer",
    title: "Senior React Three Fiber Engineer",
    department: "Engineering",
    location: "Remote (US/EU hours)",
    type: "Full-time",
    summary:
      "Own the 3D/motion layer across client builds — real-time product visualization, shader work, and a performance budget you're accountable for.",
  },
  {
    slug: "senior-product-designer",
    title: "Senior Product Designer",
    department: "Design",
    location: "Remote (US/EU hours)",
    type: "Full-time",
    summary:
      "Design the interaction flows that carry revenue — checkout, booking, account — with the same craft bar as our signature hero moments.",
  },
  {
    slug: "full-stack-engineer",
    title: "Full-Stack Engineer (Next.js/Prisma)",
    department: "Engineering",
    location: "Remote (US/EU hours)",
    type: "Full-time",
    summary:
      "Build the commerce and CMS backends behind our Flagship-tier engagements — Next.js, Prisma, PostgreSQL, Stripe.",
  },
  {
    slug: "client-partnerships-lead",
    title: "Client Partnerships Lead",
    department: "Client Partnerships",
    location: "Remote (US hours)",
    type: "Full-time",
    summary:
      "Run discovery, scoping, and the weekly cadence that keeps builds on schedule — the first and last voice a client hears from us.",
  },
  {
    slug: "motion-design-contractor",
    title: "Motion Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
    summary:
      "Storyboard and prototype scroll-driven sequences before engineering builds them — GSAP/Framer Motion fluency required.",
  },
];
