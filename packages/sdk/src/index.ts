import Auth from "./auth";
import Checkout from "./checkout";
import Client from "./client";
import Collections from "./collections";
import Customer from "./customer";
import Discounts from "./discounts";
import Helpers from "./helpers";
import Products from "./products";

export default function createBetterStore(config: {
  apiKey: string;
  proxy?: string;
}) {
  if (!config.apiKey) {
    throw new Error("API key is required.");
  }

  return {
    checkout: new Checkout(config.apiKey, config.proxy),
    customer: new Customer(config.apiKey, config.proxy),
    discounts: new Discounts(config.apiKey, config.proxy),
    collections: new Collections(config.apiKey, config.proxy),
    products: new Products(config.apiKey, config.proxy),
    auth: new Auth(config.apiKey, config.proxy),
  };
}

export function createStoreClient(config?: { proxy?: string }) {
  return new Client(config?.proxy);
}

export function createStoreHelpers(config?: { proxy?: string }) {
  return new Helpers(config?.proxy);
}

export * from "./types";
