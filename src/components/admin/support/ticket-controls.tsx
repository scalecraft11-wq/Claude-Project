"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  assignTicketAction,
  updateTicketPriorityAction,
  updateTicketStatusAction,
} from "@/lib/admin/actions/support";

const STATUS_OPTIONS = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
] as const;

export function TicketControls({
  ticketId,
  status,
  priority,
  assignedToId,
  staff,
}: {
  ticketId: string;
  status: string;
  priority: string;
  assignedToId: string | null;
  staff: { id: string; name: string | null; email: string }[];
}) {
  const [currentStatus, setCurrentStatus] = React.useState(status);
  const [currentPriority, setCurrentPriority] = React.useState(priority);
  const [currentAssignee, setCurrentAssignee] = React.useState(
    assignedToId ?? "unassigned",
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="grid gap-1.5">
        <span className="text-overline text-content-muted">Status</span>
        <Select
          value={currentStatus}
          onValueChange={async (value) => {
            setCurrentStatus(value);
            await updateTicketStatusAction(ticketId, {
              status: value as (typeof STATUS_OPTIONS)[number]["value"],
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <span className="text-overline text-content-muted">Priority</span>
        <Select
          value={currentPriority}
          onValueChange={async (value) => {
            setCurrentPriority(value);
            await updateTicketPriorityAction(ticketId, {
              priority: value as (typeof PRIORITY_OPTIONS)[number]["value"],
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1.5">
        <span className="text-overline text-content-muted">Assigned to</span>
        <Select
          value={currentAssignee}
          onValueChange={async (value) => {
            setCurrentAssignee(value);
            await assignTicketAction(ticketId, {
              assignedToId: value === "unassigned" ? "" : value,
            });
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unassigned">Unassigned</SelectItem>
            {staff.map((member) => (
              <SelectItem key={member.id} value={member.id}>
                {member.name ?? member.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
