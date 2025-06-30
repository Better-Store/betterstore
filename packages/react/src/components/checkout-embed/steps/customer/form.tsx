import InputGroup from "@/react/components/compounds/form/input-group";
import SubmitButton from "@/react/components/compounds/form/submit-button";
import { Form } from "@/react/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type CustomerFormData, customerSchema } from "../../checkout-schema";
import AddressInput from "./address-input";

interface CustomerFormProps {
  initialData?: CustomerFormData;
  onSubmit: (data: CustomerFormData) => void;
}

export default function CustomerForm({
  initialData,
  onSubmit,
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
        state: "",
        zipCode: "",
        country: "United States",
      },
      phone: "",
    },
    mode: "onBlur",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-2"
      >
        <div className="md:col-span-2">
          <h2>{t("CheckoutEmbed.CustomerForm.title")}</h2>
        </div>

        <InputGroup
          className="md:col-span-2"
          name="email"
          label={t("CheckoutEmbed.CustomerForm.email")}
          placeholder={t("CheckoutEmbed.CustomerForm.emailPlaceholder")}
          type="email"
          autoComplete="email"
        />

        <InputGroup
          name="firstName"
          label={t("CheckoutEmbed.CustomerForm.firstName")}
          placeholder={t("CheckoutEmbed.CustomerForm.firstNamePlaceholder")}
          autoComplete="given-name"
        />

        <InputGroup
          name="lastName"
          label={t("CheckoutEmbed.CustomerForm.lastName")}
          placeholder={t("CheckoutEmbed.CustomerForm.lastNamePlaceholder")}
          autoComplete="family-name"
        />

        <AddressInput />

        <InputGroup
          name="phone"
          label={t("CheckoutEmbed.CustomerForm.phone")}
          placeholder={t("CheckoutEmbed.CustomerForm.phonePlaceholder")}
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
