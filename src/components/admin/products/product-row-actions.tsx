"use client";

import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { ProductForm } from "@/components/admin/products/product-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import {
  deleteProductAction,
  updateProductAction,
} from "@/lib/admin/actions/products";
import type { ProductInput } from "@/lib/validation/admin/product";

export interface ProductRowActionsProps {
  productId: string;
  productName: string;
  defaultValues: ProductInput;
  categories: { id: string; name: string }[];
}

export function ProductRowActions({
  productId,
  productName,
  defaultValues,
  categories,
}: ProductRowActionsProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteProductAction(productId);
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
            aria-label={`Actions for ${productName}`}
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

      <Modal
        open={editOpen}
        onOpenChange={setEditOpen}
        title={`Edit ${productName}`}
        size="lg"
      >
        <ProductForm
          defaultValues={defaultValues}
          categories={categories}
          onSubmit={(values) => updateProductAction(productId, values)}
          onSuccess={() => setEditOpen(false)}
          submitLabel="Save changes"
        />
      </Modal>

      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${productName}?`}
        description="This permanently removes the product, its images, and its inventory history. Existing orders keep a snapshot of the product name and price."
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
