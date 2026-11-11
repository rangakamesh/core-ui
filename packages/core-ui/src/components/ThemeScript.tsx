import { THEME_STORAGE_KEY } from "../theme-constants.ts";

/**
 * Put inside <head> in the root layout. Applies the saved theme before first
 * paint, so dark-mode users never see a light flash. Server component.
 *
 *   <html lang="en" suppressHydrationWarning>
 *     <head><ThemeScript /></head>
 */
export function ThemeScript({
  storageKey = THEME_STORAGE_KEY,
  defaultTheme = "system",
}: {
  storageKey?: string;
  defaultTheme?: "light" | "dark" | "system";
}) {
  const code = `(function(){try{var t=localStorage.getItem(${JSON.stringify(storageKey)})||${JSON.stringify(
    defaultTheme,
  )};if(t==="system")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
