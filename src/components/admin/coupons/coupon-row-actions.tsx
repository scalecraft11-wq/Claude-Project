"use client";

import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { CouponForm } from "@/components/admin/coupons/coupon-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import {
  deleteCouponAction,
  updateCouponAction,
} from "@/lib/admin/actions/coupons";
import type { CouponInput } from "@/lib/validation/admin/coupon";

export function CouponRowActions({
  couponId,
  code,
  defaultValues,
}: {
  couponId: string;
  code: string;
  defaultValues: CouponInput;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCouponAction(couponId);
    setIsDeleting(false);
    if (!result.success) {
      setDeleteError(result.message);
      return;
    }
    setDeleteOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="icon"
            size="icon"
            aria-label={`Actions for ${code}`}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-danger"
            onSelect={(event) => {
              event.preventDefault();
              setDeleteError(null);
              setDeleteOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal open={editOpen} onOpenChange={setEditOpen} title={`Edit ${code}`}>
        <CouponForm
          defaultValues={defaultValues}
          onSubmit={(values) => updateCouponAction(couponId, values)}
          onSuccess={() => setEditOpen(false)}
          submitLabel="Save changes"
        />
      </Modal>

      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete "${code}"?`}
        description="Orders that already used this coupon keep their discount — only the coupon itself is removed."
        footer={
          <>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              className="bg-danger text-content-inverse hover:opacity-90"
              isLoading={isDeleting}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </>
        }
      >
        {deleteError && (
          <p role="alert" className="text-body-sm text-danger">
            {deleteError}
          </p>
        )}
      </Modal>
    </>
  );
}
