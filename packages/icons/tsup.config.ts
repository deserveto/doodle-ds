import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  // generate.mjs clears dist before copying raw SVGs; keep those files while
  // tsup writes the JavaScript and declaration bundles.
  clean: false,
  external: ["react", "react/jsx-runtime"],
});
