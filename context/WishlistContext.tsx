"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { createLocalStore } from "@/lib/createLocalStore";

const wishlistStore = createLocalStore<string[]>("velocity-wishlist", []);

type WishlistContextValue = {
  productIds: string[];
  isOpen: boolean;
  isWishlisted: (productId: string) => boolean;
  toggle: (productId: string) => void;
  remove: (productId: string) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const productIds = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot
  );
  const [isOpen, setIsOpen] = useState(false);

  const isWishlisted = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  );

  const toggle = useCallback((productId: string) => {
    const prev = wishlistStore.getSnapshot();
    wishlistStore.set(
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }, []);

  const remove = useCallback((productId: string) => {
    const prev = wishlistStore.getSnapshot();
    wishlistStore.set(prev.filter((id) => id !== productId));
  }, []);

  const openWishlist = useCallback(() => setIsOpen(true), []);
  const closeWishlist = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      productIds,
      isOpen,
      isWishlisted,
      toggle,
      remove,
      openWishlist,
      closeWishlist,
    }),
    [productIds, isOpen, isWishlisted, toggle, remove, openWishlist, closeWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
