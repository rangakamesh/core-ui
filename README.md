# core-ui

Monorepo for **`@rangakamesh/core-ui`**, the shared design system for all my projects, extracted from [rangakamesh.net](https://www.rangakamesh.net).

```
core-ui/
├── packages/core-ui/          ← the published library
│   ├── src/tokens/index.ts    ← ★ THE place to change the look (colours, fonts, radii, shadows…)
│   ├── src/styles/            ← base + per-component CSS (uses only --rk-* variables)
│   ├── src/components/        ← server-safe React components
│   ├── src/client/            ← "use client" components (theme, side nav)
│   └── scripts/build-css.ts   ← generates dist/styles.css, tokens.css, tailwind.css
├── apps/playground/           ← Next.js live style guide (consumes the package like a real app)
└── .github/workflows/         ← automated releases via Changesets
```

Usage docs for consuming apps are in [packages/core-ui/README.md](packages/core-ui/README.md).

## Develop

```bash
npm install
npm run dev        # watches the library + runs the playground at http://localhost:3100
```

Edit a token or a component and the playground reloads with the change.

```bash
npm run build      # build the library
npm run typecheck  # typecheck library + playground
```

## Restyle every project

1. Edit `packages/core-ui/src/tokens/index.ts` (for example change `primary`), and check it in the playground.
2. `npx changeset` and choose the bump:
   - **patch**: colour/spacing tweaks, bug fixes
   - **minor**: new components or props
   - **major**: renamed/removed components, props or `--rk-*` variables
3. Commit and push to `main`. The Release workflow opens a "Version Packages" PR. Merging it publishes to npm.
4. In each project: `npm update @rangakamesh/core-ui` (or `npm i @rangakamesh/core-ui@latest`).

Projects using a `^` range only take non-breaking updates when they run `npm update`, so a breaking redesign is opt-in per project. (While on `0.x`, npm treats each minor as breaking: `^0.1.0` won't pick up `0.2.0`. Release `1.0.0` once the API feels settled.)

## One-time publishing setup

1. Create an npm account named `rangakamesh` (the `@rangakamesh` scope = your npm username), or change the package name in `packages/core-ui/package.json`.
2. Create a GitHub repo for this folder and push it.
3. npm → Access Tokens → **Granular/Automation token** with publish rights → add it as the `NPM_TOKEN` repository secret.
4. Manual first publish (optional): `npm login && npm run release`.

### Trying it in a local project before publishing

```bash
cd packages/core-ui && npm run build && npm pack      # creates rangakamesh-core-ui-0.1.0.tgz
cd ~/…/my-next-app && npm i ../core-ui/packages/core-ui/rangakamesh-core-ui-0.1.0.tgz
```
