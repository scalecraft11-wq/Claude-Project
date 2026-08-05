"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatusAction } from "@/lib/admin/actions/orders";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PROCESSING", label: "Processing" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
] as const;

export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [current, setCurrent] = React.useState(status);
  const [isSaving, setIsSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{
    tone: "success" | "danger";
    text: string;
  } | null>(null);

  const handleChange = async (value: string) => {
    const previous = current;
    setCurrent(value);
    setIsSaving(true);
    setMessage(null);

    const result = await updateOrderStatusAction(orderId, {
      status: value as (typeof STATUS_OPTIONS)[number]["value"],
    });

    setIsSaving(false);
    if (!result.success) {
      setCurrent(previous);
      setMessage({ tone: "danger", text: result.message });
      return;
    }
    setMessage({ tone: "success", text: "Status updated." });
  };

  return (
    <div className="grid gap-1.5">
      <Select value={current} onValueChange={handleChange} disabled={isSaving}>
        <SelectTrigger className="w-48">
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
      {message && (
        <p
          role="status"
          className={`text-body-sm ${message.tone === "success" ? "text-success" : "text-danger"}`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
