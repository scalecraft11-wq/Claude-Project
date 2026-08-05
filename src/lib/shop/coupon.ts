import { prisma } from "@/lib/prisma";
import type { Coupon } from "../../../generated/prisma/client";

export type CouponValidationResult =
  | { valid: true; coupon: Coupon; discountCents: number }
  | { valid: false; message: string };

/** Validates a coupon code against every rule the model encodes (active,
 * date window, usage cap, minimum order) and computes the discount for
 * this specific subtotal — checkout and any future "apply coupon"
 * preview both call this so the rules can never drift between the two. */
export async function validateCoupon(
  code: string,
  subtotalCents: number,
): Promise<CouponValidationResult> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.active) {
    return { valid: false, message: "That coupon code isn't valid." };
  }

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) {
    return { valid: false, message: "That coupon isn't active yet." };
  }
  if (coupon.expiresAt && now > coupon.expiresAt) {
    return { valid: false, message: "That coupon has expired." };
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return {
      valid: false,
      message: "That coupon has reached its usage limit.",
    };
  }
  if (coupon.minOrderCents !== null && subtotalCents < coupon.minOrderCents) {
    return {
      valid: false,
      message: `This coupon requires a minimum order of ${(coupon.minOrderCents / 100).toFixed(2)}.`,
    };
  }

  const discountCents =
    coupon.type === "PERCENTAGE"
      ? Math.round((subtotalCents * coupon.value) / 100)
      : Math.min(coupon.value, subtotalCents);

  return { valid: true, coupon, discountCents };
}
