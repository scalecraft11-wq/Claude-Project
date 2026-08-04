import Link from "next/link";

import { cn } from "@/lib/utils";

export interface AgencyLogoProps {
  className?: string;
}

/**
 * The Agency wordmark — DESIGN_SYSTEM.md §2.1: "Wordmark-only, custom-
 * tracked all-caps... no symbol/icon mark — the confidence move of a
 * studio that doesn't need a logo gimmick."
 */
export function AgencyLogo({ className }: AgencyLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center font-ui text-body-md font-semibold tracking-[0.12em] text-content-primary",
        className,
      )}
    >
      LUMORA DIGITAL
    </Link>
  );
}
