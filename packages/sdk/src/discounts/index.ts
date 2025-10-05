import {
  ListDiscountsParams,
  ListDiscountsResponse,
  RetrieveDiscountParams,
  RetrieveDiscountResponse,
} from "@betterstore/bridge";
import { ApiError, createApiClient } from "../_utils/axios";
import { FormatParamsForSDK, FormatResponseForSDK } from "../_utils/helpers";

class Discounts {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list<T extends ListDiscountsParams>(
    params?: FormatParamsForSDK<T, ListDiscountsParams>
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
    params: FormatParamsForSDK<T, RetrieveDiscountParams>
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
