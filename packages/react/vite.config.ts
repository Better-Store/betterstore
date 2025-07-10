import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/dev", // Set the root to the dev folder
  plugins: [react()],
  resolve: {
    alias: {
      "@/react": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0", // Allow external access
    port: 5173, // Default Vite port
    proxy: {
      "/api/betterstore": {
        target: "https://v1.betterstore.io/client",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/betterstore/, ""),
      },
    },
  },
});
