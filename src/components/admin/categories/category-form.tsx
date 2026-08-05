"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import type { ActionResult } from "@/lib/admin/action-result";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  categorySchema,
  type CategoryInput,
} from "@/lib/validation/admin/category";

export interface CategoryFormProps {
  defaultValues: CategoryInput;
  parentOptions: { id: string; name: string }[];
  onSubmit: (values: CategoryInput) => Promise<ActionResult>;
  onSuccess: () => void;
  submitLabel: string;
}

export function CategoryForm({
  defaultValues,
  parentOptions,
  onSubmit,
  onSuccess,
  submitLabel,
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const handleSubmit = async (values: CategoryInput) => {
    setIsSubmitting(true);
    const result = await onSubmit(values);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof CategoryInput, { message: messages[0] });
        }
      } else {
        form.setError("root", { message: result.message });
      }
      return;
    }

    onSuccess();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
        className="grid gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent category</FormLabel>
              <Select
                value={field.value || "none"}
                onValueChange={(value) =>
                  field.onChange(value === "none" ? "" : value)
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No parent (top-level)</SelectItem>
                  {parentOptions.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p role="alert" className="text-body-sm text-danger">
            {form.formState.errors.root.message}
          </p>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="justify-self-end"
        >
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
