import { Address } from "../types";

export type AutosuggestAddressResult = {
  id: string;
  title: string;
};

export type LookupAddressResult = AutosuggestAddressResult &
  Pick<
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
