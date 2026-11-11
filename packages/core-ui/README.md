# @rangakamesh-packages/core-ui

Personal React component library and design tokens, styled after [rangakamesh.net](https://www.rangakamesh.net). Built for Next.js (App Router, React Server Components), and works in any React app.

- Teal accent, slate neutrals, light and dark themes
- Saira Extra Condensed uppercase display type
- Zero runtime dependencies and no CSS-in-JS. Plain CSS variables in cascade layers.
- Server-safe by default. Only theme and nav components are client components.
- Optional Tailwind v4 bridge (`bg-primary`, `text-text-muted`, `rounded-md`, …)

## Install

```bash
npm install @rangakamesh-packages/core-ui
```

Update later with `npm update @rangakamesh-packages/core-ui`.

## Set up in a Next.js app

**1. Root layout** (`app/layout.tsx`)

```tsx
import { Saira_Extra_Condensed } from "next/font/google";
import { ThemeScript } from "@rangakamesh-packages/core-ui";
import { ThemeProvider } from "@rangakamesh-packages/core-ui/client";
import "@rangakamesh-packages/core-ui/styles.css";
import "./globals.css";

const saira = Saira_Extra_Condensed({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-saira",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={saira.variable} suppressHydrationWarning>
      <head>
        <ThemeScript /> {/* applies saved theme before paint, so no flash */}
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**2. `app/globals.css`**: hand the self-hosted font to the kit

```css
:root {
  --rk-font-heading: var(--font-saira), "Arial Narrow", sans-serif;
}
```

**3. Use components** (works directly in Server Components)

```tsx
import { Button, Card, CardHeader, Heading, Subheading, Badge, Text } from "@rangakamesh-packages/core-ui";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <div>
          <Heading level={3}>Acme Corp</Heading>
          <Subheading muted>Senior Engineer · Remote</Subheading>
        </div>
        <Badge>2022 – Present</Badge>
      </CardHeader>
      <Text>…</Text>
      <Button>Contact me</Button>
    </Card>
  );
}
```

### Next.js `Link` styled as a button

```tsx
import Link from "next/link";
import { buttonClassName } from "@rangakamesh-packages/core-ui";

<Link href="/cv" className={buttonClassName({ variant: "outline" })}>Download CV</Link>
```

### Side navigation (portfolio layout)

Passing `next/link` as a prop must happen inside a `"use client"` file, because Server Components can't pass components as props:

```tsx
// app/Nav.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SideNav, ThemeToggle } from "@rangakamesh-packages/core-ui/client";

const items = [{ href: "/", label: "About" }, { href: "/projects", label: "Projects" }];

export function Nav() {
  const pathname = usePathname();
  return (
    <SideNav
      linkComponent={Link}
      brand="My Site"
      items={items.map((i) => ({ ...i, active: pathname === i.href }))}
      footer={<ThemeToggle />}
    />
  );
}
```

```tsx
// app/layout.tsx body
<Nav />
<ShellMain>{children}</ShellMain>   {/* clears the 17rem sidebar on desktop */}
```

## Components

| Import from `@rangakamesh-packages/core-ui` (server-safe) | |
| --- | --- |
| `Button`, `buttonClassName()` | variants `primary` `secondary` `outline` `ghost` `danger`; sizes `sm` `md` `lg`; `block`, `responsive`, `loading` |
| `IconButton`, `IconLink`, `IconGroup`, `iconButtonClassName()` | circular icon buttons; `effect="fill"` (social) or `"pop"` |
| `Card`, `CardHeader`, `CardTitle`, `CardBody`, `CardActions`, `CardGrid`, `cardMediaClassName` | `hover="lift" \| "interactive" \| "none"`, `padding` |
| `Badge`, `Chip`, `ChipGroup` | badge `variant` solid/subtle/outline × `tone`; pill chips with icon |
| `Heading`, `Subheading`, `Text`, `Accent`, `Divider`, `Code`, `DetailItem` | `Heading underline accent`; `Text size tone` |
| `Field`, `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `Hint` | `invalid` prop and `Field error="…"` |
| `Container`, `Section`, `Stack`, `Cluster`, `Avatar`, `Panel`, `Alert`, `ShellMain`, `embedClassName` | layout primitives |
| `ThemeScript` | inline no-flash theme script for `<head>` |
| `tokens`, `lightColors`, `darkColors`, `cssVar()` | tokens in JS (e.g. chart colours: `cssVar("primary")`) |

| Import from `@rangakamesh-packages/core-ui/client` | |
| --- | --- |
| `ThemeProvider`, `useTheme()` | `theme`, `resolvedTheme`, `setTheme`, `toggleTheme` |
| `ThemeToggle` | sun/moon button |
| `SideNav` | fixed sidebar on desktop, collapsible top bar on mobile |

Every component accepts `className` and the native props of its element.

## Customising per project

Everything is a CSS variable prefixed `--rk-`. Override in any project's CSS without touching the library:

```css
:root { --rk-primary: #7c3aed; --rk-primary-hover: #6d28d9; }
[data-theme="dark"] { --rk-primary: #a78bfa; }
```

Library styles live in `@layer rk.*`, so unlayered CSS and Tailwind utilities always win without `!important`.

## Tailwind v4 (optional)

```css
/* globals.css */
@import "tailwindcss";
@import "@rangakamesh-packages/core-ui/styles.css";
@import "@rangakamesh-packages/core-ui/tailwind.css";
```

You can then use `bg-surface`, `text-primary`, `border-border`, `text-text-muted`, `font-heading`, `rounded-md`, `shadow-lg` and `dark:` (tied to `data-theme="dark"`).

## Files shipped

| Path | Contents |
| --- | --- |
| `@rangakamesh-packages/core-ui/styles.css` | tokens + base element styles + all components |
| `@rangakamesh-packages/core-ui/tokens.css` | CSS variables only (for non-React sites) |
| `@rangakamesh-packages/core-ui/tailwind.css` | Tailwind v4 `@theme` bridge |
