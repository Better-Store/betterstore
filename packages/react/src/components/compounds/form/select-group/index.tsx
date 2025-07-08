"use client";

import { FloatingLabel } from "@/react/components/compounds/form/floating-label";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/react/components/ui/form";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectGroupProps = {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
  onChange?: (value: string) => void;
};

export default function SelectGroup({
  name,
  label,
  options,
  required = false,
  className = "",
  onChange,
}: SelectGroupProps) {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="relative">
            <FloatingLabel
              isFocused={open}
              value={field.value}
              required={required}
            >
              {label}
            </FloatingLabel>

            <Select
              onValueChange={(value) => {
                field.onChange(value);
                onChange?.(value);
                setOpen(false);
              }}
              open={open}
              onOpenChange={setOpen}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
