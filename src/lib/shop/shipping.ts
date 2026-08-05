import { prisma } from "@/lib/prisma";

export async function listActiveShippingMethods() {
  return prisma.shippingMethod.findMany({
    where: { active: true },
    orderBy: { rateCents: "asc" },
  });
}

export function shippingCostCents(
  method: { rateCents: number; freeThresholdCents: number | null },
  subtotalCents: number,
): number {
  if (
    method.freeThresholdCents !== null &&
    subtotalCents >= method.freeThresholdCents
  ) {
    return 0;
  }
  return method.rateCents;
}
