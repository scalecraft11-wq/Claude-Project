"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import * as React from "react";

import { AdminCommandMenu } from "@/components/admin/admin-command-menu";
import { AdminSidebarNav } from "@/components/admin/admin-sidebar-nav";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { AgencyLogo } from "@/components/marketing/agency-logo";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import type { Role } from "../../../generated/prisma/client";

export interface AdminShellProps {
  role: Role;
  name: string | null;
  email: string;
  children: React.ReactNode;
}

/**
 * The persistent enterprise-admin shell — collapsible desktop rail,
 * slide-over drawer on mobile, sticky topbar (search, theme, account).
 * Every /admin/** page renders inside this via app/admin/layout.tsx.
 */
export function AdminShell({ role, name, email, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [commandOpen, setCommandOpen] = React.useState(false);

  return (
    <div className="flex min-h-svh bg-canvas">
      <aside
        className={cn(
          "sticky top-0 hidden h-svh shrink-0 flex-col border-r border-hairline-subtle transition-[width] duration-base lg:flex",
          collapsed ? "w-[76px]" : "w-64",
        )}
      >
        <div className="flex h-16 shrink-0 items-center overflow-hidden border-b border-hairline-subtle px-4">
          {collapsed ? (
            <span className="font-ui text-body-md font-semibold tracking-[0.12em] text-content-primary">
              LD
            </span>
          ) : (
            <AgencyLogo />
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <AdminSidebarNav role={role} collapsed={collapsed} />
        </div>
        <div className="border-t border-hairline-subtle p-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" aria-hidden="true" />
            ) : (
              <>
                <PanelLeftClose className="size-4" aria-hidden="true" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>

      <Drawer
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        side="left"
        title="Admin menu"
        showTitle={false}
        className="w-72"
      >
        <AdminSidebarNav
          role={role}
          onNavigate={() => setMobileNavOpen(false)}
        />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-canvas/95 sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-hairline-subtle px-4 backdrop-blur lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              type="button"
              variant="icon"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
              onClick={() => setMobileNavOpen(true)}
            >
              <Menu className="size-5" aria-hidden="true" />
            </Button>
            <button
              type="button"
              onClick={() => setCommandOpen(true)}
              className="flex items-center gap-2 rounded-sm border border-hairline-subtle px-3 py-2 text-body-sm text-content-muted transition-colors duration-fast hover:text-content-primary"
            >
              <Search className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Search sections...</span>
              <kbd className="hidden rounded-xs border border-hairline-subtle px-1.5 py-0.5 text-xs text-content-muted sm:ml-6 sm:inline">
                ⌘K
              </kbd>
            </button>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <AdminUserMenu name={name} email={email} role={role} />
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 lg:p-8">{children}</main>
      </div>

      <AdminCommandMenu
        role={role}
        open={commandOpen}
        onOpenChange={setCommandOpen}
      />
    </div>
  );
}
