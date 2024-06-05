// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
        "component-party": "./component-party/index.html",
      },
    },
  },
});
