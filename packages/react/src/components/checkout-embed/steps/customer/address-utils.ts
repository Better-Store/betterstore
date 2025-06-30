import { CustomerFormData } from "../../checkout-schema";

export const formatAddress = (address: CustomerFormData["address"]): string => {
  const partWithoutComma = [address.state, address.zipCode]
    .filter(Boolean)
    .join(" ");

  const parts = [
    address.line1,
    address.line2,
    address.city,
    partWithoutComma,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
};
