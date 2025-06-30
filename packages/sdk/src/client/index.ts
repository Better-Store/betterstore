import {
  CheckoutSession,
  CheckoutUpdateParams,
  ShippingRate,
} from "../checkout/types";
import {
  CustomerCreateParams,
  Customer as CustomerType,
  CustomerUpdateParams,
} from "../customer/types";
import { ApiError, createApiClient } from "../utils/axios";

class Client {
  public proxy?: string;

  constructor(proxy?: string) {
    this.proxy = proxy;
  }

  /**
   * Retrieve a checkout session by ID
   */
  async retrieveCheckout(
    clientSecret: string,
    checkoutId: string
  ): Promise<CheckoutSession | null> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CheckoutSession | ApiError = await apiClient.get(
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
  async updateCheckout(
    clientSecret: string,
    checkoutId: string,
    params: CheckoutUpdateParams
  ): Promise<CheckoutSession | null> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CheckoutSession | ApiError = await apiClient.put(
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
    clientSecret: string,
    checkoutId: string,
    discountCode: string
  ): Promise<CheckoutSession> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CheckoutSession = await apiClient.post(
      `/checkout/${checkoutId}/discounts/apply`,
      { code: discountCode }
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      throw new Error("Failed to apply discount code");
    }

    return data;
  }

  /**
   * Remove a discount code from a checkout session
   */
  async removeDiscount(
    clientSecret: string,
    checkoutId: string,
    discountId: string
  ): Promise<CheckoutSession> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CheckoutSession = await apiClient.delete(
      `/checkout/${checkoutId}/discounts/${discountId}`
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      throw new Error("Failed to remove discount code");
    }

    return data;
  }

  /**
   * Revalidate a checkout session
   */
  async revalidateDiscounts(
    clientSecret: string,
    checkoutId: string
  ): Promise<CheckoutSession | null> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CheckoutSession | ApiError = await apiClient.get(
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
  async getCheckoutShippingRates(
    clientSecret: string,
    checkoutId: string
  ): Promise<ShippingRate[]> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: ShippingRate[] | ApiError = await apiClient.get(
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
  async generateCheckoutPaymentSecret(
    clientSecret: string,
    checkoutId: string
  ): Promise<{
    paymentSecret: string;
    publicKey: string;
    checkoutSession: CheckoutSession;
  }> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data:
      | {
          paymentSecret: string;
          publicKey: string;
          checkoutSession: CheckoutSession;
        }
      | ApiError = await apiClient.post(`/checkout/payment/${checkoutId}`);

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

  /**
   * Create a new customer
   */
  async createCustomer(
    clientSecret: string,
    params: CustomerCreateParams
  ): Promise<CustomerType> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CustomerType | ApiError = await apiClient.post(
      "/customer",
      params
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      throw new Error("Failed to create customer");
    }

    return data;
  }

  /**
   * Retrieve a customer by ID or email
   */
  async retrieveCustomer(
    clientSecret: string,
    idOrEmail: string
  ): Promise<CustomerType | null> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CustomerType | ApiError = await apiClient.get(
      `/customer/${idOrEmail}`
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Customer with id or email ${idOrEmail} not found`);
      return null;
    }

    return data;
  }

  /**
   * Update a customer
   */
  async updateCustomer(
    clientSecret: string,
    customerId: string,
    params: CustomerUpdateParams
  ): Promise<CustomerType | null> {
    const apiClient = createApiClient(clientSecret, this.proxy);
    const data: CustomerType | ApiError = await apiClient.put(
      `/customer/${customerId}`,
      params
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Customer with id ${customerId} not found`);
      return null;
    }

    return data;
  }
}

export default Client;
