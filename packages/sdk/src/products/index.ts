import {
  ListProductsParams,
  ListProductsResponse,
  RetrieveProductParams,
  RetrieveProductResponse,
} from "@betterstore/bridge";
import { ApiError, createApiClient } from "../utils/axios";

class Products {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list<T extends ListProductsParams>(
    params?: T
  ): Promise<ListProductsResponse<T>> {
    const data: ListProductsResponse<T> | ApiError = await this.apiClient.post(
      "/products",
      params
    );

    if (
      !data ||
      !Array.isArray(data) ||
      ("isError" in data && data.isError) ||
      !("products" in data)
    ) {
      return {
        products: [],
      };
    }

    return data;
  }

  async retrieve<T extends RetrieveProductParams>(
    params: T
  ): Promise<RetrieveProductResponse<T> | null> {
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

    return data;
  }
}

export default Products;
