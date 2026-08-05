/**
 * Formatting helpers. Money is always stored/passed as integer cents
 * (ARCHITECTURE.md §14 — Database Schema) and only ever formatted to a
 * currency string at the presentation boundary.
 */

export function formatCurrency(
  cents: number,
  currency: string = "USD",
  locale: string = "en-US",
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  locale: string = "en-US",
): string {
  const value = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(value);
}
