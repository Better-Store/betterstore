export type SortOrder = "asc" | "desc";
export type GetListParams<A, B> = {
  sortBy?: A;
  sortOrder?: SortOrder;
  query?: B & { NOT?: B | B[]; OR?: B[] };
};

export type EnumQueryType<T> = {
  equals?: T;
  in?: T[];
  not?: T;
  notIn?: T[];
};

export type StringArrayQueryType<T = string> = {
  equals?: T[];
  has?: T;
  hasEvery?: T[];
  hasSome?: T[];

  isEmpty?: boolean;
};

export type DateQueryType = {
  equals?: Date;
  in?: Date[];
  not?: Date;
  notIn?: Date[];

  gt?: Date;
  gte?: Date;
  lt?: Date;
  lte?: Date;
};

export type OptionalDateQueryType = DateQueryType & {
  isSet: boolean;
};

export type ArrayModelQueryType<T> = {
  some?: T;
  every?: T;
  none?: T;
};
