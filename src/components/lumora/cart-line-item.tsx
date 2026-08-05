"use client";

import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { toast } from "@/components/ui/toaster";
import { formatCurrency } from "@/lib/format";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/lib/shop/actions/cart";

export interface CartLineItemData {
  id: string;
  quantity: number;
  product: {
    slug: string;
    name: string;
    priceCents: number;
    stock: number;
    images: { url: string; altText: string }[];
  };
}

export function CartLineItem({ item }: { item: CartLineItemData }) {
  const [isPending, startTransition] = React.useTransition();
  const image = item.product.images[0];

  function updateQuantity(next: number) {
    if (next < 1) return;
    startTransition(async () => {
      const result = await updateCartItemAction(item.id, next);
      if (!result.success) toast.error(result.message);
    });
  }

  return (
    <div className="flex gap-4 border-b border-hairline-subtle py-6">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-sm bg-surface-raised">
        {image && (
          <Image
            src={image.url}
            alt={image.altText}
            fill
            sizes="96px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/lumora/products/${item.product.slug}`}
              className="text-body-md font-medium hover:underline"
            >
              {item.product.name}
            </Link>
            <p className="mt-1 text-body-sm text-content-secondary">
              {formatCurrency(item.product.priceCents)}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${item.product.name} from bag`}
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                const result = await removeCartItemAction(item.id);
                if (!result.success) toast.error(result.message);
              })
            }
            className="text-content-muted hover:text-content-primary disabled:opacity-40"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-button border border-hairline-strong">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={isPending || item.quantity <= 1}
              onClick={() => updateQuantity(item.quantity - 1)}
              className="flex size-9 items-center justify-center disabled:opacity-40"
            >
              <Minus className="size-3.5" aria-hidden="true" />
            </button>
            <span className="w-8 text-center text-body-sm" aria-live="polite">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={isPending || item.quantity >= item.product.stock}
              onClick={() => updateQuantity(item.quantity + 1)}
              className="flex size-9 items-center justify-center disabled:opacity-40"
            >
              <Plus className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
