import { Button } from "@/react/components/ui/button";
import { Skeleton } from "@/react/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function CheckoutSummaryLoading() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between">
        <div className="flex cursor-pointer items-center gap-2">
          <h2>{t("CheckoutEmbed.Summary.title")}</h2>
          <ChevronDown className="size-5 transition-transform md:hidden" />
        </div>

        <Skeleton className="h-[20px] w-20 md:hidden" />
        <Button className="max-sm:hidden" variant="link" size="link" asChild>
          <a>{t("CheckoutEmbed.Summary.edit")}</a>
        </Button>
      </div>

      <hr />

      <div className="hidden gap-2 md:grid">
        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.subtotal")}</p>
          <Skeleton className="h-[18px] w-20" />
        </div>

        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.shipping")}</p>
          <Skeleton className="h-[18px] w-20" />
        </div>

        <div className="flex items-center justify-between font-bold">
          <p>{t("CheckoutEmbed.Summary.total")}</p>
          <Skeleton className="h-[18px] w-24" />
        </div>
      </div>

      <hr className="hidden md:block" />

      <div>
        <Skeleton className="mb-2 h-5 w-24" />
        <Skeleton className="mb-1 h-10 w-full" />
      </div>

      <hr className="hidden md:block" />

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="hidden items-center md:flex">
          <Skeleton className="size-16 rounded-lg" />

          <div className="ml-4 grid flex-1 gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3.5 w-20" />
          </div>

          <div className="text-right">
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
