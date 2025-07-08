import React from "react";
import { getCountriesByLocale } from "../address-input/country-data";
import CompoboxGroupProps from "../compobox-group";

type InputGroupProps = {
  locale?: string;
  prefix?: string;
  label?: string;
  className?: string;
} & Omit<
  React.ComponentProps<typeof CompoboxGroupProps>,
  "name" | "options" | "searchText" | "emptyText"
>;

export default function CountryInput({
  form,
  prefix,
  label,
  locale,
  ...props
}: InputGroupProps) {
  const countryInputName = prefix ? `${prefix}.country` : "country";
  const countryCodeInputName = prefix ? `${prefix}.countryCode` : "countryCode";
  const countries = getCountriesByLocale(locale);

  return (
    <CompoboxGroupProps
      {...props}
      form={form}
      name={countryCodeInputName}
      label={label}
      options={countries.map((state) => ({
        value: state.alpha3,
        label: state.name,
      }))}
      onSelect={(value) => {
        const countryName = countries.find(
          (state) => state.alpha3 === value
        )?.name;

        if (countryName) {
          form.setValue(countryInputName, countryName);
        }
      }}
      searchText="Search countries..."
      emptyText="No countries found."
      required
    />
  );
}
