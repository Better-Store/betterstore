import { ApiError, createApiClient } from "../utils/axios";
import {
  Collection,
  CollectionWithProducts,
  ListCollectionsParams,
  RetrieveCollectionParams,
} from "./types";

class Collections {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list(params?: ListCollectionsParams): Promise<Collection[]> {
    const queryParams = new URLSearchParams();

    if (params) {
      queryParams.set("params", JSON.stringify(params));
    }

    const data: Collection[] | ApiError = await this.apiClient.get(
      `/collections?${queryParams.toString()}`
    );

    if (!data || !Array.isArray(data) || ("isError" in data && data.isError)) {
      return [];
    }

    return data;
  }

  async retrieve(
    params: RetrieveCollectionParams
  ): Promise<CollectionWithProducts | null> {
    if ("seoHandle" in params) {
      const data: CollectionWithProducts | ApiError = await this.apiClient.get(
        `/collections/${params.seoHandle}`
      );

      if (("isError" in data && data.isError) || !data || !("id" in data)) {
        console.error(
          `Collection with seoHandle ${params.seoHandle} not found`
        );
        return null;
      }

      return data;
    }

    const data: CollectionWithProducts | ApiError = await this.apiClient.get(
      `/collections/id/${params.id}`
    );

    if (("isError" in data && data.isError) || !data || !("id" in data)) {
      console.error(`Collection with id ${params.id} not found`);
      return null;
    }

    return data;
  }
}

export default Collections;
