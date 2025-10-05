export type FormatResponseForSDK<T extends object> = keyof T extends [
  string,
  string,
  ...string[],
]
  ? T
  : T[keyof T];

export type FormatParamsForSDK<GenericType, ConstraintType> = GenericType &
  Record<Exclude<keyof GenericType, keyof ConstraintType>, never>;
