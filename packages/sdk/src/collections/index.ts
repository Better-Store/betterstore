import {
  ListCollectionsParams,
  ListCollectionsResponse,
  RetrieveCollectionParams,
  RetrieveCollectionResponse,
} from "@betterstore/bridge";
import { ApiError, createApiClient } from "../utils/axios";

class Collections {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list<T extends ListCollectionsParams>(
    params?: T
  ): Promise<ListCollectionsResponse<T>> {
    const data: ListCollectionsResponse<T> | ApiError =
      await this.apiClient.post(`/collections`, params);

    if (
      !data ||
      !Array.isArray(data) ||
      ("isError" in data && data.isError) ||
      !("collections" in data)
    ) {
      return {
        collections: [],
      };
    }

    return data;
  }

  async retrieve<T extends RetrieveCollectionParams>(
    params: T
  ): Promise<RetrieveCollectionResponse<T> | null> {
    const data: RetrieveCollectionResponse<T> | ApiError =
      await this.apiClient.post(`/collections/retrieve`, params);

    if (
      ("isError" in data && data.isError) ||
      !data ||
      !("id" in data) ||
      !("collection" in data)
    ) {
      console.error(`Collection not found`);
      return null;
    }

    return data;
  }
}

export default Collections;
