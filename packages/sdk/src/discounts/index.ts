import {
  ListDiscountsParams,
  ListDiscountsResponse,
  RetrieveDiscountParams,
  RetrieveDiscountResponse,
} from "@betterstore/bridge";
import { FormatResponseForSDK } from "../_utils/helpers";
import { ApiError, createApiClient } from "../utils/axios";

class Discounts {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list<T extends ListDiscountsParams>(
    params?: T
  ): Promise<FormatResponseForSDK<ListDiscountsResponse>> {
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
      return [];
    }

    return data.discounts;
  }

  async retrieve<T extends RetrieveDiscountParams>(
    params: T
  ): Promise<FormatResponseForSDK<RetrieveDiscountResponse> | null> {
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

    return data.discount;
  }
}

export default Discounts;
