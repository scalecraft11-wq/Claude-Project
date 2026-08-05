"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { BlogPostForm } from "@/components/admin/blog/blog-post-form";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { createBlogPostAction } from "@/lib/admin/actions/blog";
import type { BlogPostInput } from "@/lib/validation/admin/blog";

const EMPTY_VALUES: BlogPostInput = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  status: "DRAFT",
  tags: "",
};

export function AddPostButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={setOpen}
      title="New post"
      description="Draft a new blog post."
      size="lg"
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          New post
        </Button>
      }
    >
      <BlogPostForm
        defaultValues={EMPTY_VALUES}
        onSubmit={createBlogPostAction}
        onSuccess={() => setOpen(false)}
        submitLabel="Create post"
      />
    </Modal>
  );
}
