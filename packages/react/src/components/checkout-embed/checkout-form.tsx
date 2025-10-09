import {
  CheckoutSession,
  CheckoutUpdateParams,
  GetShippingRatesResponse,
} from "@betterstore/bridge";
import { createStoreClient } from "@betterstore/sdk";
import { StripeElementLocale } from "@stripe/stripe-js";
import { useCallback, useEffect, useState } from "react";
import { AppearanceConfig, Fonts } from "./appearance";
import {
  customerSchema,
  shipmentsFormSchema,
  type CheckoutFormData,
  type CustomerFormData,
  type ShipmentsFormData,
} from "./checkout-schema";
import { formatAddress } from "./steps/customer/address-utils";
import CustomerForm from "./steps/customer/form";
import PaymentForm from "./steps/payment/form";
import ShippingMethodForm from "./steps/shipping/form";
import { useFormStore } from "./useFormStore";

interface CheckoutFormProps {
  storeClient: ReturnType<typeof createStoreClient>;
  checkoutId: string;
  onSuccess: () => void;
  onError: () => void;
  cancelUrl: string;
  clientSecret: string;
  customer?: CheckoutSession["customer"];
  currency: string;
  checkoutAppearance?: AppearanceConfig;
  fonts?: Fonts;
  locale?: StripeElementLocale;
  setShippingCost: (cost: number) => void;
  exchangeRate: number;
  paymentSecret: string | null;
  publicKey: string | null;
  paymentComponentKey: number;
  clientProxy?: string;
  latitude?: number;
  longitude?: number;
  currentAlpha3CountryCode?: string;
  shipments: CheckoutSession["shipments"];
}

export default function CheckoutForm({
  storeClient,
  checkoutId,
  onSuccess,
  onError,
  cancelUrl,
  clientSecret,
  customer,
  currency,
  checkoutAppearance,
  fonts,
  locale,
  setShippingCost,
  exchangeRate,
  paymentSecret,
  publicKey,
  paymentComponentKey,
  clientProxy,
  latitude,
  longitude,
  currentAlpha3CountryCode,
  shipments,
}: CheckoutFormProps) {
  const {
    formData,
    setFormData,
    step,
    setStep,
    checkoutId: storedCheckoutId,
    setCheckoutId,
  } = useFormStore();
  const [shippingRates, setShippingRates] = useState<GetShippingRatesResponse>(
    {}
  );

  const validateStep = useCallback(() => {
    if (step === "customer") return;

    const isShippingValid =
      formData.shipping &&
      shipmentsFormSchema.safeParse(formData.shipping).success;
    const isCustomerValid =
      formData.customer && customerSchema.safeParse(formData.customer).success;

    if (step === "shipping" && !isCustomerValid) {
      setStep("customer");
    }
    if (step === "payment") {
      if (!isShippingValid) setStep("shipping");
      if (!isCustomerValid) setStep("customer");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, formData]);

  useEffect(() => {
    validateStep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  useEffect(() => {
    if (checkoutId !== storedCheckoutId) {
      setStep("customer");
      setCheckoutId(checkoutId);

      if (customer) {
        if (customer?.address?.city) {
          setStep("shipping");
        }

        setFormData({
          customerId: customer.id,
          customer: {
            firstName: customer.address?.name?.split(" ")[0] ?? "",
            lastName: customer.address?.name?.split(" ")[1] ?? "",
            phone: customer.address?.phone ?? "",
            email: customer.email ?? "",
            address: {
              line1: customer.address?.line1 ?? "",
              line2: customer.address?.line2 ?? null,
              city: customer.address?.city ?? "",
              province: customer.address?.province ?? null,
              provinceCode: customer.address?.provinceCode ?? null,
              zipCode: customer.address?.zipCode ?? "",
              country: customer.address?.country ?? "",
              countryCode: customer.address?.countryCode ?? "",
              company: customer.address?.company ?? null,
            },
          },
        });
        return;
      } else if (formData.customer?.email) {
        setFormData({
          customer: formData.customer,
        });
      } else {
        setFormData({});
      }

      return;
    }

    if (customer && !formData.customer?.email) {
      setStep("customer");

      if (customer.address?.city) {
        setStep("shipping");
      }

      setFormData({
        ...formData,
        customerId: customer.id,
        customer: {
          firstName: customer.address?.name?.split(" ")[0] ?? "",
          lastName: customer.address?.name?.split(" ")[1] ?? "",
          phone: customer.address?.phone ?? "",
          email: customer.email ?? "",
          address: {
            line1: customer.address?.line1 ?? "",
            line2: customer.address?.line2 ?? null,
            city: customer.address?.city ?? "",
            province: customer.address?.province ?? null,
            provinceCode: customer.address?.provinceCode ?? null,
            zipCode: customer.address?.zipCode ?? "",
            country: customer.address?.country ?? "",
            countryCode: customer.address?.countryCode ?? "",
            company: customer.address?.company ?? null,
          },
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  useEffect(() => {
    if (step !== "shipping") return;
    if (Object.keys(shippingRates).length > 0) return;

    const getShippingRates = async () => {
      try {
        const shippingRates = await storeClient.getCheckoutShippingRates(
          clientSecret,
          checkoutId
        );
        setShippingRates(shippingRates);
      } catch (error) {
        console.error("Failed to load shipping rates:", error);
        setShippingRates({});
      }
    };

    getShippingRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, clientSecret, checkoutId]);

  // Handle address form submission
  const handleCustomerSubmit = async (data: CustomerFormData) => {
    setFormData({
      ...formData,
      customer: data,
    });

    let newCustomerId = formData.customerId;

    if (!newCustomerId) {
      const newCustomer = await storeClient.createCustomer(clientSecret, {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        address: {
          ...data.address,
          company: data.address.company ?? null,
          line2: data.address.line2 ?? null,
          province: data.address.province ?? null,
          provinceCode: data.address.provinceCode ?? null,
          phone: data.phone,
          name: data.firstName + " " + data.lastName,
        },
      });

      await storeClient.updateCheckout(clientSecret, checkoutId, {
        customerId: newCustomer.id,
      });
      newCustomerId = newCustomer.id;
    } else {
      await storeClient.updateCustomer(clientSecret, newCustomerId, {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        address: {
          ...data.address,
          company: data.address.company ?? null,
          line2: data.address.line2 ?? null,
          province: data.address.province ?? null,
          provinceCode: data.address.provinceCode ?? null,
          phone: data.phone,
          name: data.firstName + " " + data.lastName,
        },
      });
    }

    const shippingRates = await storeClient.getCheckoutShippingRates(
      clientSecret,
      checkoutId
    );
    setShippingRates(shippingRates);

    setFormData({
      ...formData,
      customer: data,
      customerId: newCustomerId,
    });
    setStep("shipping");
  };

  // Handle shipping method form submission
  const handleShippingSubmit = async (data: ShipmentsFormData) => {
    const newFormData = {
      ...formData,
      shipping: data,
    } as CheckoutFormData;

    setFormData(newFormData);

    const shipments = Object.entries(data).map(
      ([id, shipmentFormData]) =>
        ({
          id: id,
          shipmentData: {
            rateId: shipmentFormData.rateId,
            providerId: shipmentFormData.providerId,
            priceInCents: shipmentFormData.priceInCents,
            pickupPointId: shipmentFormData.pickupPointId,
          },
        }) satisfies NonNullable<CheckoutUpdateParams["shipments"]>[number]
    );

    await storeClient.updateCheckout(clientSecret, checkoutId, {
      shipments,
    });

    setShippingCost(
      shipments.reduce(
        (acc, shipment) => acc + shipment.shipmentData.priceInCents,
        0
      )
    );
    setStep("payment");
  };

  // Navigate back to previous step
  const handleBack = () => {
    if (step === "customer") {
      window.location.replace(cancelUrl);
    }
    if (step === "shipping") setStep("customer");
    if (step === "payment") setStep("shipping");
  };

  const handleDoubleBack = () => {
    setStep("customer");
  };

  const renderStep = () => {
    if (step === "payment" && formData.customer && formData.shipping) {
      return (
        <PaymentForm
          paymentComponentKey={paymentComponentKey}
          locale={locale}
          fonts={fonts}
          checkoutAppearance={checkoutAppearance}
          paymentSecret={paymentSecret}
          onSuccess={onSuccess}
          onError={onError}
          onBack={handleBack}
          onDoubleBack={handleDoubleBack}
          contactEmail={formData.customer.email}
          address={formatAddress(formData.customer.address)}
          shippingFormData={formData.shipping}
          publicKey={publicKey}
        />
      );
    }

    if (step === "shipping" && formData.customer) {
      return (
        <ShippingMethodForm
          setFormData={setFormData}
          formData={formData}
          shippingRates={shippingRates}
          initialData={formData.shipping}
          onSubmit={handleShippingSubmit}
          onBack={handleBack}
          contactEmail={formData.customer.email}
          shippingAddress={formatAddress(formData.customer.address)}
          currency={currency}
          exchangeRate={exchangeRate}
          locale={locale}
          countryCode={formData.customer.address.countryCode}
          shipments={shipments}
        />
      );
    }

    return (
      <CustomerForm
        initialData={formData.customer}
        onSubmit={handleCustomerSubmit}
        clientProxy={clientProxy}
        clientSecret={clientSecret}
        latitude={latitude}
        longitude={longitude}
        currentAlpha3CountryCode={currentAlpha3CountryCode}
        locale={locale}
      />
    );
  };

  return <div className="relative h-max min-h-full w-full">{renderStep()}</div>;
}
