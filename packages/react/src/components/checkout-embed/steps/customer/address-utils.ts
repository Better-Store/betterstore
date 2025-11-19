import { CustomerFormData } from "../../checkout-schema";

export const formatAddress = (address: CustomerFormData["address"]): string => {
  const parts = [address.line1, address.zipCode, address.country].filter(
    Boolean
  );

  return parts.join(", ");
};
