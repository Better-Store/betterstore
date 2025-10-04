export type FormatResponseForSDK<T extends object> = keyof T extends [
  string,
  string,
  ...string[],
]
  ? T
  : T[keyof T];
