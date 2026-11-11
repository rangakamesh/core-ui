import { defineConfig } from "tsup";

const shared = {
  format: ["esm", "cjs"] as ("esm" | "cjs")[],
  dts: true,
  sourcemap: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime"],
  treeshake: false,
};

export default defineConfig([
  // Server-safe components + tokens. No "use client" so they render in RSC.
  {
    ...shared,
    entry: { index: "src/index.ts" },
  },
  // Interactive components. The banner marks the whole bundle as a client boundary.
  {
    ...shared,
    entry: { client: "src/client/index.ts" },
    banner: { js: '"use client";' },
  },
]);
