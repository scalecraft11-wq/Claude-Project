"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

import { RoleBadge } from "@/components/auth/role-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Role } from "../../../generated/prisma/client";

export function AdminUserMenu({
  name,
  email,
  role,
}: {
  name: string | null;
  email: string;
  role: Role;
}) {
  const initial = (name ?? email).charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex size-9 items-center justify-center rounded-full bg-accent-subtle text-body-sm font-medium text-accent transition-opacity duration-fast hover:opacity-80"
          aria-label="Account menu"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="grid gap-1">
          <span className="text-body-sm font-medium text-content-primary">
            {name ?? email}
          </span>
          <span className="flex items-center gap-2">
            <RoleBadge role={role} />
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">My account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/">Back to site</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => signOut({ redirectTo: "/" })}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
