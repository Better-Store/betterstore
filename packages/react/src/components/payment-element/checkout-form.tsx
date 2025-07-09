import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { memo, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useCheckout } from "./useCheckout";

const CheckoutForm = ({
  onSuccess,
  onError,
  children,
  setSubmitting,
}: {
  onSuccess?: () => void;
  onError?: () => void;
  children: React.ReactNode;
  setSubmitting?: (isSubmitting: boolean) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { setIsSubmitting } = useCheckout();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updateRect = () => {
      if (containerRef.current) {
        setRect(containerRef.current.getBoundingClientRect());
      }
    };

    updateRect();

    window.addEventListener("resize", updateRect);

    return () => {
      window.removeEventListener("resize", updateRect);
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setSubmitting?.(true);
    setIsSubmitting(true);

    const response = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (response.error) {
      setErrorMessage(response.error.message || "Something went wrong.");
      setIsSubmitting(false);
      setSubmitting?.(false);
      onError?.();
    } else {
      setErrorMessage(undefined);
      setIsSubmitting(false);
      setSubmitting?.(false);
      onSuccess?.();
    }
  };

  return (
    <>
      <div>
        <div ref={containerRef} className="h-[310px] w-full sm:h-[230px]" />
        {errorMessage && (
          <p className="text-destructive -mb-2 mt-2 text-sm">{errorMessage}</p>
        )}
        <form className="w-full" onSubmit={handleSubmit}>
          {children}
        </form>
      </div>
      {ReactDOM.createPortal(
        <div
          style={{
            display: "block",
            zIndex: 20,
            position: "absolute",
            top: rect?.top,
            left: rect?.left,
            width: rect?.width,
            height: rect?.height,
          }}
        >
          <PaymentElement />
        </div>,
        document.body
      )}
    </>
  );
};

export default memo(CheckoutForm);
