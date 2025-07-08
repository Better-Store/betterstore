import { AddressInput } from "@/react/components/compounds/form/address-input";
import InputGroup from "@/react/components/compounds/form/input-group";
import SubmitButton from "@/react/components/compounds/form/submit-button";
import { Form } from "@/react/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type CustomerFormData, customerSchema } from "../../checkout-schema";

interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
  clientProxy?: string;
  clientSecret: string;
  latitude?: number;
  longitude?: number;
  currentAlpha3CountryCode?: string;
  locale?: string;
}

export default function CustomerForm({
  initialData,
  onSubmit,
  clientProxy,
  clientSecret,
  latitude,
  longitude,
  currentAlpha3CountryCode,
  locale,
}: CustomerFormProps) {
  const { t } = useTranslation();
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialData || {
      email: "",
      firstName: "",
      lastName: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        province: "",
        provinceCode: "",
        zipCode: "",
        country: "United States",
      },
      phone: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-5 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <h2>{t("CheckoutEmbed.CustomerForm.title")}</h2>
        </div>

        <InputGroup
          className="md:col-span-2"
          name="email"
          label={t("CheckoutEmbed.CustomerForm.email")}
          type="email"
          autoComplete="email"
        />

        <InputGroup
          name="firstName"
          label={t("CheckoutEmbed.CustomerForm.firstName")}
          autoComplete="given-name"
        />

        <InputGroup
          name="lastName"
          label={t("CheckoutEmbed.CustomerForm.lastName")}
          autoComplete="family-name"
        />

        <AddressInput
          className="md:col-span-2"
          proxy={clientProxy}
          clientSecret={clientSecret}
          latitude={latitude}
          longitude={longitude}
          currentAlpha3CountryCode={currentAlpha3CountryCode}
          locale={locale}
        />

        <InputGroup
          name="phone"
          label={t("CheckoutEmbed.CustomerForm.phone")}
          type="tel"
          autoComplete="tel"
        />

        <div className="flex justify-end pt-2 md:col-span-2">
          <SubmitButton
            isValid={form.formState.isValid}
            isSubmitting={form.formState.isSubmitting}
          >
            {t("CheckoutEmbed.CustomerForm.button")}
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}
