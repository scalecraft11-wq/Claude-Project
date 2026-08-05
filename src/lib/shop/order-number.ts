import { randomInt } from "crypto";

/** Human-facing order/invoice numbers — not the DB id, which stays an
 * opaque cuid. Timestamp-prefixed so they sort chronologically at a
 * glance, plus a random suffix so two orders created in the same second
 * (a real possibility at checkout) never collide. */
export function generateOrderNumber(): string {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const suffix = randomInt(1000, 9999);
  return `LS-${stamp}-${suffix}`;
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}`;
  const suffix = randomInt(10000, 99999);
  return `INV-${stamp}-${suffix}`;
}
