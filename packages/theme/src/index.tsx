import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

export type Theme = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";

export interface ThemeState {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

interface ThemeProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

const ThemeContext = createContext<ThemeState | null>(null);
const media = "(prefers-color-scheme: dark)";

function getStoredTheme(key: string, fallback: Theme): Theme {
  if (typeof window === "undefined") return fallback;
  const value = window.localStorage.getItem(key);
  if (value === "dark" || value === "light" || value === "system") return value;
  return fallback;
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia(media).matches ? "dark" : "light";
}

export function resolveTheme(theme: Theme, system: ResolvedTheme): ResolvedTheme {
  if (theme === "system") return system;
  return theme;
}

function applyTheme(theme: ResolvedTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "desk-theme"
}: ThemeProps) {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme(storageKey, defaultTheme));
  const [system, setSystem] = useState<ResolvedTheme>(() => getSystemTheme());
  const resolvedTheme = resolveTheme(theme, system);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const query = window.matchMedia(media);
    const update = () => setSystem(getSystemTheme());
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const updateTheme = useCallback(
    (next: Theme) => {
      setTheme(next);
      if (typeof window !== "undefined") window.localStorage.setItem(storageKey, next);
    },
    [storageKey]
  );

  const toggleTheme = useCallback(() => {
    updateTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, updateTheme]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme: updateTheme, toggleTheme }),
    [theme, resolvedTheme, updateTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider.");
  return value;
}
