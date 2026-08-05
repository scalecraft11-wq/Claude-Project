export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  authorRole: string;
  publishedAt: string;
  readingTimeMinutes: number;
}

export const blogCategories = [
  "All",
  "Craft",
  "Engineering",
  "Motion",
  "Studio",
] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: "building-lumora-skins-3d-hero",
    title: "Building Lumora Skin's 3D hero, end to end",
    excerpt:
      "How we modeled a luxury serum bottle with zero external assets, built a scroll-controlled camera rig, and kept it inside a Lighthouse-95 budget.",
    category: "Engineering",
    authorName: "Dana Ferro",
    authorRole: "Principal Engineer",
    publishedAt: "2026-06-18",
    readingTimeMinutes: 9,
  },
  {
    slug: "the-restraint-principle",
    title:
      "The restraint principle: why we cut nine effects for every one we keep",
    excerpt:
      "A working design system needs a rule for what doesn't ship, not just what does. Here's the one we actually use.",
    category: "Craft",
    authorName: "Sam Okonkwo",
    authorRole: "Creative Director",
    publishedAt: "2026-05-02",
    readingTimeMinutes: 6,
  },
  {
    slug: "gsap-lenis-framer-motion-division-of-labor",
    title:
      "GSAP, Lenis, and Framer Motion: a division of labor that actually holds",
    excerpt:
      "Three animation libraries, one motion system. The rule that keeps them from fighting over the same element.",
    category: "Motion",
    authorName: "Priya Chandran",
    authorRole: "Senior Front-End Engineer",
    publishedAt: "2026-04-11",
    readingTimeMinutes: 8,
  },
  {
    slug: "what-premium-actually-means-in-code",
    title: 'What "premium" actually means in code, not just in Figma',
    excerpt:
      "Premium isn't a font pairing. It's a frame budget, a reduced-motion fallback, and a checkout flow that never makes you guess.",
    category: "Studio",
    authorName: "Dana Ferro",
    authorRole: "Principal Engineer",
    publishedAt: "2026-03-22",
    readingTimeMinutes: 7,
  },
  {
    slug: "designing-for-a-brand-that-doesnt-exist-yet",
    title: "Designing for a brand that doesn't exist yet",
    excerpt:
      "How we use a fictional flagship client to prototype techniques before they ever touch a real client's production site.",
    category: "Studio",
    authorName: "Sam Okonkwo",
    authorRole: "Creative Director",
    publishedAt: "2026-02-14",
    readingTimeMinutes: 5,
  },
  {
    slug: "the-case-for-procedural-3d-assets",
    title: "The case for procedural 3D assets over stock models",
    excerpt:
      "Why we modeled a bottle from primitives instead of buying one — and when buying one is actually the right call.",
    category: "Engineering",
    authorName: "Priya Chandran",
    authorRole: "Senior Front-End Engineer",
    publishedAt: "2026-01-09",
    readingTimeMinutes: 6,
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
