import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Category } from "@/lib/types";
import type { Silhouette } from "@/components/ui/SneakerArt";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSilhouette(category: Category): Silhouette {
  if (category === "Basketball") return "high";
  if (category === "Slides") return "slide";
  return "low";
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
