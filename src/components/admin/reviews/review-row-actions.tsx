"use client";

import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import {
  deleteReviewAction,
  updateReviewStatusAction,
} from "@/lib/admin/actions/reviews";

export function ReviewRowActions({
  reviewId,
  status,
}: {
  reviewId: string;
  status: string;
}) {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const setStatus = async (nextStatus: "PENDING" | "APPROVED" | "REJECTED") => {
    setIsUpdating(true);
    setError(null);
    const result = await updateReviewStatusAction(reviewId, {
      status: nextStatus,
    });
    setIsUpdating(false);
    if (!result.success) setError(result.message);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteReviewAction(reviewId);
    setIsDeleting(false);
    if (!result.success) {
      setError(result.message);
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
            aria-label="Review actions"
            disabled={isUpdating}
          >
            <MoreHorizontal className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status !== "APPROVED" && (
            <DropdownMenuItem onSelect={() => setStatus("APPROVED")}>
              Approve
            </DropdownMenuItem>
          )}
          {status !== "REJECTED" && (
            <DropdownMenuItem onSelect={() => setStatus("REJECTED")}>
              Reject
            </DropdownMenuItem>
          )}
          {status !== "PENDING" && (
            <DropdownMenuItem onSelect={() => setStatus("PENDING")}>
              Mark pending
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-danger"
            onSelect={(event) => {
              event.preventDefault();
              setError(null);
              setDeleteOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this review?"
        description="This can't be undone."
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
        {error && (
          <p role="alert" className="text-body-sm text-danger">
            {error}
          </p>
        )}
      </Modal>
    </>
  );
}
