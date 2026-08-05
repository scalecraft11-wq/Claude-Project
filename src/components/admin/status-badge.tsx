import { cn } from "@/lib/utils";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASSES: Record<StatusTone, string> = {
  success:
    "text-success border-success/30 bg-[color-mix(in_oklab,var(--color-success)_12%,transparent)]",
  warning:
    "text-warning border-warning/30 bg-[color-mix(in_oklab,var(--color-warning)_12%,transparent)]",
  danger:
    "text-danger border-danger/30 bg-[color-mix(in_oklab,var(--color-danger)_12%,transparent)]",
  info: "text-info border-info/30 bg-[color-mix(in_oklab,var(--color-info)_12%,transparent)]",
  neutral: "text-content-secondary border-hairline-strong bg-surface-raised",
};

/**
 * Every domain status enum (Order/Payment/Ticket/Coupon/Review/Content/
 * Product/Newsletter) maps here to one of five tones — added a new enum
 * value in the schema? add it to this map, don't invent a new component.
 */
const STATUS_TONE: Record<string, StatusTone> = {
  // Orders
  PENDING: "warning",
  PROCESSING: "info",
  SHIPPED: "info",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "neutral",
  // Payments
  PAID: "success",
  FAILED: "danger",
  // Products / content
  DRAFT: "neutral",
  ACTIVE: "success",
  PUBLISHED: "success",
  ARCHIVED: "neutral",
  // Reviews
  APPROVED: "success",
  REJECTED: "danger",
  // Newsletter
  SUBSCRIBED: "success",
  UNSUBSCRIBED: "neutral",
  // Support tickets
  OPEN: "info",
  IN_PROGRESS: "warning",
  RESOLVED: "success",
  CLOSED: "neutral",
  // Ticket priority
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "danger",
  // Derived inventory stock levels (not a DB enum — computed from stock vs.
  // lowStockThreshold on the Inventory page)
  IN_STOCK: "success",
  LOW_STOCK: "warning",
  OUT_OF_STOCK: "danger",
  // Derived SEO indexing state (not a DB enum — computed from SeoMeta.noIndex)
  INDEXED: "success",
  NO_INDEX: "danger",
  // Derived coupon/shipping-method lifecycle (not a DB enum — computed from
  // active/expiresAt on the Coupons and Shipping pages)
  INACTIVE: "neutral",
  EXPIRED: "danger",
};

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const tone = STATUS_TONE[status] ?? "neutral";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {toTitleCase(status)}
    </span>
  );
}
