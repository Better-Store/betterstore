import { create } from "zustand";

type PaymentMethodType =
  | "apple_pay"
  | "card"
  | "paypal"
  | "google_pay"
  | string
  | null;

interface CheckoutStore {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  paymentMethod: PaymentMethodType;
  setPaymentMethod: (paymentMethod: PaymentMethodType) => void;
}

export const useCheckout = create<CheckoutStore>((set) => ({
  isSubmitting: false,
  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
  paymentMethod: null,
  setPaymentMethod: (paymentMethod: PaymentMethodType) =>
    set({ paymentMethod }),
}));
