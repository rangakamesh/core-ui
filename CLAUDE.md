# CLAUDE.md

Guidance for Claude (and any contributor) working in this repository.

`@rangakamesh/core-ui` is an open-source React component library and design-token set for Next.js (App Router, React Server Components). It is a **public repository**, so read [Public repository: privacy rules](#public-repository-privacy-rules) before writing any content.

## Commands

```bash
npm install
npm run dev        # library in watch mode + playground at http://localhost:3100
npm run build      # build packages/core-ui → dist/
npm run typecheck  # all workspaces
npx changeset      # record a version bump for any change to packages/core-ui
npm run release    # maintainer only: publish to npmjs.com (needs NPM_TOKEN in env; see README)
```

There is no test runner yet. Verify changes with `npm run typecheck`, `npm run build`, and by viewing the playground in **both light and dark themes** and at **mobile width (< 768px)**.

## Layout

| Path | Purpose |
| --- | --- |
| `packages/core-ui/src/tokens/index.ts` | **Single source of truth** for every design value |
| `packages/core-ui/src/styles/base.css` | Global element defaults (body, headings, links, scrollbar) |
| `packages/core-ui/src/styles/components/*.css` | One file per component family; picked up automatically by the build |
| `packages/core-ui/src/components/` | Server-safe components → exported from `src/index.ts` |
| `packages/core-ui/src/client/` | Components needing state/effects → exported from `src/client/index.ts` (bundled with `"use client"`) |
| `packages/core-ui/scripts/build-css.ts` | Generates `dist/tokens.css`, `dist/styles.css`, `dist/tailwind.css` from tokens + CSS |
| `apps/playground/` | Next.js style guide; every component must be demoed here |

## Architecture rules

1. **Never hard-code design values in component CSS.** Use `var(--rk-*)`. If a value is missing, add a token to `tokens/index.ts` first. Allowed exceptions: `0`, `1px` hairlines, `50%`, `100%`, and `#fff` on saturated status fills.
2. **Token naming.** A token key becomes a CSS variable: `textMuted` → `--rk-text-muted`, `radii.sm` → `--rk-radius-sm`, `shadows.md` → `--rk-shadow-md`, `space["4"]` → `--rk-space-4`. Colour tokens are **semantic roles** (`surface`, `textMuted`, `primary`), never hue names (`teal500`). Every colour must exist in both `lightColors` and `darkColors`.
3. **Derived colours use `color-mix`**, e.g. `color-mix(in srgb, var(--rk-primary) 15%, transparent)`, so tints follow the theme automatically. Don't add tint tokens unless the tint is reused widely.
4. **Class names** are `rk-` prefixed BEM: `.rk-card`, `.rk-card__title`, `.rk-card--interactive`. No unprefixed classes, no IDs, no element selectors outside `base.css`.
5. **Cascade layers.** All library CSS ends up in `@layer rk.tokens, rk.base, rk.components`. Never use `!important` (the reduced-motion reset is the only exception). Consumers must always be able to override with plain CSS or Tailwind.
6. **No runtime dependencies** and no CSS-in-JS. React/React DOM are peer dependencies only.
7. **Server-first.** Components go in `src/components/` and must not use hooks, event handlers that need state, or browser APIs. Only use `src/client/` when a component truly needs interactivity. Client code must not run browser APIs during render (SSR safe, no hydration mismatches).
8. **Theming** is driven by `data-theme="light" | "dark"` on `<html>`, with a `prefers-color-scheme` fallback when the attribute is absent. Components never check the theme in JS; they only reference tokens.

## Visual language

The look is clean, calm and slightly technical: slate neutrals, one teal accent, condensed uppercase display type, soft elevation and small, quick motion.

**Colour**
- One accent: `--rk-primary` (teal). Use it for the main action, links, active/selected states, focus and accent text. Avoid large teal areas; at most one solid primary element per group.
- Surfaces: page `--rk-bg` → cards/nav `--rk-surface` → inputs `--rk-input-bg`. Separate them with `1px solid var(--rk-border)` hairlines, not heavy fills.
- Text: `--rk-text` for content, `--rk-text-muted` for secondary text, metadata and placeholders (placeholders at 60% opacity).
- Status (`success`, `warning`, `danger`) is only for feedback such as validation, alerts and status badges, never for decoration.

**Typography**
- Display face `--rk-font-heading` (Saira Extra Condensed), weight 700, **uppercase**: h1–h3, subheadings, card titles, nav links, brand. h4–h6 keep their case.
- Body face `--rk-font-body` for paragraphs, labels, buttons, inputs and badges. Buttons and labels use weight 600, badges 700.
- Use the scale tokens (`--rk-text-xs … --rk-text-h1`). h1–h3 are fluid `clamp()` values. Body line-height `--rk-leading-body` (1.65), headings `--rk-leading-tight`.
- Section titles: `Heading level={2} underline` (2px border-bottom rule, inline-block).

**Shape**
- `--rk-radius-sm` (8px): buttons, inputs, nav links, solid badges, alerts.
- `--rk-radius-md` (12px): cards, panels, embeds.
- `--rk-radius-lg` (24px): profile imagery.
- `--rk-radius-full`: chips/pills. `50%`: icon buttons, avatars set to circle.

**Elevation**
- At rest, controls use `--rk-shadow-xs`/`sm` and cards use `--rk-shadow-md`.
- On hover, step up one level (`lg`/`xl`). Primary-coloured elements get `--rk-shadow-primary` (a teal glow), not a grey shadow.
- Hovered cards get a faint primary border: `color-mix(in srgb, var(--rk-primary) 20–30%, transparent)`.

**Motion and interaction**
- Easing `--rk-ease`. Durations: `--rk-duration-fast` for colour, `--rk-duration-base` for controls, `--rk-duration-slow` for cards.
- Hover lift with `translateY`: `--rk-lift` (-1px) for buttons and chips, `--rk-lift-md` (-2px) for content cards, `--rk-lift-lg` (-4px) for clickable tiles. `:active` returns to `0`.
- Round toggles scale (`1.05` on hover, `0.95` on active) instead of lifting.
- Hover patterns:
  - **Secondary/neutral controls:** the border and text turn primary.
  - **Outline and social icon buttons:** fill with primary and switch the text to `--rk-primary-contrast`.
  - **Ghost and nav links:** get a `--rk-bg` background and primary text.
- Focus: inputs use `border-color: var(--rk-primary)` with `--rk-shadow-ring`. Everything else relies on the global `:focus-visible` outline. Never remove focus styles without a replacement.
- Disabled: `opacity: 0.55–0.6`, `cursor: not-allowed`, no lift.
- All motion is reset under `prefers-reduced-motion` in `base.css`. Don't add animations that bypass it.

**Layout and responsiveness**
- Breakpoints: `768px` (stack → row; buttons may go full width below it with `responsive`) and `992px` (side nav switches from top bar to fixed `--rk-sidebar-width` sidebar).
- Use the `--rk-space-*` scale for gaps and padding. Card padding is `--rk-space-6` by default, `--rk-space-5` for grid tiles.
- Grids use `repeat(auto-fill, minmax(min(var(--rk-card-min-width), 100%), 1fr))` so they never overflow on small screens.

## Adding a component

1. **Tokens:** add any missing values to `tokens/index.ts`, in both themes if it's a colour.
2. **CSS:** create `src/styles/components/<name>.css` (no import needed; the build globs this folder) or extend the closest existing family file. Follow the visual language above.
3. **React:**
   - Put the component in `src/components/` (or `src/client/` if it needs interactivity).
   - Pass `className` and `...rest` through to the root element, and type props by extending the native element's attributes.
   - Use `forwardRef` for focusable elements.
   - Compose classes with `cx()`.
   - If links might need the component's look (as with buttons), export a `<name>ClassName()` helper.
   - Expose variants as string-union props (`variant`, `size`, `tone`) that map to `--modifier` classes.
4. **Accessibility:**
   - Use semantic elements and give icon-only controls a required `label`.
   - Decorative icons get `aria-hidden`; use `aria-current`, `aria-expanded` and `aria-invalid` where they apply.
   - Text contrast must be at least 4.5:1 in both themes.
5. **Export** it from `src/index.ts` or `src/client/index.ts`.
6. **Demo** every variant in `apps/playground/app/page.tsx`, then check light, dark and mobile.
7. **Document** it in the components table in `packages/core-ui/README.md`.
8. **Changeset:** run `npx changeset`.

## Versioning (semver via Changesets)

The public API includes component names and props, exported helpers, **`--rk-*` variable names**, **`.rk-*` class names**, and the CSS entry points (`styles.css`, `tokens.css`, `tailwind.css`).

- **patch**: bug fixes, value tweaks to existing tokens.
- **minor**: new components, props, tokens or variants. A deliberate visual refresh also counts as a minor change.
- **major**: renaming or removing any of the above, or changing default behaviour that consumers depend on.

Don't hand-edit `version` fields or `CHANGELOG.md`; Changesets manages them.

## Public repository: privacy rules

This repository and its npm package are public. Everything committed (code, comments, docs, examples, changesets, commit messages, PR text, screenshots) is permanently visible and indexed.

**Never commit personal information about the maintainer or anyone else**, including:
- Real names (other than the existing `rangakamesh` handle in the package scope and repo URL), email addresses, phone numbers, street or city addresses.
- Employers, job titles or history, schools, dates of birth, or other résumé or portfolio content.
- Photos or avatars of real people, names of private projects, links to personal social profiles.
- Local machine details: absolute paths like `/Users/<name>/…`, usernames, hostnames.
- Secrets of any kind: tokens, API keys, `.env` contents, registry credentials. Releases are published locally via `npm run release`, which reads `NPM_TOKEN` from the environment. Never write a token value into `.npmrc` or any file; reference it as `${NPM_TOKEN}`.

**Use neutral placeholders in examples, demos and docs:**
- People and companies: "Jane Doe", "Acme Corp", "Project Alpha", "Senior Engineer · Remote".
- Email and URLs: `hello@example.com` and `example.com` (reserved for documentation by RFC 2606), or the bare `https://github.com`.
- Images: abstract or generated imagery only, never a real person's photo.

The design language may be described as "styled after rangakamesh.net" because that site is the public origin of the visual style. Don't copy its personal content (bio, experience, education, contact details).

**Before committing**, scan the diff for anything on the list above. If personal data was already pushed, flag it to the maintainer: removing it from history needs a history rewrite and force-push, which only the maintainer should decide on.
