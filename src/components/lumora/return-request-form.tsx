"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";

import { submitReturnRequestAction } from "@/lib/shop/actions/returns";

export interface ReturnableItem {
  id: string;
  nameSnapshot: string;
  quantity: number;
}

export function ReturnRequestForm({
  orderId,
  items,
}: {
  orderId: string;
  items: ReturnableItem[];
}) {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [reason, setReason] = React.useState("");
  const [isPending, startTransition] = React.useTransition();
  const [submitted, setSubmitted] = React.useState(false);

  if (submitted) {
    return (
      <p className="text-body-sm text-content-secondary">
        Your return request has been submitted and is being reviewed.
      </p>
    );
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await submitReturnRequestAction(orderId, {
            reason,
            items: items
              .filter((item) => selected.has(item.id))
              .map((item) => ({
                orderItemId: item.id,
                quantity: item.quantity,
              })),
          });
          if (result.success) {
            setSubmitted(true);
            toast.success(result.message);
          } else {
            toast.error(result.message);
          }
        });
      }}
    >
      <div className="grid gap-2">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-2">
            <Checkbox
              checked={selected.has(item.id)}
              onCheckedChange={() => toggle(item.id)}
            />
            <span className="text-body-sm">
              {item.nameSnapshot} (qty {item.quantity})
            </span>
          </label>
        ))}
      </div>
      <div>
        <Label htmlFor="return-reason">Reason for return</Label>
        <Textarea
          id="return-reason"
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        isLoading={isPending}
        disabled={selected.size === 0}
        className="justify-self-start"
      >
        Request Return
      </Button>
    </form>
  );
}
