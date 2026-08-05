import { z } from "zod";

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(120),
  line1: z.string().min(3, "Address is required").max(200),
  line2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(120),
  state: z.string().max(120).optional().or(z.literal("")),
  postalCode: z.string().min(1, "Postal code is required").max(20),
  country: z
    .string()
    .length(2, "Use a 2-letter country code (e.g. US)")
    .transform((v) => v.toUpperCase()),
  phone: z.string().max(30).optional().or(z.literal("")),
});

export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  shippingAddress: addressSchema,
  billingSameAsShipping: z.boolean().default(true),
  billingAddress: addressSchema.optional(),
  shippingMethodId: z.string().min(1, "Choose a shipping method"),
  couponCode: z.string().max(64).optional().or(z.literal("")),
  saveAddress: z.boolean().default(false),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
