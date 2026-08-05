"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { postTicketMessageAction } from "@/lib/admin/actions/support";
import {
  ticketMessageSchema,
  type TicketMessageInput,
} from "@/lib/validation/admin/support";

export function ReplyForm({ ticketId }: { ticketId: string }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const form = useForm<TicketMessageInput>({
    resolver: zodResolver(ticketMessageSchema),
    defaultValues: { body: "" },
  });

  const handleSubmit = async (values: TicketMessageInput) => {
    setIsSubmitting(true);
    const result = await postTicketMessageAction(ticketId, values);
    setIsSubmitting(false);

    if (!result.success) {
      form.setError("body", { message: result.message });
      return;
    }
    form.reset({ body: "" });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
        className="grid gap-3"
      >
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea rows={3} placeholder="Write a reply..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="justify-self-end"
        >
          <Send className="size-4" aria-hidden="true" />
          Send reply
        </Button>
      </form>
    </Form>
  );
}
