"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import type { CartItem } from "@/lib/types";
import { products } from "@/lib/data/products";
import { createLocalStore } from "@/lib/createLocalStore";

const cartStore = createLocalStore<CartItem[]>("velocity-cart", []);

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: number, color: string) => void;
  updateQuantity: (
    productId: string,
    size: number,
    color: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, b: Omit<CartItem, "quantity">) {
  return a.productId === b.productId && a.size === b.size && a.color === b.color;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((item: CartItem) => {
    const prev = cartStore.getSnapshot();
    const existing = prev.find((line) => sameLine(line, item));
    const next = existing
      ? prev.map((line) =>
          sameLine(line, item)
            ? { ...line, quantity: line.quantity + item.quantity }
            : line
        )
      : [...prev, item];
    cartStore.set(next);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (productId: string, size: number, color: string) => {
      const prev = cartStore.getSnapshot();
      cartStore.set(prev.filter((line) => !sameLine(line, { productId, size, color })));
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, size: number, color: string, quantity: number) => {
      const prev = cartStore.getSnapshot();
      const next = prev
        .map((line) =>
          sameLine(line, { productId, size, color })
            ? { ...line, quantity: Math.max(1, quantity) }
            : line
        )
        .filter((line) => line.quantity > 0);
      cartStore.set(next);
    },
    []
  );

  const clearCart = useCallback(() => cartStore.set([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((sum, line) => sum + line.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, line) => {
        const product = products.find((p) => p.id === line.productId);
        return product ? sum + product.price * line.quantity : sum;
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      isOpen,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      isOpen,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openCart,
      closeCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
