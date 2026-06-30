"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.classList.remove("light", "dark");
  root.classList.add(theme);

  const body = document.body;
  body?.setAttribute("data-theme", theme);
  body?.classList.remove("light", "dark");
  body?.classList.add(theme);

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // localStorage indisponible (mode privé, etc.) : on ignore.
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Doit rester stable entre SSR et premier rendu client pour éviter
  // les mismatches d'hydratation (ex: icône soleil/lune différente).
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") {
      setThemeState(attr);
    }
  }, []);

  // Source de vérité unique: tout changement d'état applique le thème au DOM.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme doit être utilisé dans un <ThemeProvider>");
  }
  return ctx;
}
