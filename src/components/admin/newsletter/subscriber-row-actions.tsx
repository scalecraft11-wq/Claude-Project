"use client";

import { MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteSubscriberAction,
  updateSubscriberStatusAction,
} from "@/lib/admin/actions/newsletter";

export function SubscriberRowActions({
  subscriberId,
  status,
}: {
  subscriberId: string;
  status: string;
}) {
  const [isBusy, setIsBusy] = React.useState(false);

  const toggleStatus = async () => {
    setIsBusy(true);
    await updateSubscriberStatusAction(subscriberId, {
      status: status === "SUBSCRIBED" ? "UNSUBSCRIBED" : "SUBSCRIBED",
    });
    setIsBusy(false);
  };

  const handleDelete = async () => {
    setIsBusy(true);
    await deleteSubscriberAction(subscriberId);
    setIsBusy(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label="Subscriber actions"
          disabled={isBusy}
        >
          <MoreHorizontal className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={toggleStatus}>
          {status === "SUBSCRIBED" ? "Unsubscribe" : "Resubscribe"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-danger" onSelect={handleDelete}>
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
