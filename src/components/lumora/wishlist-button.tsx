"use client";

import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { toast } from "@/components/ui/toaster";
import { toggleWishlistAction } from "@/lib/shop/actions/wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  productId,
  productName,
  initialInWishlist,
  className,
}: {
  productId: string;
  productName: string;
  initialInWishlist: boolean;
  className?: string;
}) {
  const [inWishlist, setInWishlist] = React.useState(initialInWishlist);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      aria-pressed={inWishlist}
      aria-label={
        inWishlist
          ? `Remove ${productName} from wishlist`
          : `Add ${productName} to wishlist`
      }
      onClick={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const result = await toggleWishlistAction(productId);
          if (result.requiresLogin) {
            toast.error(result.message);
            router.push(
              `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
            );
            return;
          }
          if (result.success) {
            setInWishlist(result.inWishlist ?? false);
          } else {
            toast.error(result.message);
          }
        });
      }}
      className={cn(
        "bg-canvas/90 flex size-11 items-center justify-center rounded-full text-content-primary shadow-elevation-1 backdrop-blur-sm transition-colors hover:bg-canvas disabled:pointer-events-none disabled:opacity-60",
        className,
      )}
    >
      <Heart
        className={cn("size-5", inWishlist && "fill-accent text-accent")}
        aria-hidden="true"
      />
    </button>
  );
}
