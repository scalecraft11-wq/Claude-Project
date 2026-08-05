"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { updateStoreSettingsAction } from "@/lib/admin/actions/settings";
import {
  storeSettingsSchema,
  type StoreSettingsInput,
} from "@/lib/validation/admin/settings";

export function SettingsForm({
  defaultValues,
}: {
  defaultValues: StoreSettingsInput;
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [savedMessage, setSavedMessage] = React.useState<string | null>(null);
  const form = useForm<StoreSettingsInput>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues,
  });

  const handleSubmit = async (values: StoreSettingsInput) => {
    setIsSubmitting(true);
    setSavedMessage(null);
    const result = await updateStoreSettingsAction(values);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof StoreSettingsInput, {
            message: messages[0],
          });
        }
      } else {
        form.setError("root", { message: result.message });
      }
      return;
    }

    setSavedMessage(result.message);
  };

  return (
    <Card className="max-w-2xl p-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          noValidate
          className="grid gap-5"
        >
          <FormField
            control={form.control}
            name="storeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Store name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supportEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Support email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency (ISO 4217)</FormLabel>
                  <FormControl>
                    <Input maxLength={3} className="uppercase" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone (IANA)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between rounded-sm border border-hairline-subtle px-4 py-3">
                  <div>
                    <FormLabel className="mb-0">Maintenance mode</FormLabel>
                    <p className="text-body-sm text-content-secondary">
                      Shows a maintenance page to storefront visitors.
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
          {savedMessage && (
            <p className="text-body-sm text-success">{savedMessage}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="justify-self-end"
          >
            Save settings
          </Button>
        </form>
      </Form>
    </Card>
  );
}
