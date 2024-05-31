import { defineConfig } from "tsup";

export default defineConfig({
  entryPoints: ["./src/browser/index.ts", "./src/server/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
});
