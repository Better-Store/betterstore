"use client";

import { CountryDropdown } from "@/react/components/compounds/form/country-dropdown";
import InputGroup from "@/react/components/compounds/form/input-group";
import { Button } from "@/react/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/react/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/react/components/ui/form";
import { Input } from "@/react/components/ui/input";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formatAddress } from "./address-utils";

export default function AddressInput() {
  const { t } = useTranslation();
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const currentValue = form.watch("address");

  const handleSave = useCallback(async () => {
    if (isValidating) return;

    setIsValidating(true);
    try {
      const isValid = await form.trigger("address");

      if (!isValid) {
        form.setError("address", {
          message: "invalid_address",
          type: "custom",
        });
        return;
      }

      const newAddress = form.getValues("address");
      form.setValue("address", newAddress, { shouldValidate: false });
      setOpen(false);
    } finally {
      setIsValidating(false);
    }
  }, [form, isValidating]);

  useEffect(() => {
    if (open) return;

    const isAddressInvalid = form.getFieldState("address").invalid;
    if (isAddressInvalid) {
      form.setError("address", {
        message: "invalid_address",
        type: "custom",
      });
    } else {
      form.clearErrors("address");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div className="w-full md:col-span-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="relative grid gap-2">
            <FormField
              control={form.control}
              name="address"
              render={() => (
                <FormItem>
                  <FormLabel>
                    {t("CheckoutEmbed.CustomerForm.address.address")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t(
                        "CheckoutEmbed.CustomerForm.address.addressPlaceholder"
                      )}
                      value={
                        currentValue?.line1 ? formatAddress(currentValue) : ""
                      }
                      readOnly
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="transform-none! sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t("CheckoutEmbed.CustomerForm.address.title")}
            </DialogTitle>
            <DialogDescription>
              {t("CheckoutEmbed.CustomerForm.address.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              className="col-span-2"
              name="address.line1"
              label={t("CheckoutEmbed.CustomerForm.address.line1")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.line1Placeholder"
              )}
              autoComplete="address-line1"
            />
            <InputGroup
              className="col-span-2"
              name="address.line2"
              label={t("CheckoutEmbed.CustomerForm.address.line2")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.line2Placeholder"
              )}
              autoComplete="address-line2"
            />

            <InputGroup
              name="address.city"
              label={t("CheckoutEmbed.CustomerForm.address.city")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.cityPlaceholder"
              )}
              autoComplete="address-level2"
            />
            <InputGroup
              name="address.state"
              label={t("CheckoutEmbed.CustomerForm.address.state")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.statePlaceholder"
              )}
              autoComplete="address-level1"
            />

            <InputGroup
              name="address.zipCode"
              label={t("CheckoutEmbed.CustomerForm.address.zipCode")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.zipCodePlaceholder"
              )}
              autoComplete="postal-code"
            />
            <FormField
              control={form.control}
              name="address.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("CheckoutEmbed.CustomerForm.address.country")}
                  </FormLabel>
                  <CountryDropdown
                    placeholder={t(
                      "CheckoutEmbed.CustomerForm.address.countryPlaceholder"
                    )}
                    defaultValue={field.value}
                    onChange={(country) => {
                      field.onChange(country.name);
                      form.setValue("address.countryCode", country.alpha2);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleSave} type="button" disabled={isValidating}>
              {t("CheckoutEmbed.CustomerForm.address.button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
