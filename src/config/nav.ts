import type { FooterColumn } from "@/components/shared/footer";
import type { NavMenuItem } from "@/components/shared/mega-menu";

import { services } from "@/lib/data/services";

export const primaryNav: NavMenuItem[] = [
  {
    label: "Work",
    columns: [
      {
        heading: "Explore",
        links: [
          {
            label: "Portfolio",
            href: "/work",
            description: "Every project, at a glance.",
          },
          {
            label: "Case Studies",
            href: "/case-studies",
            description: "The results behind the work.",
          },
        ],
      },
    ],
    featured: {
      title: "Lumora Skin",
      description: "Our flagship 3D commerce build — start here.",
      href: "/case-studies/lumora-skin",
    },
  },
  {
    label: "Services",
    columns: [
      {
        heading: "What we do",
        links: services.slice(0, 3).map((service) => ({
          label: service.name,
          href: `/services#${service.slug}`,
          description: service.summary,
        })),
      },
      {
        links: services.slice(3).map((service) => ({
          label: service.name,
          href: `/services#${service.slug}`,
          description: service.summary,
        })),
      },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const footerColumns: FooterColumn[] = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Portfolio", href: "/work" },
      { label: "Case Studies", href: "/case-studies" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
];
