"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ADMIN_NAV } from "@/config/admin-nav";
import { hasMinimumRole } from "@/lib/auth/rbac";
import type { Role } from "../../../generated/prisma/client";

export interface AdminCommandMenuProps {
  role: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * ⌘K launcher over every admin section this role can reach — the
 * dashboard's "Search" surface at the navigation level (per-table search
 * for entities like orders/customers lives on each list page itself).
 * Controlled by the parent shell so both the ⌘K shortcut and the visible
 * topbar search button open the exact same dialog instance.
 */
export function AdminCommandMenu({
  role,
  open,
  onOpenChange,
}: AdminCommandMenuProps) {
  const router = useRouter();

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const goTo = (href: string) => {
    onOpenChange(false);
    router.push(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Jump to a section..." />
      <CommandList>
        <CommandEmpty>No matching section.</CommandEmpty>
        {ADMIN_NAV.map((group) => {
          const items = group.items.filter((item) =>
            hasMinimumRole(role, item.minRole),
          );
          if (items.length === 0) return null;
          return (
            <CommandGroup key={group.label} heading={group.label}>
              {items.map((item) => (
                <CommandItem key={item.href} onSelect={() => goTo(item.href)}>
                  <item.icon
                    className="size-4 text-content-muted"
                    aria-hidden="true"
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
