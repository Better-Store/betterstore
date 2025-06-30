import { default as createI18nInstance, Locale } from "@/react/i18n";
import { CheckoutSession, createStoreClient } from "@betterstore/sdk";
import React, { memo, useEffect, useRef, useState } from "react";
import { IframeWrapper } from "../iframe-wrapper";
import { Toaster } from "../ui/sonner";
import Appearance, { AppearanceConfig, Fonts } from "./appearance";
import CheckoutForm from "./checkout-form";
import CheckoutFormLoading from "./checkout-form-loading";
import CheckoutSummary from "./steps/summary";
import CheckoutSummaryLoading from "./steps/summary/loading";
import { resetFormStore, useFormStore } from "./useFormStore";

interface CheckoutEmbedProps {
  checkoutId: string;
  config: {
    clientSecret: string;
    cancelUrl: string;
    successUrl: string;
    appearance?: AppearanceConfig;
    fonts?: Fonts;
    locale?: Locale;
    clientProxy?: string;
  };
}

function CheckoutEmbedComponent({ checkoutId, config }: CheckoutEmbedProps) {
  const {
    cancelUrl,
    successUrl,
    appearance,
    locale,
    clientSecret,
    clientProxy,
  } = config;
  const storeClient = React.useMemo(
    () => createStoreClient({ proxy: clientProxy }),
    [clientProxy]
  );
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  React.useMemo(() => createI18nInstance(locale), [locale]);

  const { formData, step } = useFormStore();

  const paymentSecretPromiseRef = useRef<Promise<void> | null>(null);
  const [paymentSecret, setPaymentSecret] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [paymentComponentKey, setPaymentComponentKey] = useState(0);

  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true; // Add mounted flag for cleanup

    async function fetchCheckout() {
      try {
        const newCheckout = await storeClient.retrieveCheckout(
          clientSecret,
          checkoutId
        );

        if (mounted) {
          // Only update state if component is still mounted
          setCheckout(newCheckout);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch checkout:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchCheckout();

    return () => {
      mounted = false; // Cleanup
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutId]); // Only re-run if checkoutId changes

  const onSuccess = () => {
    resetFormStore(formData);

    if (successUrl) {
      window.location.href = successUrl;
    }
  };

  const onCancel = () => {
    resetFormStore(formData);

    if (cancelUrl) {
      window.location.href = cancelUrl;
    }
  };

  const onError = () => {};

  if (!checkout && !loading) {
    throw new Error("Checkout not found");
  }

  const setShippingCost = (cost: number) => {
    if (!checkout) return;
    setCheckout({ ...checkout, shipping: cost });
  };

  async function generatePaymentSecret() {
    console.log("[Payment Debug] Generating new payment secret");
    const { paymentSecret, publicKey, checkoutSession } =
      await storeClient.generateCheckoutPaymentSecret(clientSecret, checkoutId);

    setPaymentSecret(paymentSecret);
    setPublicKey(publicKey);
    setCheckout(checkoutSession);
    console.log("[Payment Debug] New payment secret generated");
  }

  useEffect(() => {
    if (
      step === "payment" &&
      !paymentSecret &&
      !paymentSecretPromiseRef.current
    ) {
      console.log(
        "[Payment Debug] Initial payment secret generation triggered by useEffect"
      );
      paymentSecretPromiseRef.current = generatePaymentSecret().finally(() => {
        paymentSecretPromiseRef.current = null;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSecret, step]);

  const applyDiscountCode = async (code: string) => {
    console.log("[Payment Debug] Applying discount code:", code);
    const newCheckout = await storeClient.applyDiscountCode(
      clientSecret,
      checkoutId,
      code
    );

    setCheckout(newCheckout);

    if (step === "payment") {
      const newTotal = calculateTotalWithDiscounts(newCheckout);
      const currentTotal = calculateTotalWithDiscounts(checkout);
      console.log(
        "[Payment Debug] Discount applied - New total:",
        newTotal,
        "Current total:",
        currentTotal
      );
      if (newTotal !== currentTotal) {
        console.log(
          "[Payment Debug] Total changed, regenerating payment secret"
        );
        await generatePaymentSecret();
        setPaymentComponentKey((prev) => prev + 1);
      } else {
        console.log(
          "[Payment Debug] Total unchanged, skipping payment secret regeneration"
        );
      }
    }
  };

  const revalidateDiscounts = async () => {
    console.log("[Payment Debug] Revalidating discounts");
    if (step === "payment") {
      const newCheckout = await storeClient.revalidateDiscounts(
        clientSecret,
        checkoutId
      );
      const newTotal = calculateTotalWithDiscounts(newCheckout);
      const currentTotal = calculateTotalWithDiscounts(checkout);
      console.log(
        "[Payment Debug] Discounts revalidated - New total:",
        newTotal,
        "Current total:",
        currentTotal
      );
      if (newTotal !== currentTotal) {
        console.log(
          "[Payment Debug] Total changed, regenerating payment secret"
        );
        await generatePaymentSecret();
        setPaymentComponentKey((prev) => prev + 1);
      } else {
        console.log(
          "[Payment Debug] Total unchanged, skipping payment secret regeneration"
        );
      }
      setCheckout(newCheckout);
    } else {
      const newCheckout = await storeClient.revalidateDiscounts(
        clientSecret,
        checkoutId
      );
      setCheckout(newCheckout);
    }
  };

  const removeDiscount = async (id: string) => {
    console.log("[Payment Debug] Removing discount:", id);
    const newCheckout = await storeClient.removeDiscount(
      clientSecret,
      checkoutId,
      id
    );

    setCheckout(newCheckout);

    if (step === "payment") {
      const newTotal = calculateTotalWithDiscounts(newCheckout);
      const currentTotal = calculateTotalWithDiscounts(checkout);
      console.log(
        "[Payment Debug] Discount removed - New total:",
        newTotal,
        "Current total:",
        currentTotal
      );
      if (newTotal !== currentTotal) {
        console.log(
          "[Payment Debug] Total changed, regenerating payment secret"
        );
        await generatePaymentSecret();
        setPaymentComponentKey((prev) => prev + 1);
      } else {
        console.log(
          "[Payment Debug] Total unchanged, skipping payment secret regeneration"
        );
      }
    }
  };

  const calculateTotalWithDiscounts = (checkout: CheckoutSession | null) => {
    if (!checkout) return 0;

    const subtotal = checkout.lineItems.reduce((acc, item) => {
      const productItem = item.productData?.selectedVariant || item.productData;
      return acc + (productItem?.priceInCents ?? 0) * item.quantity;
    }, 0);

    const shippingPrice = checkout.shipping ?? 0;
    const total = subtotal + (checkout.tax ?? 0) + shippingPrice;

    const isShippingFree =
      subtotal > shippingPrice &&
      checkout.appliedDiscounts.some(
        (discount) => discount.discount.type === "FREE_SHIPPING"
      );

    const filteredDiscounts = checkout.appliedDiscounts.filter(
      (discount) => discount.discount.type !== "FREE_SHIPPING"
    );

    const finalTotal =
      total -
      filteredDiscounts.reduce((acc, { amount }) => acc + amount, 0) -
      (isShippingFree ? shippingPrice : 0);

    console.log("[Payment Debug] Total calculation:", {
      subtotal,
      shippingPrice,
      tax: checkout.tax,
      isShippingFree,
      discountAmount: filteredDiscounts.reduce(
        (acc, { amount }) => acc + amount,
        0
      ),
      finalTotal,
    });

    return finalTotal;
  };

  useEffect(() => {
    console.log("[Payment Debug] Setting up discount revalidation interval");
    const interval = setTimeout(() => {
      if (step !== "payment") {
        console.log("[Payment Debug] Interval triggered revalidation");
        revalidateDiscounts();
      }
    }, 1000 * 5);

    return () => {
      console.log("[Payment Debug] Clearing revalidation interval");
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IframeWrapper iframeRef={iframeRef}>
      <div className="checkout-embed flex h-max flex-col gap-6 py-4 md:grid md:grid-cols-7 md:gap-0 md:py-12">
        <Appearance
          appearance={appearance}
          fonts={config.fonts}
          iframeRef={iframeRef}
        />

        <div className="h-max px-4 md:col-span-4 md:px-8">
          {loading ? (
            <CheckoutFormLoading />
          ) : (
            <CheckoutForm
              locale={locale}
              setShippingCost={setShippingCost}
              storeClient={storeClient}
              fonts={config.fonts}
              checkoutAppearance={appearance}
              currency={checkout?.currency ?? ""}
              customer={checkout?.customer}
              cancelUrl={cancelUrl}
              checkoutId={checkoutId}
              clientSecret={clientSecret}
              onSuccess={onSuccess}
              onError={onError}
              exchangeRate={checkout?.exchangeRate ?? 1}
              publicKey={publicKey}
              paymentSecret={paymentSecret}
              paymentComponentKey={paymentComponentKey}
            />
          )}
        </div>
        <div className="order-first h-max px-4 md:order-last md:col-span-3 md:px-8">
          <Toaster />
          {loading ? (
            <CheckoutSummaryLoading />
          ) : (
            <CheckoutSummary
              currency={checkout?.currency ?? ""}
              lineItems={checkout?.lineItems ?? []}
              shipping={checkout?.shipping}
              tax={checkout?.tax}
              onCancel={onCancel}
              exchangeRate={checkout?.exchangeRate ?? 1}
              applyDiscountCode={applyDiscountCode}
              appliedDiscounts={checkout?.appliedDiscounts ?? []}
              removeDiscount={removeDiscount}
            />
          )}
        </div>
      </div>
    </IframeWrapper>
  );
}

const CheckoutEmbed = memo(CheckoutEmbedComponent);

export { CheckoutEmbed };
