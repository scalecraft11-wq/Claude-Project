"use client";

import { Plus } from "lucide-react";
import * as React from "react";

import { toast } from "@/components/ui/toaster";
import { addToCartAction } from "@/lib/shop/actions/cart";
import { cn } from "@/lib/utils";

export function QuickAddButton({
  productId,
  productName,
  className,
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const [isPending, startTransition] = React.useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      aria-label={`Quick add ${productName} to bag`}
      onClick={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await addToCartAction(productId, 1);
          if (result.success) {
            toast.success(`Added ${productName} to your bag.`);
          } else {
            toast.error(result.message);
          }
        });
      }}
      className={cn(
        "absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-button-primary text-button-primary-foreground",
        "scale-90 opacity-0 transition-all duration-fast ease-standard disabled:pointer-events-none disabled:opacity-60",
        "group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100",
        "focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-none",
        className,
      )}
    >
      <Plus className="size-5" aria-hidden="true" />
    </button>
  );
}
