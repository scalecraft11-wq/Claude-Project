import type { FooterColumn } from "@/components/shared/footer";
import type { NavMenuItem } from "@/components/shared/mega-menu";

export const lumoraNav: NavMenuItem[] = [
  { label: "Collections", href: "/lumora/collections" },
  { label: "Search", href: "/lumora/search" },
  { label: "Wishlist", href: "/lumora/wishlist" },
];

export const lumoraFooterColumns: FooterColumn[] = [
  {
    heading: "Shop",
    links: [
      { label: "All collections", href: "/lumora/collections" },
      { label: "Wishlist", href: "/lumora/wishlist" },
      { label: "Track an order", href: "/lumora/account/orders" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Shipping & returns", href: "/lumora/account/orders" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "About",
    links: [{ label: "The Lumora Digital case study", href: "/case-studies" }],
  },
];
