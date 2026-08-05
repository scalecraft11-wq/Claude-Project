"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { CouponForm } from "@/components/admin/coupons/coupon-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { createCouponAction } from "@/lib/admin/actions/coupons";
import type { CouponInput } from "@/lib/validation/admin/coupon";

const EMPTY_VALUES: CouponInput = {
  code: "",
  type: "PERCENTAGE",
  value: 10,
  minOrderCents: "",
  maxUses: "",
  active: true,
  startsAt: "",
  expiresAt: "",
};

export function AddCouponButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add coupon"
      description="Create a new discount code."
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add coupon
        </Button>
      }
    >
      <CouponForm
        defaultValues={EMPTY_VALUES}
        onSubmit={createCouponAction}
        onSuccess={() => setOpen(false)}
        submitLabel="Create coupon"
      />
    </Modal>
  );
}
