import SubmitButton from "@/react/components/compounds/form/submit-button";
import PaymentElement from "@/react/components/payment-element";
import { Button } from "@/react/components/ui/button";
import { StripeElementLocale } from "@stripe/stripe-js";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppearanceConfig,
  convertCheckoutAppearanceToStripeAppearance,
  Fonts,
} from "../../appearance";

interface PaymentFormProps {
  paymentSecret: string | null;
  onSuccess: () => void;
  onError: () => void;
  onBack: () => void;
  onDoubleBack: () => void;
  contactEmail: string;
  shippingAddress: string;
  shippingName: string;
  shippingPrice: string;
  checkoutAppearance?: AppearanceConfig;
  fonts?: Fonts;
  locale?: StripeElementLocale;
  publicKey: string | null;
  paymentComponentKey: number;
}

export default function PaymentForm({
  paymentSecret,
  onSuccess,
  onError,
  onBack,
  onDoubleBack,
  contactEmail,
  shippingAddress,
  shippingName,
  shippingPrice,
  checkoutAppearance,
  fonts,
  locale,
  publicKey,
  paymentComponentKey,
}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

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
            <span className="text-muted-foreground">{shippingAddress}</span>
          </p>
          <Button variant="link" size="link" onClick={onDoubleBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.shipping")}
            </span>{" "}
            <span className="text-muted-foreground">
              {shippingName} · {shippingPrice}
            </span>
          </p>
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
            <div className="fixed bottom-0 left-0 right-0 z-50 mt-8 px-4 pb-4 sm:static sm:px-0 sm:pb-0">
              <div className="bg-background flex flex-col-reverse items-center justify-between gap-2 sm:flex-row sm:bg-transparent">
                <Button
                  className="w-full sm:w-fit"
                  type="button"
                  variant="ghost"
                  onClick={onBack}
                >
                  <ChevronLeft />
                  {t("CheckoutEmbed.Payment.back")}
                </Button>
                <SubmitButton
                  className="w-full max-sm:h-[52px] sm:w-fit"
                  isValid={true}
                  isSubmitting={isSubmitting}
                >
                  {t("CheckoutEmbed.Payment.button")}
                </SubmitButton>
              </div>
            </div>
          </PaymentElement>
        )}
      </div>
    </div>
  );
}
