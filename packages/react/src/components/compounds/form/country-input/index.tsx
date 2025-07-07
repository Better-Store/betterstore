import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/react/components/ui/form";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FloatingLabel } from "../floating-label";
import { CountryDropdown } from "./dropdown";

type InputGroupProps = {
  prefix?: string;
  label?: string;
  className?: string;
} & Omit<React.ComponentProps<typeof CountryDropdown>, "placeholder">;

export default function CountryInput({
  prefix,
  label,
  className,
  ...props
}: InputGroupProps) {
  const countryInputName = prefix ? `${prefix}.country` : "country";
  const countryCodeInputName = prefix ? `${prefix}.countryCode` : "countryCode";
  const [open, setOpen] = useState(false);
  const { control, setValue } = useFormContext();

  return (
    <FormField
      control={control}
      name={countryCodeInputName}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="relative">
            <FloatingLabel value={field.value} isFocused={open} required={true}>
              {label}
            </FloatingLabel>
            <FormControl>
              <CountryDropdown
                {...field}
                {...props}
                onOpenChange={setOpen}
                onChange={(country) => {
                  setValue(countryInputName, country.name);
                  field.onChange(country.alpha2);
                }}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
