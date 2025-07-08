"use client";

import { FloatingLabel } from "@/react/components/compounds/form/floating-label";
import { Button } from "@/react/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/react/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/react/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/react/components/ui/popover";
import { cn } from "@/react/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

type CompoboxGroupProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  options: { value: string; label: string }[];
  searchText: string;
  emptyText: string;
  required?: boolean;
  className?: string;
  onSelect?: (value: string) => void;
};

export default function CompoboxGroup({
  form,
  name,
  label,
  options,
  searchText,
  emptyText,
  required = false,
  className = "",
  onSelect,
}: CompoboxGroupProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
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

            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <span>
                      {
                        options.find((option) => option.value === field.value)
                          ?.label
                      }
                    </span>
                    <ChevronDown size={16} />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                collisionPadding={10}
                side="bottom"
                className="p-0"
              >
                <Command>
                  <CommandInput placeholder={searchText} className="h-9" />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {options.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue(name, language.value);
                            onSelect?.(language.value);
                            setOpen(false);
                          }}
                        >
                          {language.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              language.value === field.value
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
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
