import { GetListParams } from "../_globals/types";
import { ProductWithoutVariants } from "../products/types";

export interface Collection {
  id: string;

  title: string;
  description?: string;
  images: string[];
  tags: string[];

  seoPageTitle?: string;
  seoDescription?: string;
  seoHandle?: string;
}

export interface CollectionWithProducts extends Collection {
  products: ProductWithoutVariants[];
}

export type ListCollectionsQuery = undefined;
export type ListCollectionsSortBy = "createdAt" | "updatedAt" | "title";

export type ListCollectionsParams = GetListParams<
  ListCollectionsSortBy,
  ListCollectionsQuery
>;

export type RetrieveCollectionParams =
  | {
      seoHandle: string;
    }
  | {
      id: string;
    };
