import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Custom plugin to handle "use client" directives
const removeUseClientDirective = {
  name: "remove-use-client-directive",
  transform(code) {
    return {
      code: code.replace(/^"use client";\n?/gm, ""),
      map: null,
    };
  },
};

// Custom plugin to remove ?inline query parameter from CSS imports
const removeInlineQuery = {
  name: "remove-inline-query",
  transform(code) {
    return {
      code: code.replace(/from\s+["']([^"']*\.css)\?inline["']/g, 'from "$1"'),
      map: null,
    };
  },
};

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/index.mjs",
      format: "esm",
    },
  ],
  plugins: [
    alias({
      entries: [
        {
          find: /^@\/react\/(.*)/,
          replacement: path.resolve(__dirname, "src/$1"),
        },
      ],
    }),
    removeUseClientDirective,
    removeInlineQuery,
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".css"],
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: /node_modules/,
    }),
    typescript({
      tsconfig: "./tsconfig.json",
    }),
    json({
      include: "**/*.json",
      preferConst: true,
    }),
  ],
  external: ["react", "react-dom", "react/jsx-runtime"],
};
