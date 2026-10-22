"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Applies the user's system preference by default and enables the manual
 * light/dark/system control via the `class` strategy.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
