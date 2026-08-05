"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { SeoMetaForm } from "@/components/admin/seo/seo-meta-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { createSeoMetaAction } from "@/lib/admin/actions/seo";
import type { SeoMetaInput } from "@/lib/validation/admin/seo";

const EMPTY_VALUES: SeoMetaInput = {
  path: "",
  title: "",
  description: "",
  ogImage: "",
  noIndex: false,
};

export function AddSeoButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="Add SEO entry"
      description="Set the title/description search engines and social previews use for a route."
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add entry
        </Button>
      }
    >
      <SeoMetaForm
        defaultValues={EMPTY_VALUES}
        onSubmit={createSeoMetaAction}
        onSuccess={() => setOpen(false)}
        submitLabel="Create entry"
      />
    </Modal>
  );
}
