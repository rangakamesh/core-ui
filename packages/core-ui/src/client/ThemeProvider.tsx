import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { THEME_STORAGE_KEY, type ResolvedTheme, type ThemePreference } from "../theme-constants.ts";

interface ThemeContextValue {
  /** What the user picked. */
  theme: ThemePreference;
  /** What is actually shown. `undefined` until mounted on the client. */
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: ThemePreference) => void;
  /** Flip between light and dark. */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const media = () => window.matchMedia("(prefers-color-scheme: dark)");
const systemTheme = (): ResolvedTheme => (media().matches ? "dark" : "light");

export interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemePreference;
  storageKey?: string;
}

/**
 * Manages light/dark mode by setting `data-theme` on <html>.
 * Pair with <ThemeScript /> in <head> to avoid a flash on load.
 */
export function ThemeProvider({ children, defaultTheme = "system", storageKey = THEME_STORAGE_KEY }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemePreference>(defaultTheme);
  const [resolvedTheme, setResolved] = useState<ResolvedTheme | undefined>(undefined);

  // Read the stored preference once on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as ThemePreference | null;
      if (stored === "light" || stored === "dark" || stored === "system") setThemeState(stored);
    } catch {
      /* storage blocked */
    }
  }, [storageKey]);

  // Apply theme and follow OS changes while on "system".
  useEffect(() => {
    const apply = () => {
      const next = theme === "system" ? systemTheme() : theme;
      document.documentElement.setAttribute("data-theme", next);
      setResolved(next);
    };
    apply();
    if (theme !== "system") return;
    const mq = media();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback(
    (next: ThemePreference) => {
      setThemeState(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* storage blocked */
      }
    },
    [storageKey],
  );

  const toggleTheme = useCallback(() => {
    const current = theme === "system" ? systemTheme() : theme;
    setTheme(current === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme, toggleTheme }),
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>.");
  return ctx;
}
