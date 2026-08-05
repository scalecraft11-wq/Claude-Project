import { z } from "zod";

export const storeSettingsSchema = z.object({
  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters")
    .max(100),
  supportEmail: z.string().email("Enter a valid email address"),
  currency: z.string().min(3).max(3),
  timezone: z.string().min(1),
  maintenanceMode: z.boolean(),
});

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
