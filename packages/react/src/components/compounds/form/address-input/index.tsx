"use client";

import { CustomerFormData } from "@/react/components/checkout-embed/checkout-schema";
import { formatAddress } from "@/react/components/checkout-embed/steps/customer/address-utils";
import InputGroup from "@/react/components/compounds/form/input-group";
import SelectGroup from "@/react/components/compounds/form/select-group";
import { storeHelpers } from "@/react/lib/betterstore";
import { cn } from "@/react/lib/utils";
import { AutocompleteAddressResult } from "@betterstore/sdk";
import { Plus, Search } from "lucide-react";
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
}

export function AddressInput({ className = "" }: AddressInputProps) {
  const { watch, setValue, setFocus } = useFormContext<CustomerFormData>();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAllInputs, setShowAllInputs] = useState(false);
  const [showApartmentField, setShowApartmentField] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteAddressResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const addressInput = watch("address.line1") || "";
  const cityInput = watch("address.city") || "";

  useEffect(() => {
    if (!showAllInputs && addressInput.length > 0) {
      setIsLoading(true);

      const fetchSuggestions = async () => {
        try {
          const results =
            await storeHelpers.getAutocompleteAddressResults(addressInput);
          setShowSuggestions(results.length > 0);
          setSuggestions(results);
          console.log(results);
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
  }, [showAllInputs, addressInput]);

  const handleSelectAddress = (address: AutocompleteAddressResult) => {
    // Set all address fields from the selected address
    setValue("address.line1", address.line1);
    setValue("address.city", address.city);
    setValue("address.country", address.country);
    setValue("address.countryCode", address.countryCode);
    setValue("address.province", address.province);
    setValue("address.provinceCode", address.provinceCode);
    setValue("address.zipCode", address.zipCode);
    setShowSuggestions(false);
  };

  const handleManualEntry = () => {
    setShowAllInputs(true);
  };

  useEffect(() => {
    setShowAllInputs(cityInput?.length > 0);
  }, [cityInput]);

  return (
    <div className={cn("space-y-4", className)}>
      <CountryInput prefix="address" label="Country" />

      {/* Address Search Field */}
      <div className="relative">
        <InputGroup
          name="address.line1"
          label={showAllInputs ? "Address" : "Start typing address"}
          required={showAllInputs}
          icon={<Search className="h-4 w-4" />}
          showIcon={!showAllInputs}
        />

        {/* Suggestions Dropdown */}
        {!showAllInputs && (showSuggestions || isLoading) && (
          <div className="bg-background border-border absolute left-0 right-0 top-full z-50 mt-1 rounded-md border shadow-lg">
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
                  {suggestions.map((address, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAddress(address)}
                      className="hover:bg-accent border-border flex w-full items-center border-b px-3 py-3 text-left transition-colors last:border-b-0"
                    >
                      <div className="text-foreground text-sm">
                        {formatAddress(address)}
                      </div>
                    </button>
                  ))}
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
      <div className={cn(!showAllInputs ? "-mt-1 block" : "hidden")}>
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
              setFocus("address.line2");
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
