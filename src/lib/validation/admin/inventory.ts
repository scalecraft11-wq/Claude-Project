import { z } from "zod";

export const inventoryMovementSchema = z
  .object({
    type: z.enum(["RESTOCK", "ADJUSTMENT", "RETURN"]),
    quantity: z.coerce
      .number()
      .int()
      .refine((value) => value !== 0, "Quantity can't be zero"),
    note: z.string().max(500).optional().or(z.literal("")),
  })
  .refine((data) => data.type === "ADJUSTMENT" || data.quantity > 0, {
    message: "Restock and return quantities must be positive",
    path: ["quantity"],
  });

export type InventoryMovementInput = z.infer<typeof inventoryMovementSchema>;
