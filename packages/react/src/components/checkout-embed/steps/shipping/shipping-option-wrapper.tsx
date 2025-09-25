import { ShippingRate } from "@betterstore/bridge";
import React from "react";
import ZasilkovnaShippingOption from "./providers/zasilkovna";

export default function ShippingOptionWrapper({
  rate,
  children,
  onPickupPointSelected,
  locale,
  countryCode,
}: {
  rate: ShippingRate;
  children: React.ReactNode;
  onPickupPointSelected?: (
    pickupPointId: string,
    pickupPointName: string
  ) => void;
  locale?: string;
  countryCode?: string;
}) {
  const isAutoRate =
    rate.type === "CUSTOM_SHIPPING_VENDOR" || rate.type === "PLATFORM_CARRIER";

  if (isAutoRate && rate.providerId === "zasilkovna") {
    return (
      <ZasilkovnaShippingOption
        onPickupPointSelected={onPickupPointSelected}
        locale={locale}
        countryCode={countryCode}
        apiKey={rate.clientSecret}
      >
        {children}
      </ZasilkovnaShippingOption>
    );
  }

  return <>{children}</>;
}
