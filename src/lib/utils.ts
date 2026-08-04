import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class lists with Tailwind-aware de-duplication. Every component
 * that accepts a `className` override should compose it through `cn()`
 * (CODE_STANDARDS.md — Styling) rather than string-concatenating classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
