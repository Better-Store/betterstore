import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { dirname, resolve as pathResolve } from "path";
import postcss from "rollup-plugin-postcss";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
    removeUseClientDirective,
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "@/react": pathResolve(__dirname, "src"),
      },
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: /node_modules/,
    }),
    typescript(),
    json({
      include: "**/*.json",
      preferConst: true,
    }),
    postcss({
      config: {
        path: "./postcss.config.cjs",
      },
      extract: false,
      modules: false,
      minimize: false,
      inject: false,
    }),
  ],
  external: ["react", "react-dom", "react/jsx-runtime"],
};
