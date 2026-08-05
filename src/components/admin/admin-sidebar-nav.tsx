"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ADMIN_NAV } from "@/config/admin-nav";
import { hasMinimumRole } from "@/lib/auth/rbac";
import { cn } from "@/lib/utils";
import type { Role } from "../../../generated/prisma/client";

export interface AdminSidebarNavProps {
  role: Role;
  collapsed?: boolean;
  onNavigate?: () => void;
}

/** The nav content itself — shared between the persistent desktop rail
 * and the mobile slide-over drawer, so the two never drift apart. */
export function AdminSidebarNav({
  role,
  collapsed,
  onNavigate,
}: AdminSidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Admin" className="grid gap-6">
      {ADMIN_NAV.map((group) => {
        const items = group.items.filter((item) =>
          hasMinimumRole(role, item.minRole),
        );
        if (items.length === 0) return null;

        return (
          <div key={group.label} className="grid gap-1">
            {!collapsed && (
              <p className="px-3 pb-1 text-overline text-content-muted">
                {group.label}
              </p>
            )}
            {items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-3 py-2 text-body-sm font-medium transition-colors duration-fast",
                    isActive
                      ? "bg-accent-subtle text-accent"
                      : "text-content-secondary hover:bg-surface-raised hover:text-content-primary",
                  )}
                >
                  <item.icon
                    className="size-[18px] shrink-0"
                    aria-hidden="true"
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
