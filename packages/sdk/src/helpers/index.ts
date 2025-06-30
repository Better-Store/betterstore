import { createApiClient } from "../utils/axios";

const currencyLocales: Record<string, string> = {
  CZK: "cs-CZ", // Czech Koruna
  USD: "en-US", // US Dollar
  EUR: "de-DE", // Euro (Germany locale)
  GBP: "en-GB", // British Pound
  JPY: "ja-JP", // Japanese Yen
  AUD: "en-AU", // Australian Dollar
  CAD: "en-CA", // Canadian Dollar
  NZD: "en-NZ", // New Zealand Dollar
  SEK: "sv-SE", // Swedish Krona
  NOK: "nb-NO", // Norwegian Krone
  DKK: "da-DK", // Danish Krone
  CHF: "de-CH", // Swiss Franc (German Switzerland)
  HUF: "hu-HU", // Hungarian Forint
  PLN: "pl-PL", // Polish Zloty
  BGN: "bg-BG", // Bulgarian Lev
  RON: "ro-RO", // Romanian Leu
  RUB: "ru-RU", // Russian Ruble
  CNY: "zh-CN", // Chinese Yuan
  INR: "en-IN", // Indian Rupee
  BRL: "pt-BR", // Brazilian Real
  MXN: "es-MX", // Mexican Peso
  ZAR: "en-ZA", // South African Rand
  KRW: "ko-KR", // South Korean Won
  MYR: "ms-MY", // Malaysian Ringgit
  SGD: "en-SG", // Singapore Dollar
  TWD: "zh-TW", // Taiwanese Dollar
  THB: "th-TH", // Thai Baht
  IDR: "id-ID", // Indonesian Rupiah
  AED: "ar-AE", // UAE Dirham
  SAR: "ar-SA", // Saudi Riyal
  TRY: "tr-TR", // Turkish Lira
};

class Helpers {
  public proxy?: string;

  constructor(proxy?: string) {
    this.proxy = proxy;
  }

  formatCurrency(currency: string): string {
    const locale = currencyLocales[currency.toUpperCase()] ?? undefined;

    const formattedCurrency = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
    });

    return formattedCurrency
      .format(0)
      .replace(/[\d.,\s]/g, "")
      .trim();
  }

  formatPrice(
    priceInCents: number,
    currency: string,
    exchangeRate?: number | null
  ): string {
    const amount = (priceInCents / 100) * (exchangeRate ?? 1);
    const isWhole = amount % 1 === 0;

    const locale = currencyLocales[currency.toUpperCase()] ?? undefined;

    const formattedPrice = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: isWhole ? 0 : 2,
      maximumFractionDigits: isWhole ? 0 : 2,
    }).format(amount);

    return formattedPrice;
  }

  async getExchangeRate(
    baseCurrency: string,
    targetCurrency: string
  ): Promise<number> {
    const apiClient = createApiClient("", this.proxy);
    const { data } = await apiClient.get(`/helpers/rates/${baseCurrency}`);

    const rate = data.rates[targetCurrency];

    if (!rate) {
      throw new Error("Could not get exchange rate for target currency");
    }

    return rate;
  }
}

export default Helpers;
