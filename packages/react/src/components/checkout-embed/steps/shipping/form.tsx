import SubmitButton from "@/react/components/compounds/form/submit-button";
import { Button } from "@/react/components/ui/button";
import { Form, FormMessage } from "@/react/components/ui/form";
import { Skeleton } from "@/react/components/ui/skeleton";
import { storeHelpers } from "@/react/lib/betterstore";
import { GetShippingRatesResponse, ShippingRate } from "@betterstore/bridge";
import { CheckoutSession } from "@betterstore/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  type ShipmentsFormData,
  shipmentsFormSchema,
} from "../../checkout-schema";
import { FormStore } from "../../useFormStore";
import ShippingOptionWrapper from "./shipping-option-wrapper";

interface ShipmentsFormProps {
  shippingRates: GetShippingRatesResponse;
  initialData?: ShipmentsFormData;
  onSubmit: (data: ShipmentsFormData) => void;
  onBack: () => void;
  contactEmail: string;
  shippingAddress: string;
  currency: string;
  exchangeRate: number;
  locale?: string;
  countryCode?: string;
  setFormData: FormStore["setFormData"];
  formData: FormStore["formData"];
  shipments: CheckoutSession["shipments"];
}

export default function ShipmentsForm({
  shippingRates,
  initialData,
  onSubmit,
  onBack,
  contactEmail,
  shippingAddress,
  currency,
  exchangeRate,
  locale,
  countryCode,
  setFormData,
  formData,
  shipments,
}: ShipmentsFormProps) {
  const { t } = useTranslation();

  const form = useForm<ShipmentsFormData>({
    resolver: zodResolver(shipmentsFormSchema),
    defaultValues:
      initialData ||
      Object.fromEntries(
        shipments.map((shipment) => [
          shipment.id,
          {
            rateId: "",
            provider: "",
            priceInCents: 0,
            pickupPointId: "",
            pickupPointDisplayName: "",
          },
        ])
      ),
  });

  const isButtonEnabled = Object.values(form.getValues()).every(
    (value) => value.rateId?.length > 0
  );

  return (
    <div className="space-y-6">
      <h2>{t("CheckoutEmbed.Shipping.title")}</h2>

      <div className="space-y-2 pb-2">
        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.contact")}
            </span>{" "}
            <span className="text-muted-foreground">{contactEmail}</span>
          </p>
          <Button variant="link" size="link" onClick={onBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.address")}
            </span>{" "}
            <span className="text-muted-foreground">{shippingAddress}</span>
          </p>
          <Button variant="link" size="link" onClick={onBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {shipments.map((shipment, index) => (
            <SingleShipmentSection
              key={shipment.id}
              shipment={shipment}
              shippingRates={shippingRates[shipment.id] ?? []}
              form={form}
              setFormData={setFormData}
              formData={formData}
              currency={currency}
              exchangeRate={exchangeRate}
              locale={locale}
              countryCode={countryCode}
              multipleShipments={shipments.length > 1}
              index={index}
            />
          ))}
          <FormMessage>{form.formState.errors.root?.message}</FormMessage>

          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="ghost" onClick={onBack}>
              <ChevronLeft />
              {t("CheckoutEmbed.Shipping.back")}
            </Button>
            <SubmitButton
              isSubmitting={form.formState.isSubmitting}
              isValid={isButtonEnabled}
            >
              {t("CheckoutEmbed.Shipping.button")}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

const SingleShipmentSection = ({
  shippingRates,
  form,
  currency,
  exchangeRate,
  locale,
  countryCode,
  setFormData,
  formData,
  multipleShipments,
  shipment,
  index,
}: {
  shippingRates: ShippingRate[];
  form: UseFormReturn<ShipmentsFormData>;
  setFormData: FormStore["setFormData"];
  formData: FormStore["formData"];
  currency: string;
  exchangeRate: number;
  locale?: string;
  countryCode?: string;
  multipleShipments: boolean;
  shipment: CheckoutSession["shipments"][number];
  index: number;
}) => {
  const { t } = useTranslation();
  const shipmentId = shipment.id;
  const currentRateId = form.watch(`${shipmentId}.rateId`);

  // TODO: construct the headline

  return (
    <div>
      {multipleShipments && (
        <h3 className="text-lg font-medium">
          {t("CheckoutEmbed.Shipping.Shipment.title")}
          {index + 1}
        </h3>
      )}
      {shippingRates.length === 0 &&
        Array.from({ length: 3 }).map((_, index) => (
          <ShippingRateLoading key={index} />
        ))}
      {shippingRates.map((rate) => {
        const pickupPointDisplayName = form.watch(
          `${shipmentId}.pickupPointDisplayName`
        );
        const intPrice = Math.ceil(Number(rate.priceInCents));
        const displayPrice = storeHelpers.formatPrice(
          intPrice,
          currency,
          exchangeRate
        );

        const isFixedRate = rate.type === "FIXED";
        const isAutoRate =
          rate.type === "CUSTOM_SHIPPING_VENDOR" ||
          rate.type === "PLATFORM_CARRIER";
        const isZasilkovna = isAutoRate && rate.providerId === "zasilkovna";

        const name = isFixedRate
          ? rate.name
          : (t(`CheckoutEmbed.Shipping.Shipment.perIdTitles.${rate.id}`) ??
            rate.id);

        const fallbackDescription = t(
          `CheckoutEmbed.Shipping.Shipment.perIdDescriptions.fallback`
        );
        const description =
          (isFixedRate
            ? rate.description
            : t(
                `CheckoutEmbed.Shipping.Shipment.perIdDescriptions.${rate.id}`
              )) ?? fallbackDescription;

        return (
          <ShippingOptionWrapper
            rate={rate}
            key={rate.id}
            onPickupPointSelected={(
              pickupPointId: string,
              pickupPointName: string
            ) => {
              const newData = {
                rateId: rate.id,
                providerId: isAutoRate ? rate.providerId : undefined,
                priceInCents: intPrice,
                displayName: name,
                pickupPointId: isZasilkovna ? pickupPointId : "",
                pickupPointDisplayName: isZasilkovna ? pickupPointName : "",
              };

              form.setValue(`${shipmentId}.rateId`, newData.rateId);
              form.setValue(`${shipmentId}.providerId`, newData.providerId);
              form.setValue(`${shipmentId}.displayName`, newData.displayName);
              form.setValue(`${shipmentId}.priceInCents`, newData.priceInCents);
              form.setValue(
                `${shipmentId}.pickupPointId`,
                newData.pickupPointId
              );
              form.setValue(
                `${shipmentId}.pickupPointDisplayName`,
                newData.pickupPointDisplayName
              );

              setFormData({
                ...formData,
                shipping: { ...formData.shipping, [shipmentId]: newData },
              });
            }}
            locale={locale}
            countryCode={countryCode}
          >
            <div
              className={clsx(
                "bg-background cursor-pointer rounded-md border p-4",
                {
                  "bg-muted border-primary": currentRateId === rate.id,
                }
              )}
            >
              <div className="flex w-full items-center justify-between">
                <p>{name}</p>
                <p>{displayPrice}</p>
              </div>
              <p className="text-muted-foreground text-sm">{description}</p>
              {pickupPointDisplayName && (
                <>
                  <hr className="my-2" />
                  <p className="text-muted-foreground text-sm">
                    {t("CheckoutEmbed.Shipping.description.shippedTo")}{" "}
                    <span className="text-foreground">
                      {pickupPointDisplayName}
                    </span>
                  </p>
                </>
              )}
            </div>
          </ShippingOptionWrapper>
        );
      })}
    </div>
  );
};

function ShippingRateLoading() {
  return (
    <div
      className={clsx(
        "bg-background grid cursor-pointer gap-[10px] rounded-md border p-4"
      )}
    >
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-5 w-12" />
        <Skeleton className="h-5 w-16" />
      </div>
      <Skeleton className="h-3.5 w-40" />
    </div>
  );
}
