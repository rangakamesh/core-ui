/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DESIGN TOKENS: the single source of truth for the whole kit.
 *
 *  Edit values here, run `npm run build`, publish a new version, and every
 *  project that updates `@rangakamesh-packages/core-ui` picks up the new look.
 *
 *  Each key becomes a CSS custom property:  colors.primary → --rk-primary
 *  Components only ever reference these variables, never raw values.
 *
 *  Extracted from rangakamesh.net (Theme.ts + globals.css).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const PREFIX = "rk";

/** Semantic colour roles. Both themes must define every key. */
export interface ColorTokens {
  /** Page background */
  bg: string;
  /** Cards, nav, popovers */
  surface: string;
  /** Form controls */
  inputBg: string;
  /** Primary text */
  text: string;
  /** Secondary text, placeholders, inactive nav */
  textMuted: string;
  /** Hairlines, card and input borders */
  border: string;
  /** Base colour for every box-shadow */
  shadowColor: string;
  /** Brand accent: buttons, links, active states */
  primary: string;
  primaryHover: string;
  /** Text/icon colour placed on top of `primary` */
  primaryContrast: string;
  // Status colours: not on the portfolio, added so forms/alerts have a voice.
  success: string;
  warning: string;
  danger: string;
}

export const lightColors: ColorTokens = {
  bg: "#F8FAFC",
  surface: "#FFFFFF",
  inputBg: "#FFFFFF",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  shadowColor: "rgba(15, 23, 42, 0.05)",
  primary: "#0D9488",
  primaryHover: "#0F766E",
  primaryContrast: "#FFFFFF",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
};

export const darkColors: ColorTokens = {
  bg: "#0B0F19",
  surface: "#111827",
  inputBg: "#1F2937",
  text: "#F1F5F9",
  textMuted: "#94A3B8",
  border: "#1E293B",
  shadowColor: "rgba(0, 0, 0, 0.25)",
  primary: "#14B8A6",
  primaryHover: "#2DD4BF",
  primaryContrast: "#FFFFFF",
  success: "#4ADE80",
  warning: "#FBBF24",
  danger: "#F87171",
};

export const typography = {
  /** Display face: headings, subheadings, nav, card titles (always uppercase) */
  fontHeading: '"Saira Extra Condensed", "Arial Narrow", sans-serif',
  fontBody: "sans-serif",
  fontMono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',

  textXs: "0.85rem",
  textSm: "0.95rem",
  textBase: "1rem",
  textLead: "1.15rem",

  textH1: "clamp(2rem, 6vw, 3.2rem)",
  textH2: "clamp(1.6rem, 5vw, 2.4rem)",
  textH3: "clamp(1.3rem, 4vw, 1.8rem)",
  textH4: "1.4rem",
  textH5: "1.2rem",
  textH6: "0.95rem",
  /** Subheading / card title */
  textDisplay: "1.25rem",
  textCardTitle: "1.45rem",

  leadingTight: "1.25",
  leadingBody: "1.65",
  leadingLoose: "1.75",

  trackingHeading: "-0.2px",
  trackingCaps: "0.05rem",
} as const;

export const radii = {
  /** Buttons, inputs, nav links, solid badges */
  sm: "8px",
  /** Cards, charts, embeds */
  md: "12px",
  /** Profile images */
  lg: "24px",
  full: "9999px",
} as const;

/** Shadows use the theme's shadow colour so they adapt to dark mode. */
export const shadows = {
  xs: "0 1px 2px var(--rk-shadow-color)",
  sm: "0 2px 4px var(--rk-shadow-color)",
  md: "0 4px 6px -1px var(--rk-shadow-color), 0 2px 4px -1px var(--rk-shadow-color)",
  lg: "0 10px 15px -3px var(--rk-shadow-color), 0 4px 6px -2px var(--rk-shadow-color)",
  xl: "0 10px 20px -3px var(--rk-shadow-color), 0 4px 8px -2px var(--rk-shadow-color)",
  /** Teal glow under hovered primary elements */
  primary: "0 4px 12px color-mix(in srgb, var(--rk-primary) 25%, transparent)",
  /** Focus ring for inputs and keyboard focus */
  ring: "0 0 0 3px color-mix(in srgb, var(--rk-primary) 15%, transparent)",
} as const;

export const space = {
  "1": "0.25rem",
  "2": "0.5rem",
  "3": "0.75rem",
  "4": "1rem",
  "5": "1.5rem",
  "6": "2rem",
  "7": "3rem",
  "8": "4rem",
  "9": "5rem",
} as const;

export const motion = {
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  durationFast: "150ms",
  durationBase: "200ms",
  durationSlow: "300ms",
  /** Lift on hover for buttons/chips (cards use liftLg) */
  lift: "-1px",
  liftMd: "-2px",
  liftLg: "-4px",
} as const;

export const layout = {
  sidebarWidth: "17rem",
  containerMax: "72rem",
  cardMinWidth: "290px",
} as const;

export const tokens = {
  colors: { light: lightColors, dark: darkColors },
  typography,
  radii,
  shadows,
  space,
  motion,
  layout,
} as const;

export type Tokens = typeof tokens;

/** camelCase → kebab-case for CSS variable names */
export const toKebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/** Reference a token from JS, e.g. for chart libraries: cssVar("primary") → "var(--rk-primary)" */
export const cssVar = (name: string) => `var(--${PREFIX}-${toKebab(name)})`;
