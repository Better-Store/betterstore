import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

// Shipping address schema
export const customerSchema = z.object({
  email: z.string().email("invalid_email"),
  firstName: z.string().min(1, "required_error"),
  lastName: z.string().min(1, "required_error"),
  address: z.object({
    line1: z.string().min(1, "required_error"),
    line2: z.string().nullable(),
    city: z.string().min(1, "required_error"),
    province: z.string().nullable(),
    provinceCode: z.string().nullable(),
    zipCode: z.string().min(5, "invalid_zipCode"),
    country: z.string().min(1, "required_error"),
    countryCode: z.string().min(1, "required_error"),
    company: z.string().nullable(),
  }),
  phone: z.string().regex(phoneRegex, "invalid_phone"),
  isEmailSubscribed: z.boolean().optional(),
});

// Shipping method schema
const shippingMethodSchema = z.object({
  rateId: z.string().min(1, "required_error"),
  providerId: z.optional(z.string()),
  priceInCents: z.number().min(1, "required_error"),
  pickupPointId: z.string().optional(),

  pickupPointDisplayName: z.string().optional(), // Only for display purposes
  displayName: z.string(), // Only for display purposes
});

export const shipmentsFormSchema = z
  .record(z.string(), shippingMethodSchema)
  .refine((data) => Object.keys(data).length > 0, {
    message: "at_least_one_shipping_method_required",
    path: [],
  });

// Combined checkout schema
export const checkoutSchema = z.object({
  customer: customerSchema,
  shipping: shipmentsFormSchema,
  customerId: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type ShipmentsFormData = z.infer<typeof shipmentsFormSchema>;
