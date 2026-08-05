"use client";

import * as React from "react";

import { recordRecentlyViewedAction } from "@/lib/shop/actions/recently-viewed";

/** Fires once per product-page visit — a Server Action call from a
 * Client Component's effect, rather than a route handler, since there's
 * no other client-side interactivity needed on this page to hang it off. */
export function RecentlyViewedTracker({ productId }: { productId: string }) {
  React.useEffect(() => {
    void recordRecentlyViewedAction(productId);
  }, [productId]);

  return null;
}
