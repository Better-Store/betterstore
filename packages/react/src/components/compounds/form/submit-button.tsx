import { Button } from "@/react/components/ui/button";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

type SubmitButtonProps = Parameters<typeof Button>[0] & {
  isSubmitting: boolean;
  isValid: boolean;
};
export default function SubmitButton({
  isSubmitting,
  isValid = true,
  className,
  variant,
  children,
  size,
  ...props
}: SubmitButtonProps) {
  const { t } = useTranslation();
  return (
    <Button
      type="submit"
      size={size}
      className={className}
      variant={variant}
      disabled={isSubmitting || !isValid}
      {...props}
    >
      {isSubmitting && <Loader className="animate-spin" />}
      {isSubmitting ? t("CheckoutEmbed.loading") : children}
    </Button>
  );
}
