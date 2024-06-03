import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["./src/index.ts", "./src/browser.ts", "./src/server.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
});
