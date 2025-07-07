import React, { forwardRef, useCallback, useEffect, useState } from "react";

// shadcn
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/react/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/react/components/ui/popover";

import { cn } from "@/react/lib/utils";

import { CheckIcon, ChevronDown } from "lucide-react";

import { countries } from "country-data-list";

export interface Country {
  alpha2: string;
  alpha3: string;
  countryCallingCodes: string[];
  currencies: string[];
  emoji?: string;
  ioc: string;
  languages: string[];
  name: string;
  status: string;
}

// Dropdown props
interface CountryDropdownProps {
  options?: Country[];
  onChange?: (country: Country) => void;
  defaultValue?: string;
  disabled?: boolean;
  placeholder?: string;
  slim?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CountryDropdownComponent = (
  {
    options = countries.all.filter(
      (country: Country) =>
        country.emoji && country.status !== "deleted" && country.ioc !== "PRK"
    ),
    onChange,
    defaultValue,
    disabled = false,
    slim = false,
    ...props
  }: CountryDropdownProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) => {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
    undefined
  );

  useEffect(() => {
    if (!selectedCountry && defaultValue) {
      const initialCountry = options.find(
        (country) => country.name === defaultValue
      );
      if (initialCountry) {
        setSelectedCountry(initialCountry);
      }
    }
  }, [defaultValue, options, selectedCountry]);

  const handleSelect = useCallback(
    (country: Country) => {
      console.log("🌍 CountryDropdown value: ", country);
      setSelectedCountry(country);
      onChange?.(country);
      setOpen(false);
    },
    [onChange]
  );

  useEffect(() => {
    if (!selectedCountry && options[0]) {
      handleSelect(options[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        props.onOpenChange?.(open);
      }}
    >
      <PopoverTrigger
        ref={ref}
        className={cn(
          "border-input ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-[44px] w-full items-center justify-between whitespace-nowrap rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          slim === true && "w-20"
        )}
        disabled={disabled}
        {...props}
      >
        <div className="flex w-0 flex-grow items-center gap-2 overflow-hidden">
          {slim === false && (
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
              {(selectedCountry ?? options[0])?.name}
            </span>
          )}
        </div>
        <ChevronDown size={16} />
      </PopoverTrigger>
      <PopoverContent
        collisionPadding={10}
        side="bottom"
        className="min-w-[--radix-popper-anchor-width] p-0"
      >
        <Command className="max-h-[200px] w-full sm:max-h-[270px]">
          <CommandList>
            <div className="bg-popover sticky top-0 z-10">
              <CommandInput placeholder="Search country..." />
            </div>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.name)
                .map((option, key: number) => (
                  <CommandItem
                    className="flex w-full items-center gap-2"
                    key={key}
                    onSelect={() => handleSelect(option)}
                  >
                    <div className="flex w-0 flex-grow space-x-2 overflow-hidden">
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {option.name}
                      </span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0",
                        option.name === selectedCountry?.name
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

CountryDropdownComponent.displayName = "CountryDropdownComponent";

export const CountryDropdown = forwardRef(CountryDropdownComponent);
