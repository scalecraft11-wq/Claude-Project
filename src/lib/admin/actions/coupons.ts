"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { couponSchema, type CouponInput } from "@/lib/validation/admin/coupon";

function toOptionalNumber(value: number | "" | undefined): number | undefined {
  return value === "" || value === undefined ? undefined : value;
}

function toOptionalDate(value: string | undefined): Date | undefined {
  return value ? new Date(value) : undefined;
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function createCouponAction(
  input: CouponInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  try {
    const coupon = await prisma.coupon.create({
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrderCents: toOptionalNumber(data.minOrderCents),
        maxUses: toOptionalNumber(data.maxUses),
        active: data.active,
        startsAt: toOptionalDate(data.startsAt),
        expiresAt: toOptionalDate(data.expiresAt),
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "coupon.create",
      entityType: "Coupon",
      entityId: coupon.id,
      metadata: { code: coupon.code },
    });

    revalidatePath("/admin/coupons");
    return { success: true, message: "Coupon created." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "That coupon code already exists." };
    }
    throw error;
  }
}

export async function updateCouponAction(
  id: string,
  input: CouponInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Coupon not found." };
  }

  try {
    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: data.code,
        type: data.type,
        value: data.value,
        minOrderCents: toOptionalNumber(data.minOrderCents),
        maxUses: toOptionalNumber(data.maxUses),
        active: data.active,
        startsAt: toOptionalDate(data.startsAt),
        expiresAt: toOptionalDate(data.expiresAt),
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "coupon.update",
      entityType: "Coupon",
      entityId: coupon.id,
      metadata: { code: coupon.code },
    });

    revalidatePath("/admin/coupons");
    return { success: true, message: "Coupon updated." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "That coupon code already exists." };
    }
    throw error;
  }
}

export async function deleteCouponAction(id: string): Promise<ActionResult> {
  const session = await requireRole("MANAGER");

  const existing = await prisma.coupon.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Coupon not found." };
  }

  await prisma.coupon.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "coupon.delete",
    entityType: "Coupon",
    entityId: id,
    metadata: { code: existing.code },
  });

  revalidatePath("/admin/coupons");
  return { success: true, message: "Coupon deleted." };
}
