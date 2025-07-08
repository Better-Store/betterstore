import enRawCountries from "world_countries_lists/data/countries/en/countries.json";

export interface Country {
  name: string;
  alpha2: string;
  alpha3: string;
}

export const enCountries: Country[] = enRawCountries.map((c) => ({
  name: c.name,
  alpha2: c.alpha2.toUpperCase(),
  alpha3: c.alpha3.toUpperCase(),
}));

import csRawCountries from "world_countries_lists/data/countries/cs/countries.json";
import deRawCountries from "world_countries_lists/data/countries/de/countries.json";
import esRawCountries from "world_countries_lists/data/countries/es/countries.json";
import frRawCountries from "world_countries_lists/data/countries/fr/countries.json";
import itRawCountries from "world_countries_lists/data/countries/it/countries.json";
import plRawCountries from "world_countries_lists/data/countries/pl/countries.json";
import ptRawCountries from "world_countries_lists/data/countries/pt/countries.json";
import ruRawCountries from "world_countries_lists/data/countries/ru/countries.json";
import skRawCountries from "world_countries_lists/data/countries/sk/countries.json";

const rawCountries = {
  cs: csRawCountries,
  de: deRawCountries,
  es: esRawCountries,
  fr: frRawCountries,
  it: itRawCountries,
  pl: plRawCountries,
  pt: ptRawCountries,
  ru: ruRawCountries,
  sk: skRawCountries,
};

const allowedLocales = Object.keys(rawCountries);

export const getCountriesByLocale = (locale?: string) => {
  if (locale && allowedLocales.includes(locale)) {
    return rawCountries[locale as keyof typeof rawCountries].map((c) => ({
      name: c.name,
      alpha2: c.alpha2.toUpperCase(),
      alpha3: c.alpha3.toUpperCase(),
    }));
  }

  return enCountries;
};
