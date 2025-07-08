"use client";

import { CustomerFormData } from "@/react/components/checkout-embed/checkout-schema";
import InputGroup from "@/react/components/compounds/form/input-group";
import SelectGroup from "@/react/components/compounds/form/select-group";
import { cn } from "@/react/lib/utils";
import {
  AutosuggestAddressResult,
  createStoreClient,
  GeocodeAddressResult,
} from "@betterstore/sdk";
import { countries } from "country-data-list";
import { ChevronRight, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import CountryInput from "../country-input";

const stateOptions = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "Prague", label: "Prague" },
];

interface AddressInputProps {
  className?: string;
  proxy?: string;
  clientSecret: string;
  latitude?: number;
  longitude?: number;
  currentAlpha2CountryCode?: string;
}

export function AddressInput({
  className = "",
  proxy,
  clientSecret,
  latitude,
  longitude,
  currentAlpha2CountryCode,
}: AddressInputProps) {
  const storeClient = createStoreClient({ proxy });
  const form = useFormContext<CustomerFormData>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllInputs, setShowAllInputs] = useState(false);
  const [showApartmentField, setShowApartmentField] = useState(false);
  const [suggestions, setSuggestions] = useState<
    (AutosuggestAddressResult | GeocodeAddressResult)[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const addressInput = form.watch("address.line1") || "";
  const cityInput = form.watch("address.city") || "";

  useEffect(() => {
    if (!currentAlpha2CountryCode) return;

    const country = countries.all.find(
      (country) =>
        country.alpha2?.toLowerCase() ===
        currentAlpha2CountryCode?.toLowerCase()
    );

    if (country) {
      form.setValue("address.countryCode", country.alpha2);
      form.setValue("address.country", country.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAlpha2CountryCode]);

  useEffect(() => {
    if (!showAllInputs && addressInput.length > 2) {
      setIsLoading(true);

      const fetchSuggestions = async () => {
        try {
          const countryCode = countries.all.find(
            (country) => country.alpha2 === form.watch("address.countryCode")
          )?.alpha3;

          const results = await storeClient.getAutosuggestAddressResults(
            clientSecret,
            {
              query: addressInput,
              latitude: latitude?.toString(),
              longitude: longitude?.toString(),
              countryCode,
            }
          );
          console.log(results);

          setSuggestions(results);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
          setShowSuggestions(false);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
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

  const handleSelectAddress = (
    address: AutosuggestAddressResult | GeocodeAddressResult
  ) => {
    const isLookup = "line1" in address;

    if (!isLookup) {
      setIsLoading(true);
      storeClient
        .getGeocodeAddressResults(clientSecret, address)
        .then((results) => {
          console.log(results);
          setIsLoading(false);
          setShowSuggestions(false);
          setSuggestions(results);
        });
      return;
    }

    const geocodeAddress = address;
    form.setValue("address.line1", geocodeAddress.line1);
    form.setValue("address.line2", geocodeAddress.line2);
    form.setValue("address.city", geocodeAddress.city);
    form.setValue("address.province", geocodeAddress.province);
    form.setValue("address.provinceCode", geocodeAddress.provinceCode);
    form.setValue("address.zipCode", geocodeAddress.zipCode);

    setShowSuggestions(false);
    setShowAllInputs(true);
    setSuggestions([]);
  };

  const handleManualEntry = () => {
    setShowAllInputs(true);
  };

  useEffect(() => {
    setShowAllInputs(cityInput?.length > 0);
  }, [cityInput]);

  return (
    <div className={cn("space-y-5", className)}>
      <CountryInput prefix="address" label="Country" form={form} />

      {/* Address Search Field */}
      <div className="relative">
        <InputGroup
          name="address.line1"
          label={showAllInputs ? "Address" : "Start typing address"}
          required={showAllInputs}
          icon={<Search className="h-4 w-4" />}
          showIcon={!showAllInputs}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />

        {/* Suggestions Dropdown */}
        {!showAllInputs && (showSuggestions || isLoading) && (
          <div
            className="bg-background border-border absolute left-0 right-0 top-full z-50 mt-1 rounded-md border shadow-lg"
            data-dropdown="suggestions"
          >
            {isLoading ? (
              <div className="text-muted-foreground border-border border-b p-3 text-sm">
                Searching for addresses...
              </div>
            ) : suggestions.length > 0 ? (
              <>
                <div className="text-muted-foreground border-border border-b p-3 text-sm">
                  Keep typing address to display results
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {suggestions.map((address, index) => {
                    const isLookup = "line1" in address;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectAddress(address)}
                        className="hover:bg-accent border-border flex w-full cursor-pointer items-center border-b px-3 py-3 text-left transition-colors last:border-b-0"
                      >
                        <div className="text-foreground text-sm">
                          {address.title}
                        </div>
                        {!isLookup && (
                          <ChevronRight className="text-muted-foreground ml-auto size-4" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-muted-foreground border-border border-b p-3 text-sm">
                No addresses found
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
          Enter address manually
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
              form.setFocus("address.line2");
            }}
            className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 text-sm transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Company, C/O, Apt, Suite, Unit
          </button>
        </div>

        <div
          className={cn(
            !showApartmentField && "-mt-4 h-0 max-h-0 w-0 max-w-0 opacity-0"
          )}
        >
          <InputGroup
            name="address.line2"
            label="Company, C/O, Apt, Suite, Unit"
          />
        </div>

        {/* City, State, Postal Code Row - Always Present */}
        <div className="grid grid-cols-3 gap-4">
          <InputGroup name="address.city" label="City" required />
          <SelectGroup
            name="address.province"
            label="State"
            options={stateOptions}
            required
          />
          <InputGroup name="address.zipCode" label="Postal Code" required />
        </div>
      </div>
    </div>
  );
}
