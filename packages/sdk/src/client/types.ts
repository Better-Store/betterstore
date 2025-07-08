import { Address } from "../types";

export type AutosuggestAddressResult = {
  id: string;
  title: string;
  position: {
    lat: number;
    lng: number;
  };
};

export type GeocodeAddressResult = Omit<AutosuggestAddressResult, "position"> &
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
