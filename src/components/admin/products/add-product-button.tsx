"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { ProductForm } from "@/components/admin/products/product-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { createProductAction } from "@/lib/admin/actions/products";
import type { ProductInput } from "@/lib/validation/admin/product";

const EMPTY_VALUES: ProductInput = {
  name: "",
  slug: "",
  description: "",
  sku: "",
  priceCents: 0,
  compareAtCents: "",
  costCents: "",
  status: "DRAFT",
  categoryId: "",
  stock: 0,
  lowStockThreshold: 10,
};

export function AddProductButton({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add product"
      description="Create a new catalog product."
      size="lg"
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add product
        </Button>
      }
    >
      <ProductForm
        defaultValues={EMPTY_VALUES}
        categories={categories}
        onSubmit={createProductAction}
        onSuccess={() => setOpen(false)}
        submitLabel="Create product"
      />
    </Modal>
  );
}
