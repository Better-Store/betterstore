import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/react/components/ui/form";
import { Input } from "@/react/components/ui/input";
import React from "react";
import { useFormContext } from "react-hook-form";

type InputGroupProps = {
  name: string;
  label?: string;
} & React.ComponentProps<typeof Input>;

export default function InputGroup({
  name,
  label,
  className,
  ...props
}: InputGroupProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} {...props} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
