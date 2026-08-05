import {
  BarChart3,
  Boxes,
  CreditCard,
  FileText,
  FolderTree,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  LifeBuoy,
  Lock,
  Mail,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Star,
  Tag,
  Truck,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

import type { Role } from "../../generated/prisma/client";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  /** Hidden from the sidebar entirely below this role — a UX nicety
   * (ARCHITECTURE.md §17: "hides controls a role can't use"), never the
   * actual security boundary; every page re-checks this itself. */
  minRole: Role;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
        minRole: "EDITOR",
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
        minRole: "MANAGER",
      },
    ],
  },
  {
    label: "Catalog",
    items: [
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
        minRole: "EDITOR",
      },
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
        minRole: "EDITOR",
      },
      {
        label: "Inventory",
        href: "/admin/inventory",
        icon: Boxes,
        minRole: "MANAGER",
      },
      {
        label: "Reviews",
        href: "/admin/reviews",
        icon: Star,
        minRole: "EDITOR",
      },
    ],
  },
  {
    label: "Sales",
    items: [
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
        minRole: "MANAGER",
      },
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
        minRole: "MANAGER",
      },
      {
        label: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
        minRole: "MANAGER",
      },
      {
        label: "Coupons",
        href: "/admin/coupons",
        icon: Tag,
        minRole: "MANAGER",
      },
      {
        label: "Shipping",
        href: "/admin/shipping",
        icon: Truck,
        minRole: "MANAGER",
      },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog", href: "/admin/blog", icon: FileText, minRole: "EDITOR" },
      {
        label: "Media Library",
        href: "/admin/media",
        icon: ImageIcon,
        minRole: "EDITOR",
      },
      {
        label: "Newsletter",
        href: "/admin/newsletter",
        icon: Mail,
        minRole: "MANAGER",
      },
      {
        label: "SEO Manager",
        href: "/admin/seo",
        icon: Search,
        minRole: "EDITOR",
      },
    ],
  },
  {
    label: "Support",
    items: [
      {
        label: "Support Tickets",
        href: "/admin/support",
        icon: LifeBuoy,
        minRole: "MANAGER",
      },
      {
        label: "Activity Logs",
        href: "/admin/activity-logs",
        icon: History,
        minRole: "MANAGER",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Settings",
        href: "/admin/settings",
        icon: Settings,
        minRole: "ADMIN",
      },
      {
        label: "Roles",
        href: "/admin/roles",
        icon: ShieldCheck,
        minRole: "ADMIN",
      },
      {
        label: "Permissions",
        href: "/admin/permissions",
        icon: Lock,
        minRole: "ADMIN",
      },
    ],
  },
];
