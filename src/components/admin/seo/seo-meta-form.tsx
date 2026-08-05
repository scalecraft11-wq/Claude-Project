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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { seoMetaSchema, type SeoMetaInput } from "@/lib/validation/admin/seo";

export interface SeoMetaFormProps {
  defaultValues: SeoMetaInput;
  onSubmit: (values: SeoMetaInput) => Promise<ActionResult>;
  onSuccess: () => void;
  submitLabel: string;
}

export function SeoMetaForm({
  defaultValues,
  onSubmit,
  onSuccess,
  submitLabel,
}: SeoMetaFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<SeoMetaInput>({
    resolver: zodResolver(seoMetaSchema),
    defaultValues,
  });

  const handleSubmit = async (values: SeoMetaInput) => {
    setIsSubmitting(true);
    const result = await onSubmit(values);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof SeoMetaInput, { message: messages[0] });
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
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Path</FormLabel>
              <FormControl>
                <Input placeholder="/about" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
              <FormLabel>Meta description</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ogImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>OG image URL (optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noIndex"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between rounded-sm border border-hairline-subtle px-4 py-3">
                <div>
                  <FormLabel className="mb-0">
                    Hide from search engines
                  </FormLabel>
                  <p className="text-body-sm text-content-secondary">
                    Adds a <code>noindex</code> directive for this path.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </div>
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
