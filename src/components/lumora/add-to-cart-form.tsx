"use client";

import { Minus, Plus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { addToCartAction } from "@/lib/shop/actions/cart";

export function AddToCartForm({
  productId,
  productName,
  stock,
}: {
  productId: string;
  productName: string;
  stock: number;
}) {
  const [quantity, setQuantity] = React.useState(1);
  const [isPending, startTransition] = React.useTransition();
  const isOutOfStock = stock <= 0;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-button border border-hairline-strong">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-11 items-center justify-center disabled:opacity-40"
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="w-10 text-center text-body-md" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= Math.min(stock, 99)}
            onClick={() => setQuantity((q) => Math.min(stock, 99, q + 1))}
            className="flex size-11 items-center justify-center disabled:opacity-40"
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
        </div>

        <Button
          size="lg"
          className="flex-1"
          disabled={isOutOfStock}
          isLoading={isPending}
          onClick={() =>
            startTransition(async () => {
              const result = await addToCartAction(productId, quantity);
              if (result.success) {
                toast.success(`Added ${productName} to your bag.`);
              } else {
                toast.error(result.message);
              }
            })
          }
        >
          {isOutOfStock ? "Sold out" : "Add to Bag"}
        </Button>
      </div>
      {!isOutOfStock && stock <= 10 && (
        <p className="text-body-sm text-content-muted">
          Only {stock} left in stock.
        </p>
      )}
    </div>
  );
}
