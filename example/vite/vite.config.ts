// vite.config.ts
import { defineConfig } from "vite";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  plugins: [topLevelAwait()],
  build: {
    minify: true,
    cssMinify: true,
    cssCodeSplit: true,
  },
});
