import { RetrieveDiscountResponse } from "@betterstore/bridge";

export type Discount = NonNullable<RetrieveDiscountResponse["discount"]>;

function getHighestDiscount(
  productId: string,
  priceInCents: number,
  discounts: Discount[]
) {
  const applicableDiscounts = discounts.filter((discount) =>
    discount.allowedProductIDs.includes(productId)
  );
  const bestDiscount =
    applicableDiscounts.length > 1
      ? applicableDiscounts.reduce((bestSoFar, currentDiscount) => {
          let currentDiscountValueInCents = currentDiscount.value;
          if (currentDiscount.valueType === "PERCENTAGE") {
            currentDiscountValueInCents =
              (currentDiscount.value / 100) * priceInCents;
          } else if (currentDiscount.valueType === "FREE") {
            currentDiscountValueInCents = priceInCents;
          }
          return (bestSoFar?.value ?? 0) > currentDiscountValueInCents
            ? bestSoFar
            : currentDiscount;
        }, applicableDiscounts[0])
      : applicableDiscounts[0];

  return bestDiscount;
}

function calculateDiscountAmount(originalPrice: number, discount?: Discount) {
  let discountValueInCents = discount?.value;
  const isFreeDiscount = discount?.valueType === "FREE";

  if (discount?.valueType === "PERCENTAGE") {
    discountValueInCents = (discount.value / 100) * originalPrice;
  } else if (discount?.valueType === "FREE") {
    discountValueInCents = originalPrice;
  }

  const finalPrice = discountValueInCents
    ? Math.max(originalPrice - discountValueInCents, 0)
    : originalPrice;

  const isDiscounted = discountValueInCents === 0;

  return {
    finalPrice,
    discountAmount: discountValueInCents,
    originalPrice,
    isFree: isFreeDiscount,
    isDiscounted,
  };
}

export function findAutomaticProductDiscount({
  productId,
  priceInCents,
  discounts,
}: {
  productId: string;
  priceInCents: number;
  discounts: Discount[];
}) {
  const discount = getHighestDiscount(productId, priceInCents, discounts);
  const result = calculateDiscountAmount(priceInCents, discount);

  return result;
}
