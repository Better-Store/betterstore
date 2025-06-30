import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";

export default function CheckoutFormLoading() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="md:col-span-2">
        <h2>{t("CheckoutEmbed.CustomerForm.title")}</h2>
      </div>

      <InputGroupLoading className="md:col-span-2" />
      <InputGroupLoading />
      <InputGroupLoading />
      <InputGroupLoading className="md:col-span-2" />
      <InputGroupLoading />

      <div className="flex justify-end pt-2 md:col-span-2">
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}

function InputGroupLoading({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <Skeleton className="h-3 w-10" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
