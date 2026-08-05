"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { ShippingMethodForm } from "@/components/admin/shipping/shipping-method-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { createShippingMethodAction } from "@/lib/admin/actions/shipping";
import type { ShippingMethodInput } from "@/lib/validation/admin/shipping";

const EMPTY_VALUES: ShippingMethodInput = {
  name: "",
  description: "",
  rateCents: 0,
  freeThresholdCents: "",
  estimatedDays: "",
  active: true,
};

export function AddShippingMethodButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add shipping method"
      description="Create a new checkout shipping option."
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add method
        </Button>
      }
    >
      <ShippingMethodForm
        defaultValues={EMPTY_VALUES}
        onSubmit={createShippingMethodAction}
        onSuccess={() => setOpen(false)}
        submitLabel="Create method"
      />
    </Modal>
  );
}
