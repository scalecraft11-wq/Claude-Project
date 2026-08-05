import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { getCart } from "@/lib/shop/cart";

/** Server Component — reads the cart directly rather than round-tripping
 * through a Client Component fetch, since the count is already known at
 * render time from the same session/cookie the page itself reads. */
export async function BagIndicator() {
  const cart = await getCart();
  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <Link
      href="/lumora/bag"
      aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
      className="relative inline-flex size-11 items-center justify-center rounded-button text-content-primary hover:bg-surface-raised"
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {count > 0 && (
        <span className="text-text-on-accent absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
