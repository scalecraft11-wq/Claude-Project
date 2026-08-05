"use client";

import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { CategoryForm } from "@/components/admin/categories/category-form";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/lib/admin/actions/categories";
import type { CategoryInput } from "@/lib/validation/admin/category";

export interface CategoryRowActionsProps {
  categoryId: string;
  categoryName: string;
  defaultValues: CategoryInput;
  parentOptions: { id: string; name: string }[];
}

export function CategoryRowActions({
  categoryId,
  categoryName,
  defaultValues,
  parentOptions,
}: CategoryRowActionsProps) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteCategoryAction(categoryId);
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
            aria-label={`Actions for ${categoryName}`}
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
        title={`Edit ${categoryName}`}
      >
        <CategoryForm
          defaultValues={defaultValues}
          parentOptions={parentOptions.filter(
            (option) => option.id !== categoryId,
          )}
          onSubmit={(values) => updateCategoryAction(categoryId, values)}
          onSuccess={() => setEditOpen(false)}
          submitLabel="Save changes"
        />
      </Modal>

      <Modal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${categoryName}?`}
        description="Its products become uncategorized and its subcategories become top-level. This can't be undone."
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
