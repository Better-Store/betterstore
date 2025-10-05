import {
  ListProductsParams,
  ListProductsResponse,
  RetrieveProductParams,
  RetrieveProductResponse,
} from "@betterstore/bridge";
import { ApiError, createApiClient } from "../_utils/axios";
import { FormatParamsForSDK, FormatResponseForSDK } from "../_utils/helpers";

class Products {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list<T extends ListProductsParams>(
    params?: FormatParamsForSDK<T, ListProductsParams>
  ): Promise<FormatResponseForSDK<ListProductsResponse<T>>> {
    const data: ListProductsResponse<T> | ApiError = await this.apiClient.post(
      "/products",
      params ?? {}
    );

    if (
      !data ||
      !Array.isArray(data) ||
      ("isError" in data && data.isError) ||
      !("products" in data)
    ) {
      return [];
    }

    return data.products;
  }

  async retrieve<T extends RetrieveProductParams>(
    params: FormatParamsForSDK<T, RetrieveProductParams>
  ): Promise<FormatResponseForSDK<RetrieveProductResponse<T>> | null> {
    const data: RetrieveProductResponse<T> | ApiError =
      await this.apiClient.post("/products/retrieve", params);

    if (
      ("isError" in data && data.isError) ||
      !data ||
      !("id" in data) ||
      !("product" in data)
    ) {
      console.error(`Product not found`);
      return null;
    }

    return data.product;
  }
}

export default Products;
