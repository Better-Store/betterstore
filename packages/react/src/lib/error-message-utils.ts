import en from "../locales/en.json";

type ErrorMessageKey = keyof typeof en.Errors;

const validErrorMessageKeys: ErrorMessageKey[] = Object.keys(
  en.Errors
) as ErrorMessageKey[];

export function validateErrorMessageKey(key: string): ErrorMessageKey {
  const validKey = validErrorMessageKeys.find((k) => k === key);

  if (!validKey) {
    return "unknown_error";
  }

  return validKey;
}
