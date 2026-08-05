"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { useBrand } from "@/contexts/brand-context";
import { cn } from "@/lib/utils";

/**
 * Session-aware nav link — "Sign in" when logged out, "Dashboard"/"Account"
 * when logged in. Renders nothing while the session is still resolving so
 * there's no visible flash between the two states. Destination branches on
 * the active brand — a Lumora Skin shopper belongs at their own account
 * page, not the agency's lead-pipeline dashboard.
 */
export function NavAuthLink({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  const { status } = useSession();
  const brand = useBrand();

  if (status === "loading") {
    return (
      <span
        className={cn("inline-block h-5 w-16", className)}
        aria-hidden="true"
      />
    );
  }

  const isAuthenticated = status === "authenticated";
  const authenticatedHref =
    brand === "lumora" ? "/lumora/account" : "/dashboard";

  return (
    <Link
      href={isAuthenticated ? authenticatedHref : "/login"}
      onClick={onClick}
      className={cn(
        "text-body-sm font-medium text-content-secondary transition-colors duration-fast hover:text-content-primary",
        className,
      )}
    >
      {isAuthenticated
        ? brand === "lumora"
          ? "Account"
          : "Dashboard"
        : "Sign in"}
    </Link>
  );
}
