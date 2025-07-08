import { Address } from "../types";

export type AutosuggestAddressResult = {
  id: string;
  title: string;
  address: Pick<
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
  position: {
    lat: number;
    lng: number;
  };
};
