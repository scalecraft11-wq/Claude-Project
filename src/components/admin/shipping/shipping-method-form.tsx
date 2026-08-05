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
import {
  shippingMethodSchema,
  type ShippingMethodInput,
} from "@/lib/validation/admin/shipping";

export interface ShippingMethodFormProps {
  defaultValues: ShippingMethodInput;
  onSubmit: (values: ShippingMethodInput) => Promise<ActionResult>;
  onSuccess: () => void;
  submitLabel: string;
}

export function ShippingMethodForm({
  defaultValues,
  onSubmit,
  onSuccess,
  submitLabel,
}: ShippingMethodFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<ShippingMethodInput>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues,
  });

  const handleSubmit = async (values: ShippingMethodInput) => {
    setIsSubmitting(true);
    const result = await onSubmit(values);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof ShippingMethodInput, {
            message: messages[0],
          });
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="rateCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate (cents)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="freeThresholdCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Free above (cents, optional)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="estimatedDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated delivery</FormLabel>
                <FormControl>
                  <Input placeholder="3-5 business days" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between rounded-sm border border-hairline-subtle px-4 py-3">
                <FormLabel className="mb-0">Active</FormLabel>
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
