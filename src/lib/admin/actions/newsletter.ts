"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import {
  subscriberSchema,
  subscriberStatusUpdateSchema,
  type SubscriberInput,
  type SubscriberStatusUpdateInput,
} from "@/lib/validation/admin/newsletter";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function addSubscriberAction(
  input: SubscriberInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = subscriberSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  try {
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email: data.email, source: data.source || "admin" },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "newsletter.subscriber_add",
      entityType: "NewsletterSubscriber",
      entityId: subscriber.id,
      metadata: { email: subscriber.email },
    });

    revalidatePath("/admin/newsletter");
    return { success: true, message: "Subscriber added." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "That email is already subscribed." };
    }
    throw error;
  }
}

export async function updateSubscriberStatusAction(
  id: string,
  input: SubscriberStatusUpdateInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = subscriberStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please choose a valid status." };
  }

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  });
  if (!existing) {
    return { success: false, message: "Subscriber not found." };
  }

  const subscriber = await prisma.newsletterSubscriber.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "newsletter.status_update",
    entityType: "NewsletterSubscriber",
    entityId: subscriber.id,
    metadata: {
      email: subscriber.email,
      from: existing.status,
      to: subscriber.status,
    },
  });

  revalidatePath("/admin/newsletter");
  return { success: true, message: "Subscriber updated." };
}

export async function deleteSubscriberAction(
  id: string,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");

  const existing = await prisma.newsletterSubscriber.findUnique({
    where: { id },
  });
  if (!existing) {
    return { success: false, message: "Subscriber not found." };
  }

  await prisma.newsletterSubscriber.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "newsletter.subscriber_delete",
    entityType: "NewsletterSubscriber",
    entityId: id,
    metadata: { email: existing.email },
  });

  revalidatePath("/admin/newsletter");
  return { success: true, message: "Subscriber removed." };
}
