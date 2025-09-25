export interface Discount {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  type:
    | "AMOUNT_OFF_PRODUCTS"
    | "BUY_X_GET_Y"
    | "AMOUNT_OFF_ORDER"
    | "FREE_SHIPPING";
  method: "CODE" | "AUTOMATIC";
  code?: string | null;
  title?: string | null;

  value: number;
  valueType: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE";
  discountScope: "PRODUCTS" | "COLLECTIONS";
  allowedProductIDs: string[];
  allowedCollectionIDs: string[];

  allowedCombinations: ("ORDER" | "PRODUCT" | "SHIPPING")[];

  minimumRequirementsType:
    | "NONE"
    | "MINIMUM_ORDER_AMOUNT"
    | "MINIMUM_PRODUCT_QUANTITY";
  minimumRequirementsValue?: number | null;
  requiredProductIDs: string[];
  requiredCollectionIDs: string[];
  minimumRequirementsScope: "PRODUCTS" | "COLLECTIONS";

  maxUses?: number | null;
  maxUsesPerCustomer?: number | null;
  maxAllowedProductQuantity?: number | null;
  uses: number;

  subscriptionDiscountDurationType: "ONE_TIME" | "RECURRING" | "FOREVER";
  subscriptionDiscountDurationValue: number;
  stripeDiscountId?: string | null;

  startsAt: Date;
  expiresAt?: Date | null;

  status: "ACTIVE" | "EXPIRED" | "SCHEDULED";

  organizationId: string;
}

export interface VariantOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  title: string;
  description?: string;
  images: string[];

  sku?: string;
  barcode?: string;
  inventoryItem: {
    stockPolicy: "CONTINUE" | "DENY";
    trackInventory: boolean;
  };

  isPhysical: boolean;
  weightInGrams?: number;
  heightInCm?: number;
  widthInCm?: number;
  lengthInCm?: number;

  priceInCents: number;
  billingType: ProductBillingType;
  billingInterval: ProductBillingInterval;
  billingIntervalCount: number;

  metadata?: Record<string, any>;

  variantOptions: VariantOption[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

export type ProductBillingInterval = "DAY" | "WEEK" | "MONTH" | "YEAR";
export type ProductBillingType = "ONE_TIME" | "SUBSCRIPTION";

export interface Product {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  title: string;
  description?: string;
  images: string[];
  category: string;
  tags: string[];

  isPhysical: boolean;
  weightInGrams?: number;
  heightInCm?: number;
  widthInCm?: number;
  lengthInCm?: number;

  priceInCents: number;
  billingType: ProductBillingType;
  billingInterval: ProductBillingInterval;
  billingIntervalCount: number;

  sku?: string;
  barcode?: string;
  inventoryItem: {
    stockPolicy: "CONTINUE" | "DENY";
    trackInventory: boolean;
  };

  seoPageTitle?: string;
  seoDescription?: string;
  seoHandle?: string;

  vendor?: string;
  metadata?: Record<string, any>;

  status: ProductStatus;

  options: ProductOption[];
  productVariants: ProductVariant[];
}

export interface ProductWithoutVariants
  extends Omit<Product, "productVariants"> {}
