export type ShippingRate = ZasilkovnaRate;

export interface BaseRate {
  provider: string;
  name: string;
  priceInCents: number;
}

export interface ZasilkovnaRate extends BaseRate {
  provider: "zasilkovna";
  clientSecret: string;
}

export interface GetShippingRatesResponse {
  [shipmentId: string]: ShippingRate[];
}
