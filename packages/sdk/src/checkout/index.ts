import { ApiError, createApiClient } from "../utils/axios";
import {
  CheckoutCreateParams,
  CheckoutSession,
  CheckoutUpdateParams,
  ShippingRate,
} from "./types";

class Checkout {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  /**
   * Create a new checkout session
   */
  async create(params: CheckoutCreateParams): Promise<CheckoutSession> {
    const data: CheckoutSession | ApiError = await this.apiClient.post(
      "/checkout",
      params
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      throw new Error("Failed to create checkout session");
    }

    return data;
  }

  /**
   * Retrieve a checkout session by ID
   */
  async retrieve(checkoutId: string): Promise<CheckoutSession | null> {
    const data: CheckoutSession | ApiError = await this.apiClient.get(
      `/checkout/${checkoutId}`
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Checkout session with id ${checkoutId} not found`);
      return null;
    }

    return data;
  }

  /**
   * Update a checkout session
   */
  async update(
    checkoutId: string,
    params: CheckoutUpdateParams
  ): Promise<CheckoutSession | null> {
    const data: CheckoutSession | ApiError = await this.apiClient.put(
      `/checkout/${checkoutId}`,
      params
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Checkout session with id ${checkoutId} not found`);
      return null;
    }

    return data;
  }

  /**
   * Apply a discount code to a checkout session
   */
  async applyDiscountCode(
    checkoutId: string,
    discountCode: string
  ): Promise<CheckoutSession> {
    const data: CheckoutSession | ApiError = await this.apiClient.post(
      `/checkout/${checkoutId}/discounts/apply`,
      { code: discountCode }
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      throw new Error("Failed to apply discount code");
    }

    return data;
  }

  /**
   * Remove a discount  from a checkout session
   */
  async removeDiscount(
    checkoutId: string,
    discountId: string
  ): Promise<CheckoutSession | null> {
    const data: CheckoutSession | ApiError = await this.apiClient.delete(
      `/checkout/${checkoutId}/discounts/${discountId}`
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Checkout session with id ${checkoutId} not found`);
      return null;
    }

    return data;
  }

  /**
   * Revalidate a checkout session
   */
  async revalidateDiscounts(
    checkoutId: string
  ): Promise<CheckoutSession | null> {
    const data: CheckoutSession | ApiError = await this.apiClient.get(
      `/checkout/${checkoutId}/discounts/revalidate`
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Checkout session with id ${checkoutId} not found`);
      return null;
    }

    return data;
  }

  /**
   * Get shipping rates for a checkout session
   */
  async getShippingRates(checkoutId: string): Promise<ShippingRate[]> {
    const data: ShippingRate[] | ApiError = await this.apiClient.get(
      `/checkout/shipping/${checkoutId}`
    );

    if (("isError" in data && data.isError) || !data || !Array.isArray(data)) {
      return [];
    }

    return data;
  }

  /**
   * Generate payment secret for a checkout session
   */
  async generatePaymentSecret(checkoutId: string): Promise<{
    paymentSecret: string;
    publicKey: string;
    checkoutSession: CheckoutSession;
  }> {
    const data:
      | {
          paymentSecret: string;
          publicKey: string;
          checkoutSession: CheckoutSession;
        }
      | ApiError = await this.apiClient.post(`
      /checkout/payment/${checkoutId}`);

    if (
      ("isError" in data && data.isError) ||
      !data ||
      !("paymentSecret" in data)
    ) {
      throw new Error("Failed to generate payment secret");
    }

    return {
      paymentSecret: data.paymentSecret,
      publicKey: data.publicKey,
      checkoutSession: data.checkoutSession,
    };
  }
}

export default Checkout;
