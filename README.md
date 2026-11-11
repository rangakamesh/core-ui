# core-ui

Monorepo for **`@rangakamesh-packages/core-ui`**, the shared design system for all my projects, extracted from [rangakamesh.net](https://www.rangakamesh.net).

```
core-ui/
├── packages/core-ui/          ← the published library
│   ├── src/tokens/index.ts    ← ★ THE place to change the look (colours, fonts, radii, shadows…)
│   ├── src/styles/            ← base + per-component CSS (uses only --rk-* variables)
│   ├── src/components/        ← server-safe React components
│   ├── src/client/            ← "use client" components (theme, side nav)
│   └── scripts/build-css.ts   ← generates dist/styles.css, tokens.css, tailwind.css
├── apps/playground/           ← Next.js live style guide (consumes the package like a real app)
└── scripts/release.mjs        ← `npm run release`: local publish to npmjs.com
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
3. Commit the changeset with your changes and push.
4. `npm run release` publishes the new version to npmjs.com (see below).
5. In each project: `npm update @rangakamesh-packages/core-ui` (or `npm i @rangakamesh-packages/core-ui@latest`).

Projects using a `^` range only take non-breaking updates when they run `npm update`, so a breaking redesign is opt-in per project. (While on `0.x`, npm treats each minor as breaking: `^0.1.0` won't pick up `0.2.0`. Release `1.0.0` once the API feels settled.)

## Publishing (from your machine)

Releases are published manually to **npmjs.com** with [`scripts/release.mjs`](scripts/release.mjs):

```bash
export NPM_TOKEN=npm_xxx           # npm access token with publish rights; keep it out of the repo
npm run release -- --dry-run       # optional: run every check, publish nothing
npm run release                    # the real release
```

The script:
1. Checks that `NPM_TOKEN` is set and valid (`npm whoami`), that you're on the default branch (`master`) with a clean tree, and that you're not behind `origin`.
2. Applies pending changesets, which bumps the version and updates `CHANGELOG.md`. If that version is already on npm, it stops and asks you to add a changeset.
3. Runs `typecheck` and `build`.
4. Asks for confirmation, then commits the version bump, runs `npm publish`, creates tag `vX.Y.Z`, and pushes the commit and tag.

Flags: `--dry-run`, `--yes` (skip the prompt), `--otp=123456` (if your npm account asks for a 2FA code when publishing).

The token is only read from the environment. npm receives a temporary config file containing the literal text `${NPM_TOKEN}`, so the token value never touches disk or the repo.

**One-time setup:** publish rights on the npm organisation `rangakamesh-packages` (which owns the `@rangakamesh-packages` scope), then go to Access Tokens → **Granular Access Token** with read and write access to packages. If your account enforces 2FA for publishing, either enable "bypass 2FA" on the token or pass `--otp`.

### Trying it in a local project before publishing

```bash
cd packages/core-ui && npm run build && npm pack      # creates rangakamesh-packages-core-ui-0.1.0.tgz
cd ~/…/my-next-app && npm i ../core-ui/packages/core-ui/rangakamesh-packages-core-ui-0.1.0.tgz
```
