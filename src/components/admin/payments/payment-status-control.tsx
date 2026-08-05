"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePaymentStatusAction } from "@/lib/admin/actions/payments";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

export function PaymentStatusControl({
  paymentId,
  status,
  editable,
}: {
  paymentId: string;
  status: string;
  editable: boolean;
}) {
  const [current, setCurrent] = React.useState(status);
  const [isSaving, setIsSaving] = React.useState(false);

  if (!editable) return null;

  return (
    <Select
      value={current}
      disabled={isSaving}
      onValueChange={async (value) => {
        const previous = current;
        setCurrent(value);
        setIsSaving(true);
        const result = await updatePaymentStatusAction(paymentId, {
          status: value as (typeof STATUS_OPTIONS)[number]["value"],
        });
        setIsSaving(false);
        if (!result.success) setCurrent(previous);
      }}
    >
      <SelectTrigger className="h-8 w-32 text-caption">
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
  );
}
