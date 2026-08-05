import { z } from "zod";

export const roleUpdateSchema = z.object({
  role: z.enum(["CUSTOMER", "EDITOR", "MANAGER", "ADMIN"]),
});

export type RoleUpdateInput = z.infer<typeof roleUpdateSchema>;
