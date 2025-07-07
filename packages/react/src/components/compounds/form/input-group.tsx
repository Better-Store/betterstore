import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/react/components/ui/form";
import { Input } from "@/react/components/ui/input";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FloatingLabel } from "./floating-label";

type InputGroupProps = {
  name: string;
  label?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
} & Omit<React.ComponentProps<typeof Input>, "placeholder">;

export default function InputGroup({
  name,
  label,
  className,
  icon,
  showIcon = true,
  ...props
}: InputGroupProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="relative">
            <FloatingLabel
              value={field.value}
              isFocused={isFocused}
              required={props.required}
            >
              {label}
            </FloatingLabel>
            <FormControl>
              <Input
                {...field}
                {...props}
                onFocus={(e) => {
                  setIsFocused(true);
                  props.onFocus?.(e);
                }}
                onBlur={(e) => {
                  setIsFocused(false);
                  props.onBlur?.(e);
                }}
              />
            </FormControl>
            {icon && showIcon && (
              <div className="text-muted-foreground absolute right-0 top-1/2 -translate-x-3 -translate-y-1/2">
                {icon}
              </div>
            )}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
