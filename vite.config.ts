import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, mergeConfig } from "vite";
import { defineConfig as defineVitest } from "vitest/config";

export default mergeConfig(
  defineConfig({
    plugins: [react()],
    resolve: {
      alias: [{ find: "@", replacement: path.resolve(process.cwd(), "src") }],
    },
    server: {
      port: 10000,
      host: "0.0.0.0",
      proxy: {
        "/api": {
          target: "http://localhost:3001/",
          changeOrigin: true,
        },
      },
    },
    preview: {
      port: 10000,
      host: "0.0.0.0",
    },
  }),
  defineVitest({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
    },
  })
);
