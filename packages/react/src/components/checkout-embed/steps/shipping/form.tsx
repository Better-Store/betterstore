import SubmitButton from "@/react/components/compounds/form/submit-button";
import { Button } from "@/react/components/ui/button";
import { Form, FormMessage } from "@/react/components/ui/form";
import { Skeleton } from "@/react/components/ui/skeleton";
import { storeHelpers } from "@/react/lib/betterstore";
import { CheckoutSession, ShippingRate } from "@betterstore/sdk";
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
  shippingRates: ShippingRate[];
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
          {shipments.map((shipment) => (
            <SingleShipmentSection
              key={shipment.id}
              shipment={shipment}
              shippingRates={shippingRates}
              form={form}
              setFormData={setFormData}
              formData={formData}
              currency={currency}
              exchangeRate={exchangeRate}
              locale={locale}
              countryCode={countryCode}
              multipleShipments={shipments.length > 1}
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
}) => {
  const { t } = useTranslation();
  const shipmentId = shipment.id;
  const currentRateId = form.watch(`${shipmentId}.rateId`);

  // TODO: construct the headline

  return (
    <div>
      {multipleShipments && (
        <h3 className="text-lg font-medium">
          {/* {t("CheckoutEmbed.Shipping.shipment.title")} */}
          {/* TODO: construct the headline */}
          {shipment.shipmentData?.name}
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
        const rateId = rate.provider + rate.name;
        const intPrice = Math.ceil(Number(rate.priceInCents));
        const displayPrice = storeHelpers.formatPrice(
          intPrice,
          currency,
          exchangeRate
        );

        const description =
          rate.provider === "zasilkovna"
            ? t("CheckoutEmbed.Shipping.description.zasilkovna")
            : t("CheckoutEmbed.Shipping.description.other");

        return (
          <ShippingOptionWrapper
            rate={rate}
            key={rateId}
            onPickupPointSelected={(
              pickupPointId: string,
              pickupPointName: string
            ) => {
              const newData = {
                rateId,
                provider: rate.provider,
                priceInCents: intPrice,
                name: rate.name,
                pickupPointId:
                  rate.provider === "zasilkovna" ? pickupPointId : "",
                pickupPointDisplayName:
                  rate.provider === "zasilkovna" ? pickupPointName : "",
              };

              form.setValue(`${shipmentId}.rateId`, newData.rateId);
              form.setValue(`${shipmentId}.provider`, newData.provider);
              form.setValue(`${shipmentId}.name`, newData.name);
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
                  "bg-muted border-primary": currentRateId === rateId,
                }
              )}
            >
              <div className="flex w-full items-center justify-between">
                <p>{rate.name}</p>
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
