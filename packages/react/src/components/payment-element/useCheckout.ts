import { create } from "zustand";

interface CheckoutStore {
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
}

export const useCheckout = create<CheckoutStore>((set) => ({
  isSubmitting: false,
  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
}));
