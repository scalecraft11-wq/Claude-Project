import { ShippingMethodsTable } from "@/components/admin/shipping/shipping-methods-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function AdminShippingPage() {
  await requireRole("MANAGER");

  const methods = await prisma.shippingMethod.findMany({
    orderBy: { rateCents: "asc" },
  });

  const rows = methods.map((method) => ({
    id: method.id,
    name: method.name,
    description: method.description,
    rateCents: method.rateCents,
    freeThresholdCents: method.freeThresholdCents,
    estimatedDays: method.estimatedDays,
    active: method.active,
  }));

  return (
    <div>
      <PageHeader
        title="Shipping"
        description={`${rows.length} shipping method${rows.length === 1 ? "" : "s"}.`}
      />
      <ShippingMethodsTable methods={rows} />
    </div>
  );
}
