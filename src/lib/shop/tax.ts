import { prisma } from "@/lib/prisma";

export interface TaxableAddress {
  country: string;
  state?: string | null;
}

/** Flat per-region rate lookup — state-level rate first, then a
 * country-wide fallback row (`state: null`), then untaxed if neither
 * exists. See the TaxRate model's comment for the multi-jurisdiction
 * caveat. */
export async function calculateTaxCents(
  subtotalCents: number,
  address: TaxableAddress,
): Promise<number> {
  if (subtotalCents <= 0) return 0;

  const rate = await prisma.taxRate.findFirst({
    where: {
      active: true,
      country: address.country,
      OR: [{ state: address.state ?? undefined }, { state: null }],
    },
    orderBy: { state: { sort: "desc", nulls: "last" } },
  });

  if (!rate) return 0;
  return Math.round((subtotalCents * rate.rateBps) / 10_000);
}
