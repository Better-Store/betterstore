import {
  DefaultLineItemCreateProductType,
  LineItemCreate as SDKLineItemCreate,
} from "@betterstore/bridge";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LineItemOptionalParams = {
  quantity?: number;
  variantOptions?: { name: string; value: string }[];
  metadata?: Record<string, any>;
};

export interface CartLineItem<
  ProductType extends
    DefaultLineItemCreateProductType = DefaultLineItemCreateProductType,
> extends Pick<
    SDKLineItemCreate<ProductType>,
    "metadata" | "quantity" | "variantOptions" | "productId" | "product"
  > {
  id: string;
  selectedVariant: NonNullable<
    NonNullable<ProductType["productVariants"]>[number]
  > | null;
}

export interface Cart<
  ProductType extends
    DefaultLineItemCreateProductType = DefaultLineItemCreateProductType,
> {
  lineItems: CartLineItem<ProductType>[];
  addItem: (
    product: ProductType,
    additionalParams?: LineItemOptionalParams
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  clearCart: () => void;
}

const generateLineItemId = (
  item: LineItemOptionalParams & { productId: string }
): string => {
  return btoa(
    JSON.stringify({
      productId: item.productId,
      variantOptions: item.variantOptions,
      metadata: item.metadata,
    })
  );
};

const createCartStore = <
  ProductType extends
    DefaultLineItemCreateProductType = DefaultLineItemCreateProductType,
>() =>
  create<Cart<ProductType>>()(
    persist(
      (set, get) => ({
        lineItems: [],

        addItem: (product, additionalParams) =>
          set((state) => {
            const productId = product.id;
            const selectedVariant: NonNullable<
              NonNullable<ProductType["productVariants"]>[number]
            > | null =
              (product.productVariants ?? []).find((v) =>
                v.variantOptions?.every((vOpt) =>
                  additionalParams?.variantOptions?.some(
                    (iOpt) =>
                      vOpt.name === iOpt.name && vOpt.value === iOpt.value
                  )
                )
              ) || null;
            const formattedNewItem = {
              productId: productId,
              product: product,
              quantity: additionalParams?.quantity ?? 1,
              selectedVariant,
              variantOptions: additionalParams?.variantOptions ?? [],
              metadata: additionalParams?.metadata,
            } satisfies Omit<CartLineItem<ProductType>, "id">;

            const id = generateLineItemId(formattedNewItem);
            const existingItemIndex = state.lineItems.findIndex(
              (item) => item.id === id
            );

            if (existingItemIndex !== -1) {
              const updatedItems = [...state.lineItems];
              updatedItems[existingItemIndex] = {
                ...updatedItems[existingItemIndex]!,
                quantity:
                  updatedItems[existingItemIndex]!.quantity +
                  formattedNewItem.quantity,
              };
              return { lineItems: updatedItems };
            }

            return {
              lineItems: [...state.lineItems, { ...formattedNewItem, id }],
            };
          }),

        removeItem: (id) =>
          set((state) => ({
            lineItems: state.lineItems.filter((i) => i.id !== id),
          })),

        updateQuantity: (id, quantity) =>
          set((state) => ({
            lineItems: state.lineItems.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          })),

        getProductQuantity: (productId: string) => {
          const items = get().lineItems.filter(
            (item) => item.productId === productId
          );
          return items.reduce((acc, item) => acc + item.quantity, 0);
        },

        clearCart: () => set({ lineItems: [] }),
      }),
      {
        name: "cart",
      }
    )
  );

export const useCart = <
  ProductType extends
    DefaultLineItemCreateProductType = DefaultLineItemCreateProductType,
>() => createCartStore<ProductType>()();
