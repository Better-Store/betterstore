import {
  ListCollectionsParams,
  ListCollectionsResponse,
  RetrieveCollectionParams,
  RetrieveCollectionResponse,
} from "@betterstore/bridge";
import { ApiError, createApiClient } from "../_utils/axios";
import { FormatParamsForSDK, FormatResponseForSDK } from "../_utils/helpers";

class Collections {
  private apiClient: ReturnType<typeof createApiClient>;

  constructor(apiKey: string, proxy?: string) {
    this.apiClient = createApiClient(apiKey, proxy);
  }

  async list<T extends ListCollectionsParams>(
    params?: FormatParamsForSDK<T, ListCollectionsParams>
  ): Promise<FormatResponseForSDK<ListCollectionsResponse<T>>> {
    const data: ListCollectionsResponse<T> | ApiError =
      await this.apiClient.post(`/collections`, params ?? {});

    if (
      !data ||
      !Array.isArray(data) ||
      ("isError" in data && data.isError) ||
      !("collections" in data)
    ) {
      return [];
    }

    return data.collections;
  }

  async retrieve<T extends RetrieveCollectionParams>(
    params: FormatParamsForSDK<T, RetrieveCollectionParams>
  ): Promise<FormatResponseForSDK<RetrieveCollectionResponse<T>> | null> {
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

    return data.collection;
  }
}

export default Collections;
