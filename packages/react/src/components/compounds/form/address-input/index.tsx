"use client";

import { CustomerFormData } from "@/react/components/checkout-embed/checkout-schema";
import CompoboxGroupProps from "@/react/components/compounds/form/compobox-group";
import InputGroup from "@/react/components/compounds/form/input-group";
import { cn } from "@/react/lib/utils";
import { AutosuggestAddressResult } from "@betterstore/bridge";
import { createStoreClient } from "@betterstore/sdk";
import { ArrowRight, Loader, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import CountryInput from "../country-input";
import { getCountriesByLocale } from "./country-data";
import { countriesWithProvinces, countryProvinces } from "./province-data";

interface AddressInputProps {
  className?: string;
  proxy?: string;
  clientSecret: string;
  latitude?: number;
  longitude?: number;
  currentAlpha3CountryCode?: string;
  locale?: string;
}

export function AddressInput({
  className = "",
  proxy,
  clientSecret,
  latitude,
  longitude,
  currentAlpha3CountryCode,
  locale,
}: AddressInputProps) {
  const { t } = useTranslation();
  const storeClient = createStoreClient({ proxy });
  const form = useFormContext<CustomerFormData>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllInputs, setShowAllInputs] = useState(false);
  const [showApartmentField, setShowApartmentField] = useState(false);
  const [suggestions, setSuggestions] = useState<AutosuggestAddressResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLookup, setIsLoadingLookup] = useState(false);

  const latestQueryRef = useRef<string>("");

  const addressInput = form.watch("address.line1") || "";
  const cityInput = form.watch("address.city") || "";
  const countryCodeInput = form.watch("address.countryCode");

  const countries = getCountriesByLocale(locale);

  const renderProvinceInput =
    countriesWithProvinces.includes(countryCodeInput) &&
    countryProvinces[countryCodeInput as keyof typeof countryProvinces]
      ?.length > 0;
  const availableProvinces = renderProvinceInput
    ? countryProvinces[countryCodeInput as keyof typeof countryProvinces]
    : [];

  useEffect(() => {
    if (cityInput) {
      setShowAllInputs(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentAlpha3CountryCode) return;

    const country = countries.find(
      (country) =>
        country.alpha3?.toLowerCase() ===
        currentAlpha3CountryCode?.toLowerCase()
    );

    if (country) {
      form.setValue("address.countryCode", country.alpha3);
      form.setValue("address.country", country.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAlpha3CountryCode]);

  useEffect(() => {
    if (!showAllInputs && addressInput.length > 2) {
      setIsLoading(true);

      latestQueryRef.current = addressInput;

      const fetchSuggestions = async () => {
        try {
          const countryCode = form.watch("address.countryCode");
          const results = await storeClient.getAutosuggestAddressResults(
            clientSecret,
            {
              query: addressInput,
              latitude: latitude?.toString(),
              longitude: longitude?.toString(),
              countryCode,
              locale,
            }
          );
          console.log(results);

          if (latestQueryRef.current === addressInput) {
            setSuggestions(results);
            setShowSuggestions(true);
          }
        } catch (error) {
          if (latestQueryRef.current === addressInput) {
            console.error("Error fetching address suggestions:", error);
            setShowSuggestions(false);
            setSuggestions([]);
          }
        } finally {
          if (latestQueryRef.current === addressInput) {
            setIsLoading(false);
          }
        }
      };

      fetchSuggestions();
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAllInputs, addressInput]);

  const handleSelectAddress = async (result: AutosuggestAddressResult) => {
    setIsLoadingLookup(true);

    try {
      const { address } = await storeClient.lookupAddress(clientSecret, {
        id: result.id,
        locale,
      });

      form.setValue("address.line1", address.line1);
      form.setValue("address.city", address.city);
      form.setValue("address.province", address.province);
      form.setValue("address.provinceCode", address.provinceCode);
      form.setValue("address.zipCode", address.zipCode);
    } catch (error) {
      console.error("Error looking up address:", error);
    } finally {
      setIsLoadingLookup(false);
      setShowSuggestions(false);
      setShowAllInputs(true);
      setSuggestions([]);
    }
  };

  const handleManualEntry = () => {
    setShowAllInputs(true);
    form.resetField("address.line1");
    form.resetField("address.line2");
    form.resetField("address.city");
    form.resetField("address.province");
    form.resetField("address.provinceCode");
    form.resetField("address.zipCode");
  };

  useEffect(() => {
    if (!showAllInputs) {
      setShowAllInputs(cityInput?.length > 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityInput]);

  return (
    <div className={cn("space-y-5", className)}>
      <CountryInput
        form={form}
        prefix="address"
        label={t("CheckoutEmbed.CustomerForm.address.country")}
        emptyText={t("CheckoutEmbed.CustomerForm.address.countryNoCountry")}
        searchText={t("CheckoutEmbed.CustomerForm.address.countrySearch")}
        locale={locale}
      />

      {/* Address Search Field */}
      <div className="relative">
        <InputGroup
          autoComplete="address-line1"
          name="address.line1"
          label={
            showAllInputs
              ? t("CheckoutEmbed.CustomerForm.address.line1")
              : t("CheckoutEmbed.CustomerForm.address.line1-autocomplete")
          }
          required={showAllInputs}
          icon={<Search className="h-4 w-4" />}
          showIcon={!showAllInputs}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />

        {/* Suggestions Dropdown */}
        {!showAllInputs &&
          (showSuggestions || isLoading || isLoadingLookup) && (
            <div
              className="bg-background border-border absolute left-0 right-0 top-full z-50 mt-1 rounded-md border shadow-lg"
              data-dropdown="suggestions"
            >
              {isLoading || isLoadingLookup ? (
                <div className="text-muted-foreground border-border flex gap-2 border-b p-3 text-sm">
                  {isLoadingLookup
                    ? t("CheckoutEmbed.CustomerForm.address.loadingLookup")
                    : t(
                        "CheckoutEmbed.CustomerForm.address.loadingSuggestions"
                      )}{" "}
                  <Loader className="size-4 animate-spin" />
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="text-muted-foreground border-border border-b p-3 text-sm">
                    {t("CheckoutEmbed.CustomerForm.address.keepTyping")}
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {suggestions.map((address, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={async () => await handleSelectAddress(address)}
                        className="hover:bg-accent border-border flex w-full cursor-pointer items-center border-b px-3 py-3 text-left transition-colors last:border-b-0"
                      >
                        <div className="text-foreground text-sm">
                          {address.title}
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={handleManualEntry}
                      className="hover:bg-accent border-border flex w-full cursor-pointer items-center border-b px-3 py-3 text-left transition-colors last:border-b-0"
                    >
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        {t("CheckoutEmbed.CustomerForm.address.enterManually")}{" "}
                        <ArrowRight className="size-4" />
                      </div>
                    </button>
                  </div>
                </>
              ) : addressInput.length <= 4 ? (
                <div className="text-muted-foreground border-border border-b p-3 text-sm">
                  {t("CheckoutEmbed.CustomerForm.address.keepTyping")}
                </div>
              ) : (
                <div className="text-muted-foreground border-border border-b p-3 text-sm">
                  {t("CheckoutEmbed.CustomerForm.address.noResults")}
                </div>
              )}
            </div>
          )}
      </div>

      {/* Manual Entry Link */}
      <div className={cn(!showAllInputs ? "-mt-2 mb-4 block" : "hidden")}>
        <button
          type="button"
          onClick={handleManualEntry}
          className="text-foreground hover:text-muted-foreground cursor-pointer text-[13px] underline"
        >
          {t("CheckoutEmbed.CustomerForm.address.enterManually")}
        </button>
      </div>

      {/* Always Present Address Fields - Hidden when not in manual entry */}
      <div
        className={cn(
          "space-y-4",
          !showAllInputs && "-mt-4 h-0 max-h-0 w-0 max-w-0 opacity-0"
        )}
      >
        {/* Add Company/Apartment Field */}
        <div className={cn(!showApartmentField ? "block" : "hidden")}>
          <button
            type="button"
            onClick={() => {
              setShowApartmentField(true);
              form.setValue("address.line2", "");
              form.setFocus("address.line2");
            }}
            className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("CheckoutEmbed.CustomerForm.address.addLine2")}
          </button>
        </div>

        <div
          className={cn(
            !showApartmentField && "-mt-4 h-0 max-h-0 w-0 max-w-0 opacity-0"
          )}
        >
          <InputGroup
            autoComplete="address-line2"
            name="address.line2"
            label={t("CheckoutEmbed.CustomerForm.address.line2")}
          />
        </div>

        {/* City, State, Postal Code Row - Always Present */}
        <div
          className={cn(
            "grid gap-4",
            renderProvinceInput ? "md:grid-cols-3" : "grid-cols-2"
          )}
        >
          <InputGroup name="address.city" label="City" required />
          {renderProvinceInput && (
            <CompoboxGroupProps
              form={form}
              name="address.provinceCode"
              label={t("CheckoutEmbed.CustomerForm.address.province")}
              options={availableProvinces.map((state) => ({
                value: state.code,
                label: state.name,
              }))}
              onSelect={(value) => {
                const provinceName = availableProvinces.find(
                  (state) => state.code === value
                )?.name;

                if (provinceName) {
                  form.setValue("address.province", provinceName);
                }
              }}
              searchText={t(
                "CheckoutEmbed.CustomerForm.address.provinceSearch"
              )}
              emptyText={t(
                "CheckoutEmbed.CustomerForm.address.provinceNoProvinces"
              )}
              required
            />
          )}
          <InputGroup
            autoComplete="postal-code"
            name="address.zipCode"
            label={t("CheckoutEmbed.CustomerForm.address.zipCode")}
            required
          />
        </div>
      </div>
    </div>
  );
}
