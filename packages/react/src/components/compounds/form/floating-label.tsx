"use client";

import { FormLabel } from "@/react/components/ui/form";
import { Label } from "@/react/components/ui/label";
import { cn } from "@/react/lib/utils";
import * as React from "react";

const FloatingLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    isFocused?: boolean;
    value?: string;
    required?: boolean;
    isFormLabel?: boolean;
  }
>(
  (
    {
      className,
      isFocused,
      value,
      required,
      isFormLabel = true,
      children,
      ...props
    },
    ref
  ) => {
    const LabelComponent = isFormLabel ? FormLabel : Label;
    const isEmpty = !value || value.length === 0;
    const isFloating = isFocused || !isEmpty;

    return (
      <div
        className={cn(
          "pointer-events-none absolute translate-x-2",
          "z-10 block",
          "duration-200 ease-in-out",
          isFloating ? "top-0 -translate-y-1/2" : "top-1/2 -translate-y-1/2",
          className
        )}
      >
        <div className="bg-background absolute left-0 right-0 top-1/2 z-0 h-[2px] -translate-x-0 -translate-y-1/2" />
        <LabelComponent
          ref={ref}
          className={cn(
            "relative z-10 block",
            // "after:bg-background after:absolute after:left-0 after:right-0 after:top-1/2 after:z-0 after:h-px after:-translate-y-1/2 after:content-['']",
            "m-0 p-0 px-1 leading-none",
            "duration-200 ease-in-out",
            isFloating
              ? "text-xs font-medium"
              : "text-muted-foreground text-sm",
            {
              "text-xs font-medium": isFloating,
              "text-input": isFloating && !isFocused,
              "text-ring": isFloating && isFocused,
              "text-muted-foreground text-sm": !isFloating,
            },
            className
          )}
          {...props}
        >
          {children}
          {required && "*"}
        </LabelComponent>
      </div>
    );
  }
);
FloatingLabel.displayName = "FloatingLabel";

export { FloatingLabel };
