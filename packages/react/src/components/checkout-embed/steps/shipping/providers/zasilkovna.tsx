import React, { useEffect, useState } from "react";

declare global {
  interface Window {
    Packeta: any;
  }
}

export default function ZasilkovnaShippingOption({
  children,
  onPickupPointSelected,
  locale,
  countryCode,
  apiKey,
}: {
  children: React.ReactNode;
  onPickupPointSelected?: (
    pickupPointId: string,
    pickupPointName: string
  ) => void;
  locale?: string;
  countryCode?: string;
  apiKey?: string;
}) {
  const [widgetLoaded, setWidgetLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already present
    if (
      !document.querySelector(
        'script[src="https://widget.packeta.com/v6/www/js/library.js"]'
      )
    ) {
      const script = document.createElement("script");
      script.src = "https://widget.packeta.com/v6/www/js/library.js";
      script.async = true;
      script.onload = () => {
        setWidgetLoaded(true);
      };
      script.onerror = () =>
        console.error("Failed to load Packeta Widget script.");
      document.body.appendChild(script);
    } else {
      setWidgetLoaded(true);
    }
  }, []);

  const handleClick = () => {
    if (widgetLoaded && window.Packeta && window.Packeta.Widget) {
      const options = {
        language: locale,
        country: countryCode,
        view: "modal",
        valueFormat: "id,name,city,street",
      };

      window.Packeta.Widget.pick(
        apiKey,
        (point?: { id: string; name: string }) => {
          if (point) {
            onPickupPointSelected?.(point.id, point.name);
          }
        },
        options
      );
    } else {
      console.error("Packeta widget not found", window);
    }
  };

  return (
    <>
      <div onClick={() => handleClick()}>{children}</div>
    </>
  );
}
