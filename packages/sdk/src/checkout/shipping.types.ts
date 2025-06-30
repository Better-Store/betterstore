export type ShippingRate = ZasilkovnaRate;

export interface BaseRate {
  provider: string;
  name: string;
  price: number;
}

export interface ZasilkovnaRate extends BaseRate {
  provider: "zasilkovna";
  clientSecret: string;
}
