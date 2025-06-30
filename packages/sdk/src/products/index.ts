import { ApiError, createApiClient } from "../utils/axios";
import {
  ListProductsParams,
  Product,
  ProductWithoutVariants,
  RetrieveProductParams,
} from "./types";

class Products {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list(params?: ListProductsParams): Promise<ProductWithoutVariants[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      queryParams.set("params", JSON.stringify(params));
    }

    const data: ProductWithoutVariants[] | ApiError = await this.apiClient.get(
      `/products?${queryParams.toString()}`
    );

    if (!data || !Array.isArray(data) || ("isError" in data && data.isError)) {
      return [];
    }

    return data;
  }

  async retrieve(params: RetrieveProductParams): Promise<Product | null> {
    if ("seoHandle" in params && typeof params?.seoHandle === "string") {
      const data: Product | ApiError = await this.apiClient.get(
        `/products/${params.seoHandle}`
      );

      if (("isError" in data && data.isError) || !data || !("id" in data)) {
        console.error(`Product with seoHandle ${params.seoHandle} not found`);
        return null;
      }

      return data;
    }

    if ("id" in params && typeof params?.id === "string") {
      const data: Product | ApiError = await this.apiClient.get(
        `/products/id/${params.id}`
      );

      if (("isError" in data && data.isError) || !data || !("id" in data)) {
        console.error(`Product with id ${params.id} not found`);
        return null;
      }

      return data;
    }

    return null;
  }
}

export default Products;
