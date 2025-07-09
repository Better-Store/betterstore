import { config } from "@betterstore/eslint-config/react-internal";
import pluginI18next from "eslint-plugin-i18next";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    plugins: {
      i18next: pluginI18next,
    },
    rules: {
      // Core i18n rule
      "i18next/no-literal-string": [
        "warn",
        {
          markupOnly: true,
          ignoreAttribute: ["id", "key", "src", "href", "alt"],
        },
      ],
    },
  },
];
