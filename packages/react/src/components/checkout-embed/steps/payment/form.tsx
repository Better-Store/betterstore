import SubmitButton from "@/react/components/compounds/form/submit-button";
import PaymentElement from "@/react/components/payment-element";
import { useCheckout } from "@/react/components/payment-element/useCheckout";
import { Button } from "@/react/components/ui/button";
import { formatPrice } from "@betterstore/bridge";
import { StripeElementLocale } from "@stripe/stripe-js";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppearanceConfig,
  convertCheckoutAppearanceToStripeAppearance,
  Fonts,
} from "../../appearance";
import { FormStore } from "../../useFormStore";
import { Icons } from "./icons";

interface PaymentFormProps {
  paymentSecret: string | null;
  onSuccess: () => void;
  onError: () => void;
  onBack: () => void;
  onDoubleBack: () => void;
  contactEmail: string;
  shippingFormData: NonNullable<FormStore["formData"]["shipping"]>;
  address: string;
  checkoutAppearance?: AppearanceConfig;
  fonts?: Fonts;
  locale?: StripeElementLocale;
  publicKey: string | null;
  paymentComponentKey: number;
  currency: string;
}

export default function PaymentForm({
  paymentSecret,
  onSuccess,
  onError,
  onBack,
  onDoubleBack,
  currency,
  contactEmail,
  shippingFormData,
  address,
  checkoutAppearance,
  fonts,
  locale,
  publicKey,
  paymentComponentKey,
}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  const { paymentMethod } = useCheckout();

  const submitButtonTextKey =
    paymentMethod === "apple_pay"
      ? "apple_pay"
      : paymentMethod === "card"
        ? "default"
        : paymentMethod === "paypal"
          ? "paypal"
          : paymentMethod === "google_pay"
            ? "google_pay"
            : "default";
  const submitButtonText = t(
    `CheckoutEmbed.Payment.button.${submitButtonTextKey}`
  );

  const renderButtonIcon = () => {
    return submitButtonTextKey === "apple_pay" ? (
      <Icons.apple className="size-5 max-sm:size-[22px]" />
    ) : submitButtonTextKey === "google_pay" ? (
      <Icons.google className="ml-1 size-4 max-sm:size-5" />
    ) : submitButtonTextKey === "paypal" ? (
      <Icons.paypal className="ml-1 size-4 max-sm:size-5" />
    ) : null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">{t("CheckoutEmbed.Payment.title")}</h2>
        <p className="text-muted-foreground text-sm">
          {t("CheckoutEmbed.Payment.description")}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.contact")}
            </span>{" "}
            <span className="text-muted-foreground">{contactEmail}</span>
          </p>
          <Button variant="link" size="link" onClick={onDoubleBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.address")}
            </span>{" "}
            <span className="text-muted-foreground">{address}</span>
          </p>
          <Button variant="link" size="link" onClick={onDoubleBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-1">
            <p className="font-medium">
              {t("CheckoutEmbed.Shipping.shipping")}
            </p>{" "}
            <div className="text-muted-foreground flex flex-col gap-1">
              {Object.entries(shippingFormData).map(
                ([id, shipmentFormData]) => (
                  <p key={id}>
                    {shipmentFormData.displayName} ·{" "}
                    {formatPrice(shipmentFormData.priceInCents, currency)}
                  </p>
                )
              )}
            </div>
          </div>
          <Button variant="link" size="link" onClick={onBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {paymentSecret && (
          <PaymentElement
            key={paymentComponentKey}
            fonts={fonts}
            checkoutAppearance={convertCheckoutAppearanceToStripeAppearance(
              checkoutAppearance,
              fonts
            )}
            locale={locale}
            paymentSecret={paymentSecret}
            onSuccess={onSuccess}
            onError={onError}
            setSubmitting={setIsSubmitting}
            publicKey={publicKey}
          >
            <div className="fixed bottom-0 left-0 right-0 z-50 mt-8 px-4 sm:static sm:px-0">
              <div className="bg-background flex flex-col-reverse items-center justify-between gap-2 pb-4 sm:flex-row sm:bg-transparent sm:pb-0">
                <Button
                  className="w-full max-sm:hidden sm:w-fit"
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                >
                  <ChevronLeft />
                  {t("CheckoutEmbed.Payment.back")}
                </Button>
                <SubmitButton
                  className="w-full max-sm:h-[52px] max-sm:text-base sm:w-fit"
                  isValid={true}
                  isSubmitting={isSubmitting}
                >
                  {submitButtonText}
                  {renderButtonIcon()}
                </SubmitButton>
              </div>
            </div>
          </PaymentElement>
        )}
      </div>
    </div>
  );
}
