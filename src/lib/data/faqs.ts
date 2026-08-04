export interface FaqCategory {
  category: string;
  slug: string;
  items: { question: string; answer: string }[];
}

export const faqCategories: FaqCategory[] = [
  {
    category: "Working with us",
    slug: "working-with-us",
    items: [
      {
        question: "What does a typical engagement look like?",
        answer:
          "Most engagements start with a two-week discovery sprint (brand/UX audit, technical scoping, a fixed-price proposal), followed by a design phase and a build phase run in parallel two-week iterations. You see working software every two weeks, not a single reveal at the end.",
      },
      {
        question:
          "Do you work with early-stage brands, or only established ones?",
        answer:
          "Both — our Launch tier is built specifically for a brand-new site or a focused rebuild on a tighter budget. The same design-token discipline and performance budget applies regardless of engagement size.",
      },
      {
        question: "Can our internal team maintain the site after launch?",
        answer:
          "Yes, and we design for it deliberately. Every project ships with a documented handoff, a CMS your non-technical team can use, and a codebase built on mainstream tooling (Next.js, Prisma, Tailwind) rather than a proprietary page builder.",
      },
      {
        question: "Do you offer ongoing support after launch?",
        answer:
          "Our Partner tier is exactly this — a monthly capacity block for new features, experiments, and content tooling, with a dedicated Slack channel to the team that actually built your site.",
      },
    ],
  },
  {
    category: "Process & timeline",
    slug: "process-and-timeline",
    items: [
      {
        question: "How long does a typical build take?",
        answer:
          "A Launch-tier site typically ships in 4 weeks. A Flagship build — full commerce, real-time 3D, a custom animation system — runs 8 to 12 weeks depending on scope. We give you a fixed timeline in the proposal, not a moving estimate.",
      },
      {
        question: "How involved do we need to be during the build?",
        answer:
          "We ask for a weekly 30-minute review call and same-day feedback on the two-week iteration cycle. Beyond that, we run the day-to-day — you're not expected to manage the project internally.",
      },
      {
        question: "What do you need from us to get started?",
        answer:
          "Brand assets if they exist (even incomplete ones), access to any existing analytics, and a point of contact who can make final calls on design/content decisions. We handle the rest, including writing placeholder copy for review if you don't have final copy yet.",
      },
    ],
  },
  {
    category: "Technical",
    slug: "technical",
    items: [
      {
        question: "What's your tech stack, and can we bring our own?",
        answer:
          "Next.js, React, TypeScript, Tailwind, Prisma, and PostgreSQL by default — chosen for hiring pool size and long-term maintainability, not novelty. We're open to working within an existing stack if you already have significant infrastructure investment.",
      },
      {
        question: "How do you handle performance and accessibility?",
        answer:
          "Both are budgeted line items in the proposal, not an afterthought. We gate every build against a Lighthouse CI threshold and a WCAG 2.1 AA checklist before it ships — see our Design System and Animation Blueprint for the specifics.",
      },
      {
        question: "Do you build the 3D/animation work in-house?",
        answer:
          "Yes — our 3D and motion team works in React Three Fiber and GSAP directly, with a device-tier fallback strategy for every signature moment so performance never depends on the visitor's hardware.",
      },
    ],
  },
  {
    category: "Pricing",
    slug: "pricing",
    items: [
      {
        question: "Why is pricing given as a range instead of a fixed quote?",
        answer:
          "Every proposal is fixed-price once we've scoped it — the ranges on our pricing page reflect the spread across past engagements of similar size, not ambiguity in what you'll actually be billed.",
      },
      {
        question: "Do you require a deposit?",
        answer:
          "Yes, a 30% deposit to begin discovery, with the remainder split across project milestones (not a single payment on delivery) so risk is shared fairly across the engagement.",
      },
    ],
  },
  {
    category: "Privacy & cookies",
    slug: "privacy-and-cookies",
    items: [
      {
        question: "What cookies does this site use?",
        answer:
          "Only what's needed to remember your cookie choice and, if accepted, basic anonymized analytics to understand which pages are useful. No third-party ad-tracking cookies, ever.",
      },
      {
        question: "How do you handle client and prospect data?",
        answer:
          "Contact form submissions and project details are used solely to respond to your inquiry and, if you become a client, to deliver the engagement. We don't sell or share it with third parties.",
      },
      {
        question: "Can I request my data be deleted?",
        answer:
          "Yes — email hello@lumoradigital.studio and we'll remove any personal data we hold about you within 30 days, outside of records we're legally required to retain.",
      },
    ],
  },
];
