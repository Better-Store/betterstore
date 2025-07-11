import { FloatingLabel } from "@/react/components/compounds/form/floating-label";
import SubmitButton from "@/react/components/compounds/form/submit-button";
import { Input } from "@/react/components/ui/input";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function DiscountCode({
  applyDiscountCode,
}: {
  applyDiscountCode: (code: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [discountCode, setDiscountCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const isValid = discountCode.length > 0;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await applyDiscountCode(discountCode);
      setDiscountCode("");

      toast.success(t("CheckoutEmbed.Summary.discountCodeSuccess"));
    } catch (error) {
      console.error(error);
      setError(t("CheckoutEmbed.Summary.discountCodeError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="pb-1" onSubmit={handleSubmit}>
      <div className="flex items-center gap-2">
        <div className="relative w-full">
          <FloatingLabel
            isFormLabel={false}
            value={discountCode}
            isFocused={isFocused}
          >
            {t("CheckoutEmbed.Summary.discountCodeLabel")}
          </FloatingLabel>
          <Input
            aria-invalid={!!error}
            value={discountCode}
            onChange={(e) => {
              setError("");
              setDiscountCode(e.target.value);
            }}
            name="discountCode"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <SubmitButton isSubmitting={isLoading} isValid={isValid} type="submit">
          {t("CheckoutEmbed.Summary.discountCodeApply")}
        </SubmitButton>
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </form>
  );
}
