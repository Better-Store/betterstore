import { CheckoutLocale } from "@stripe/stripe-js";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import cs from "../locales/cs.json";
import en from "../locales/en.json";

export type Locale = CheckoutLocale;

const createI18nInstance = async (locale?: Locale) => {
  await i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      lng: locale,
      fallbackLng: "en",
      // debug: true,
      interpolation: { escapeValue: false },
      resources: {
        en: { translation: en },
        cs: { translation: cs },
      },
    });

  return i18n;
};

export default createI18nInstance;
