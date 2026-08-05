import Link from "next/link";

import { cn } from "@/lib/utils";

export interface LumoraLogoProps {
  className?: string;
}

/** Lumora Skin wordmark — serif display face (Cormorant Garamond, the
 * brand's `--font-display`), gold accent on the mark, distinct from the
 * agency's all-caps sans wordmark. */
export function LumoraLogo({ className }: LumoraLogoProps) {
  return (
    <Link
      href="/lumora"
      className={cn(
        "text-heading-04 inline-flex items-center gap-1.5 font-display tracking-wide text-content-primary",
        className,
      )}
    >
      Lumora <span className="text-accent-text">Skin</span>
    </Link>
  );
}
