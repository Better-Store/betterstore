import {
  DateQueryType,
  EnumQueryType,
  GetListParams,
  OptionalDateQueryType,
  StringArrayQueryType,
} from "../_globals/types";

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

export type ListDiscountsQuery = {
  // Enums
  type?: EnumQueryType<Discount["type"]>;
  valueType?: EnumQueryType<Discount["valueType"]>;
  method?: EnumQueryType<Discount["method"]>;
  status?: EnumQueryType<Discount["status"]>;
  minimumRequirementsType?: EnumQueryType<Discount["minimumRequirementsType"]>;
  minimumRequirementsScope?: EnumQueryType<
    Discount["minimumRequirementsScope"]
  >;
  discountScope?: EnumQueryType<Discount["discountScope"]>;
  subscriptionDiscountDurationType?: EnumQueryType<
    Discount["subscriptionDiscountDurationType"]
  >;

  // String arrays
  allowedCombinations?: StringArrayQueryType<Discount["allowedCombinations"]>;
  allowedProductIDs?: StringArrayQueryType<Discount["allowedProductIDs"]>;
  allowedCollectionIDs?: StringArrayQueryType<Discount["allowedCollectionIDs"]>;
  requiredProductIDs?: StringArrayQueryType<Discount["requiredProductIDs"]>;
  requiredCollectionIDs?: StringArrayQueryType<
    Discount["requiredCollectionIDs"]
  >;

  // Dates
  startsAt?: DateQueryType;
  expiresAt?: OptionalDateQueryType;
  createdAt?: DateQueryType;
  updatedAt?: DateQueryType;
};

export type ListDiscountsSortBy =
  | "createdAt"
  | "updatedAt"
  | "expiresAt"
  | "startsAt";

export type ListDiscountsParams = GetListParams<
  ListDiscountsSortBy,
  ListDiscountsQuery
>;

export type RetrieveDiscountParams =
  | {
      id: string;
    }
  | {
      code: string;
    };
