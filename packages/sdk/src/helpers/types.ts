import { Address } from "../types";

export type AutocompleteAddressResult = Pick<
  Address,
  | "line1"
  | "line2"
  | "city"
  | "province"
  | "provinceCode"
  | "country"
  | "countryCode"
  | "zipCode"
>;
