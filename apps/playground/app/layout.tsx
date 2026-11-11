import type { Metadata } from "next";
import { Saira_Extra_Condensed } from "next/font/google";
import { ThemeScript } from "@rangakamesh-packages/core-ui";
import { ThemeProvider } from "@rangakamesh-packages/core-ui/client";
import "@rangakamesh-packages/core-ui/styles.css";
import "./globals.css";

// Self-hosted by next/font, then handed to the kit through --rk-font-heading.
const heading = Saira_Extra_Condensed({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-saira",
  display: "swap",
});

export const metadata: Metadata = {
  title: "core-ui playground",
  description: "Live style guide for @rangakamesh-packages/core-ui",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={heading.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
