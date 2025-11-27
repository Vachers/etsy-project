"use client";

import { createContext, useContext, ReactNode } from "react";

interface ThemeContextType {
  theme: "light";
  setTheme: () => void;
  resolvedTheme: "light";
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
});

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
}

export function ThemeProvider({ children, defaultTheme: _defaultTheme = "system" }: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={{ theme: "light", setTheme: () => {}, resolvedTheme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
