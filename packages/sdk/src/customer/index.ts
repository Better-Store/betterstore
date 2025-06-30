import { ApiError, createApiClient } from "../utils/axios";
import {
  CustomerCreateParams,
  CustomerSubscription,
  CustomerSubscriptionUpdateParams,
  Customer as CustomerType,
  CustomerUpdateParams,
} from "./types";

class Customer {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  /**
   * Create a new customer
   */
  async create(params: CustomerCreateParams): Promise<CustomerType> {
    const data: CustomerType | ApiError = await this.apiClient.post(
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
  async retrieve(idOrEmail: string): Promise<CustomerType | null> {
    const data: CustomerType | ApiError = await this.apiClient.get(
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
  async update(
    customerId: string,
    params: CustomerUpdateParams
  ): Promise<CustomerType | null> {
    const data: CustomerType | ApiError = await this.apiClient.put(
      `/customer/${customerId}`,
      params
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Customer with id ${customerId} not found`);
      return null;
    }

    return data;
  }

  /**
   * Delete a customer
   */
  async delete(customerId: string): Promise<void> {
    await this.apiClient.delete(`/customer/${customerId}`);
  }

  /**
   * Update a customer subscription
   */
  async updateCustomerSubscription(
    stripeSubscriptionId: string,
    params: CustomerSubscriptionUpdateParams
  ): Promise<CustomerSubscription | null> {
    const data: CustomerSubscription = await this.apiClient.put(
      `/customer/subscription/${stripeSubscriptionId}`,
      params
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      return null;
    }

    return data;
  }
}

export default Customer;
