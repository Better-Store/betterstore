import {
  Address,
  Discount,
  Product,
  ProductVariant,
  ProductWithoutVariants,
} from "../types";

type ProductData = Pick<
  Product,
  | "title"
  | "description"
  | "images"
  | "category"
  | "tags"
  | "sku"
  | "barcode"
  | "vendor"
  | "isPhysical"
  | "weightInGrams"
  | "heightInCm"
  | "widthInCm"
  | "lengthInCm"
  | "priceInCents"
  | "billingType"
  | "billingInterval"
  | "billingIntervalCount"
> & {
  productId: string;
  selectedVariant: Pick<
    ProductVariant,
    | "title"
    | "description"
    | "sku"
    | "barcode"
    | "images"
    | "isPhysical"
    | "weightInGrams"
    | "heightInCm"
    | "widthInCm"
    | "lengthInCm"
    | "priceInCents"
    | "billingType"
    | "billingInterval"
    | "billingIntervalCount"
    | "variantOptions"
    | "metadata"
  >;
};

export interface LineItem {
  quantity: number;
  variantOptions: { name: string; value: string }[];
  productData: ProductData;
  metadata?: string;
}

export interface LineItemCreate
  extends Omit<
    LineItem,
    "productData" | "product" | "metadata" | "variantOptions"
  > {
  variantOptions?: { name: string; value: string }[];
  productId: string;
  product?: ProductWithoutVariants;
  metadata?: Record<string, any>;
}

export type Currency = string;

export interface CheckoutCreateParams {
  type: "hosted" | "embed";
  customerId?: string;
  lineItems: LineItemCreate[];
  currency?: Currency;
  discountCodes?: string[];
}

export interface CheckoutUpdateParams {
  customerId?: string;
  shipments?: CheckoutShipment[];
}

export type { ShippingRate } from "./shipping.types";

type ShipmentData = {
  provider: string;
  name?: string;
  service?: string;
  pickupPointId?: string;
  trackingId?: string;
  trackingUrl?: string;
  priceInCents: number;
};

type CheckoutShipment = {
  id: string;
  shipmentData?: ShipmentData | null;
};

export interface CheckoutSession {
  id: string;
  testmode: boolean;
  clientSecret: string;
  customer?: {
    id: string;
    address?: Address;
    email?: string;
  };

  lineItems: LineItem[];

  tax: number | null;
  discountAmount: number | null;
  appliedDiscounts: {
    id: string;
    amount: number;
    allowedLineItems: { productId: string; quantity: number }[];
    discount: Discount;
  }[];
  currency: string;
  exchangeRate: number | null;
  shipments: CheckoutShipment[];

  status:
    | "IN_PROGRESS"
    | "PAYMENT_PENDING"
    | "ABANDONED"
    | "CANCELED"
    | "FAILED";
}
