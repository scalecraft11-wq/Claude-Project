import { cn } from "@/lib/utils";
import type { Role } from "../../../generated/prisma/client";

const ROLE_STYLES: Record<Role, string> = {
  ADMIN: "bg-accent-subtle text-accent border-accent/40",
  MANAGER: "bg-surface-raised text-content-primary border-hairline-strong",
  EDITOR: "bg-surface-raised text-content-secondary border-hairline-subtle",
  CUSTOMER: "bg-surface-raised text-content-secondary border-hairline-subtle",
};

export function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-overline",
        ROLE_STYLES[role],
      )}
    >
      {role}
    </span>
  );
}
