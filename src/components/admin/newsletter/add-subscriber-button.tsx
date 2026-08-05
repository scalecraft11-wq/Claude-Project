"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

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
import { Modal } from "@/components/ui/modal";
import { addSubscriberAction } from "@/lib/admin/actions/newsletter";
import {
  subscriberSchema,
  type SubscriberInput,
} from "@/lib/validation/admin/newsletter";

const EMPTY_VALUES: SubscriberInput = { email: "", source: "" };

export function AddSubscriberButton() {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<SubscriberInput>({
    resolver: zodResolver(subscriberSchema),
    defaultValues: EMPTY_VALUES,
  });

  const handleSubmit = async (values: SubscriberInput) => {
    setIsSubmitting(true);
    const result = await addSubscriberAction(values);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof SubscriberInput, {
            message: messages[0],
          });
        }
      } else {
        form.setError("root", { message: result.message });
      }
      return;
    }

    form.reset(EMPTY_VALUES);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset(EMPTY_VALUES);
      }}
      title="Add subscriber"
      description="Manually add a subscriber to the newsletter list."
      trigger={
        <Button type="button" variant="primary" size="sm">
          <Plus className="size-4" aria-hidden="true" />
          Add subscriber
        </Button>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          className="grid gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="admin" {...field} />
                </FormControl>
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
            Add subscriber
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
