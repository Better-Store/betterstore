import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckoutFormData } from "./checkout-schema";

export type CheckoutStep = "customer" | "shipping" | "payment";

export interface FormStore {
  formData: Partial<CheckoutFormData>;
  setFormData: (formData: Partial<CheckoutFormData>) => void;
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;
  checkoutId: string;
  setCheckoutId: (checkoutId: string) => void;
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      formData: {},
      setFormData: (formData) => set({ formData }),
      step: "customer",
      setStep: (step) => set({ step }),
      checkoutId: "",
      setCheckoutId: (checkoutId) => set({ checkoutId }),
    }),
    { name: `checkout` }
  )
);

export const resetFormStore = (formData: Partial<CheckoutFormData>) => {
  const currentState = JSON.parse(localStorage.getItem("checkout") || "{}");

  localStorage.setItem(
    "checkout",
    JSON.stringify({
      ...currentState,
      state: {
        ...currentState.state,
        step: "customer",
        formData: { customer: formData.customer },
      },
    })
  );
};
