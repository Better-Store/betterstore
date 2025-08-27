export interface GetShippingRatesResponse {
  [shipmentId: string]: ShippingRate[];
}

type ShippingVendorCarrierType = "zasilkovna";

// ----------------------------------------//
// ------------- COPY PASTE --------------//
// ----------------------------------------//

type ProviderId = "zasilkovna";

export type ShippingRate =
  | FixedRate
  | PlatformCarrierRate
  | CustomShippingVendorRate
  | PrebuiltRate;

export interface FixedRate {
  id: string;
  type: "FIXED";
  name: string;
  description?: string;
  priceInCents: number;
}

interface BasePlatformCarrierRate {
  id: string;
  providerId: ProviderId;
  type: "PLATFORM_CARRIER";
  platformCarrierSlug: string;
  priceInCents: number;
}

export interface ZasilkovnaPlatformCarrierRate extends BasePlatformCarrierRate {
  providerId: "zasilkovna";
  platformCarrierSlug: "bs_platform_zasilkovna";
  service: "z_box";
  clientSecret: string;
}

export type PlatformCarrierRate = ZasilkovnaPlatformCarrierRate;

interface BaseCustomShippingVendorRate {
  id: string;
  providerId: ProviderId;
  type: "CUSTOM_SHIPPING_VENDOR";
  shippingVendorCarrierType: ShippingVendorCarrierType;
  priceInCents: number;
}

export interface ZasilkovnaCustomShippingVendorRate
  extends BaseCustomShippingVendorRate {
  providerId: "zasilkovna";
  shippingVendorCarrierType: Extract<ShippingVendorCarrierType, "zasilkovna">;
  service: "z_box";
  clientSecret: string;
}

export type CustomShippingVendorRate = ZasilkovnaCustomShippingVendorRate;

type PrebuiltRateType = "PICKUP_IN_STORE" | "LOCAL_DELIVERY";

interface BasePrebuiltRate {
  id: string;
  type: "PREBUILT";
  prebuiltRateType: PrebuiltRateType;
  priceInCents: number;
}

export interface PrebuildPickupInStoreRate extends BasePrebuiltRate {
  prebuiltRateType: Extract<PrebuiltRateType, "PICKUP_IN_STORE">;
  expectedPickupDateInHours: number;
}

export interface PrebuiltLocalDeliveryRate extends BasePrebuiltRate {
  prebuiltRateType: Extract<PrebuiltRateType, "LOCAL_DELIVERY">;
}

export type PrebuiltRate =
  | PrebuildPickupInStoreRate
  | PrebuiltLocalDeliveryRate;
