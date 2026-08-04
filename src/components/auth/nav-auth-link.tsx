"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Session-aware nav link — "Sign in" when logged out, "Dashboard" when
 * logged in. Renders nothing while the session is still resolving so
 * there's no visible flash between the two states.
 */
export function NavAuthLink({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <span
        className={cn("inline-block h-5 w-16", className)}
        aria-hidden="true"
      />
    );
  }

  const isAuthenticated = status === "authenticated";

  return (
    <Link
      href={isAuthenticated ? "/dashboard" : "/login"}
      onClick={onClick}
      className={cn(
        "text-body-sm font-medium text-content-secondary transition-colors duration-fast hover:text-content-primary",
        className,
      )}
    >
      {isAuthenticated ? "Dashboard" : "Sign in"}
    </Link>
  );
}
