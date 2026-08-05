"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { CategoryForm } from "@/components/admin/categories/category-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { createCategoryAction } from "@/lib/admin/actions/categories";
import type { CategoryInput } from "@/lib/validation/admin/category";

const EMPTY_VALUES: CategoryInput = {
  name: "",
  slug: "",
  description: "",
  parentId: "",
};

export function AddCategoryButton({
  parentOptions,
}: {
  parentOptions: { id: string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add category"
      description="Create a new catalog category."
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add category
        </Button>
      }
    >
      <CategoryForm
        defaultValues={EMPTY_VALUES}
        parentOptions={parentOptions}
        onSubmit={createCategoryAction}
        onSuccess={() => setOpen(false)}
        submitLabel="Create category"
      />
    </Modal>
  );
}
