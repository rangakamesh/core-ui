/**
 * Generates the distributable CSS from the TypeScript tokens + component CSS.
 *
 *   dist/tokens.css    CSS variables only (light, dark, system fallback)
 *   dist/styles.css    tokens + base + every component, in cascade layers
 *   dist/tailwind.css  Tailwind v4 bridge (@theme) mapping utilities to tokens
 *
 * Runs on Node's built-in TypeScript support (no tsx/ts-node needed).
 * Pass --watch to rebuild on changes.
 */
import { mkdirSync, readdirSync, readFileSync, watch, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcStyles = join(root, "src", "styles");
const tokensFile = join(root, "src", "tokens", "index.ts");
const dist = join(root, "dist");

type Dict = Record<string, string>;

async function loadTokens() {
  // Cache-bust so --watch picks up token edits.
  return import(`${pathToFileURL(tokensFile).href}?t=${Date.now()}`) as Promise<typeof import("../src/tokens/index.ts")>;
}

async function build() {
  const t = await loadTokens();
  const p = t.PREFIX;
  /** v("textMuted") → --rk-text-muted ; v("sm", "radius") → --rk-radius-sm */
  const v = (name: string, group = "") => `--${p}-${group ? group + "-" : ""}${t.toKebab(name)}`;
  const decls = (obj: object, group = "", indent = "  ") =>
    Object.entries(obj as Dict)
      .map(([k, val]) => `${indent}${v(k, group)}: ${val};`)
      .join("\n");

  const staticTokens = [
    decls(t.typography),
    decls(t.radii, "radius"),
    decls(t.shadows, "shadow"),
    decls(t.space, "space"),
    decls(t.motion),
    decls(t.layout),
  ].join("\n");

  const tokensCss = `/* @rangakamesh-packages/core-ui tokens: generated from src/tokens/index.ts. Do not edit. */
:root {
${staticTokens}
}

:root,
[data-theme="light"] {
  color-scheme: light;
${decls(t.lightColors)}
}

[data-theme="dark"] {
  color-scheme: dark;
${decls(t.darkColors)}
}

/* No explicit theme chosen → follow the OS. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
${decls(t.darkColors, "", "    ")}
  }
}
`;

  const read = (f: string) => readFileSync(join(srcStyles, f), "utf8").trim();
  const componentFiles = readdirSync(join(srcStyles, "components"))
    .filter((f) => f.endsWith(".css"))
    .sort();

  const stylesCss = `/* @rangakamesh-packages/core-ui: generated. Edit src/styles or src/tokens instead. */
/* Layer order: anything unlayered (or a later layer such as Tailwind utilities) wins. */
@layer rk.tokens, rk.base, rk.components;

@layer rk.tokens {
${tokensCss.replace(/^\/\*.*\*\/\n/, "")}
}

@layer rk.base {
${read("base.css")}
}

@layer rk.components {
${componentFiles.map((f) => `/* ${f} */\n${read(join("components", f))}`).join("\n\n")}
}
`;

  // Tailwind v4: `@theme inline` makes utilities reference our variables,
  // so bg-primary / text-muted / rounded-md etc. track the kit and its dark mode.
  const tw = (ns: string, obj: object, map: (k: string) => string) =>
    Object.keys(obj)
      .map((k) => `  --${ns}-${t.toKebab(k)}: var(${map(k)});`)
      .join("\n");
  const tailwindCss = `/* @rangakamesh-packages/core-ui Tailwind v4 bridge: generated.
   Usage (globals.css):
     @import "tailwindcss";
     @import "@rangakamesh-packages/core-ui/styles.css";
     @import "@rangakamesh-packages/core-ui/tailwind.css";
*/
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@theme inline {
${tw("color", t.lightColors, (k) => v(k))}
  --font-heading: var(${v("fontHeading")});
  --font-sans: var(${v("fontBody")});
  --font-mono: var(${v("fontMono")});
${tw("radius", t.radii, (k) => v(k, "radius"))}
${tw("shadow", t.shadows, (k) => v(k, "shadow"))}
  --ease-rk: var(${v("ease")});
}
`;

  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, "tokens.css"), tokensCss);
  writeFileSync(join(dist, "styles.css"), stylesCss);
  writeFileSync(join(dist, "tailwind.css"), tailwindCss);
  console.log(`[css] built tokens.css, styles.css (${componentFiles.length} components), tailwind.css`);
}

await build();

if (process.argv.includes("--watch")) {
  let timer: NodeJS.Timeout | undefined;
  const rebuild = () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error("[css]", e)), 50);
  };
  watch(srcStyles, { recursive: true }, rebuild);
  watch(dirname(tokensFile), { recursive: true }, rebuild);
  console.log("[css] watching src/styles and src/tokens…");
}
