import { Address } from "../types";

export type AutosuggestAddressResult = {
  id: string;
  title: string;
  address: { label: string };
  position: {
    lat: number;
    lng: number;
  };
};

export type LookupAddressResult = {
  id: string;
  title: string;
  address: Pick<
    Address,
    | "line1"
    | "city"
    | "province"
    | "provinceCode"
    | "country"
    | "countryCode"
    | "zipCode"
  >;
};
