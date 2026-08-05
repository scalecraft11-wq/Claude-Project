import {
  CouponsTable,
  type CouponRow,
} from "@/components/admin/coupons/coupons-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

function lifecycleStatusFor(
  active: boolean,
  expiresAt: Date | null,
): CouponRow["lifecycleStatus"] {
  if (expiresAt && expiresAt.getTime() < Date.now()) return "EXPIRED";
  if (!active) return "INACTIVE";
  return "ACTIVE";
}

export default async function AdminCouponsPage() {
  await requireRole("MANAGER");

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rows: CouponRow[] = coupons.map((coupon) => ({
    id: coupon.id,
    code: coupon.code,
    type: coupon.type,
    value: coupon.value,
    minOrderCents: coupon.minOrderCents,
    maxUses: coupon.maxUses,
    usedCount: coupon.usedCount,
    active: coupon.active,
    startsAt: coupon.startsAt?.toISOString() ?? null,
    expiresAt: coupon.expiresAt?.toISOString() ?? null,
    lifecycleStatus: lifecycleStatusFor(coupon.active, coupon.expiresAt),
  }));

  return (
    <div>
      <PageHeader
        title="Coupons"
        description={`${rows.length} coupon${rows.length === 1 ? "" : "s"}.`}
      />
      <CouponsTable coupons={rows} />
    </div>
  );
}
