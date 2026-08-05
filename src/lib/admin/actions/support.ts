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
  ticketAssignSchema,
  ticketMessageSchema,
  ticketPriorityUpdateSchema,
  ticketStatusUpdateSchema,
  type TicketAssignInput,
  type TicketMessageInput,
  type TicketPriorityUpdateInput,
  type TicketStatusUpdateInput,
} from "@/lib/validation/admin/support";

export async function updateTicketStatusAction(
  id: string,
  input: TicketStatusUpdateInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = ticketStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please choose a valid status." };
  }

  const existing = await prisma.supportTicket.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Ticket not found." };

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "support_ticket.status_update",
    entityType: "SupportTicket",
    entityId: ticket.id,
    metadata: {
      subject: ticket.subject,
      from: existing.status,
      to: ticket.status,
    },
  });

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  return { success: true, message: "Status updated." };
}

export async function updateTicketPriorityAction(
  id: string,
  input: TicketPriorityUpdateInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = ticketPriorityUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please choose a valid priority." };
  }

  const existing = await prisma.supportTicket.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Ticket not found." };

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: { priority: parsed.data.priority },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "support_ticket.priority_update",
    entityType: "SupportTicket",
    entityId: ticket.id,
    metadata: {
      subject: ticket.subject,
      from: existing.priority,
      to: ticket.priority,
    },
  });

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  return { success: true, message: "Priority updated." };
}

export async function assignTicketAction(
  id: string,
  input: TicketAssignInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = ticketAssignSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please choose a valid assignee." };
  }

  const existing = await prisma.supportTicket.findUnique({ where: { id } });
  if (!existing) return { success: false, message: "Ticket not found." };

  const ticket = await prisma.supportTicket.update({
    where: { id },
    data: { assignedToId: parsed.data.assignedToId || null },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "support_ticket.assign",
    entityType: "SupportTicket",
    entityId: ticket.id,
    metadata: { subject: ticket.subject, assignedToId: ticket.assignedToId },
  });

  revalidatePath("/admin/support");
  revalidatePath(`/admin/support/${id}`);
  return { success: true, message: "Assignee updated." };
}

export async function postTicketMessageAction(
  ticketId: string,
  input: TicketMessageInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = ticketMessageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }

  const ticket = await prisma.supportTicket.findUnique({
    where: { id: ticketId },
  });
  if (!ticket) return { success: false, message: "Ticket not found." };

  await prisma.$transaction([
    prisma.ticketMessage.create({
      data: {
        ticketId,
        authorId: session.user!.id,
        authorName: session.user!.name ?? session.user!.email ?? "Staff",
        isStaff: true,
        body: parsed.data.body,
      },
    }),
    prisma.supportTicket.update({
      where: { id: ticketId },
      data: {
        status: ticket.status === "OPEN" ? "IN_PROGRESS" : ticket.status,
      },
    }),
  ]);

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "support_ticket.reply",
    entityType: "SupportTicket",
    entityId: ticketId,
    metadata: { subject: ticket.subject },
  });

  revalidatePath(`/admin/support/${ticketId}`);
  return { success: true, message: "Reply sent." };
}
