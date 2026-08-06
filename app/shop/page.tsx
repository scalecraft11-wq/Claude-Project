import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopContent } from "@/components/shop/ShopContent";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full Velocity Shoes collection of premium sneakers.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ShopContent />
    </Suspense>
  );
}
