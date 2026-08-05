"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { recordInventoryMovementAction } from "@/lib/admin/actions/inventory";
import {
  inventoryMovementSchema,
  type InventoryMovementInput,
} from "@/lib/validation/admin/inventory";

const EMPTY_VALUES: InventoryMovementInput = {
  type: "RESTOCK",
  quantity: 1,
  note: "",
};

export function AdjustStockButton({
  productId,
  productName,
  currentStock,
}: {
  productId: string;
  productName: string;
  currentStock: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<InventoryMovementInput>({
    resolver: zodResolver(inventoryMovementSchema),
    defaultValues: EMPTY_VALUES,
  });

  const handleSubmit = async (values: InventoryMovementInput) => {
    setIsSubmitting(true);
    const result = await recordInventoryMovementAction(productId, values);
    setIsSubmitting(false);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          form.setError(field as keyof InventoryMovementInput, {
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
      title={`Adjust stock — ${productName}`}
      description={`Currently ${currentStock} in stock.`}
      trigger={
        <Button type="button" variant="secondary" size="sm">
          Adjust stock
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
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Movement type</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="RESTOCK">Restock (add)</SelectItem>
                    <SelectItem value="RETURN">Return (add)</SelectItem>
                    <SelectItem value="ADJUSTMENT">Adjustment (+/-)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage>
                  For Restock/Return, enter a positive amount. For Adjustment, a
                  negative number decreases stock.
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note (optional)</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
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
            Save
          </Button>
        </form>
      </Form>
    </Modal>
  );
}
