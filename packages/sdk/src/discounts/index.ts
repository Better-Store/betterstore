import {
  ListDiscountsParams,
  ListDiscountsResponse,
  RetrieveDiscountParams,
  RetrieveDiscountResponse,
} from "@betterstore/bridge";
import { ApiError, createApiClient } from "../utils/axios";

class Discounts {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list<T extends ListDiscountsParams>(
    params?: T
  ): Promise<ListDiscountsResponse> {
    const data: ListDiscountsResponse | ApiError = await this.apiClient.post(
      "/discounts",
      params
    );

    if (
      !data ||
      !Array.isArray(data) ||
      ("isError" in data && data.isError) ||
      !("discounts" in data)
    ) {
      return {
        discounts: [],
      };
    }

    return data;
  }

  async retrieve<T extends RetrieveDiscountParams>(
    params: T
  ): Promise<RetrieveDiscountResponse | null> {
    const data: RetrieveDiscountResponse | ApiError = await this.apiClient.post(
      `/discounts/retrieve`,
      params
    );

    if (
      ("isError" in data && data.isError) ||
      !data ||
      !("id" in data) ||
      !("discount" in data)
    ) {
      console.error(`Discount not found`);
      return null;
    }

    return data;
  }
}

export default Discounts;
