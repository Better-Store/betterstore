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
    line2: z.string().optional(),
    city: z.string().min(1, "required_error"),
    province: z.string().optional(),
    provinceCode: z.string().optional(),
    zipCode: z.string().min(5, "invalid_zipCode"),
    country: z.string().min(1, "required_error"),
    countryCode: z.string().min(1, "required_error"),
  }),
  phone: z.string().regex(phoneRegex, "invalid_phone"),
  isEmailSubscribed: z.boolean().optional(),
});

// Shipping method schema
export const shippingMethodSchema = z.object({
  rateId: z.string().min(1, "required_error"),
  provider: z.string().min(1, "required_error"),
  price: z.number().min(1, "required_error"),
  name: z.string().min(1, "required_error"),
  pickupPointId: z.string().optional(),
  pickupPointDisplayName: z.string().optional(),
});

// Combined checkout schema
export const checkoutSchema = z.object({
  customer: customerSchema,
  shipping: shippingMethodSchema,
  customerId: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;
