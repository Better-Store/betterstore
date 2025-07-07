import { cn } from "@/react/lib/utils";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";

export default function CheckoutFormLoading() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2>{t("CheckoutEmbed.CustomerForm.title")}</h2>
      </div>

      <InputGroupLoading className="md:col-span-2" />
      <InputGroupLoading />
      <InputGroupLoading />
      <InputGroupLoading className="md:col-span-2" />
      <InputGroupLoading className="md:col-span-2" />
      <div className="-mt-1 md:col-span-2">
        <Skeleton className="h-4 w-32" />
      </div>
      <InputGroupLoading />
    </div>
  );
}

function InputGroupLoading({ className }: { className?: string }) {
  return <Skeleton className={cn("h-[44px] w-full", className)} />;
}
