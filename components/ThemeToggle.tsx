"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import {
  applyTheme,
  darkThemeQuery,
  preferredTheme,
  setTheme,
  themeEvent,
  themeKey,
  type Theme,
} from "@/lib/theme";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setLocal] = useState<Theme>("light");

  useEffect(() => {
    const system = matchMedia(darkThemeQuery);
    const sync = () => {
      const next = preferredTheme(system.matches);
      applyTheme(next);
      setLocal(next);
    };
    const syncStorage = (event: StorageEvent) => {
      if (event.key === themeKey || event.key === null) sync();
    };
    const syncEvent = (event: Event) => setLocal((event as CustomEvent<Theme>).detail);
    sync();
    system.addEventListener("change", sync);
    window.addEventListener("storage", syncStorage);
    window.addEventListener(themeEvent, syncEvent);
    return () => {
      system.removeEventListener("change", sync);
      window.removeEventListener("storage", syncStorage);
      window.removeEventListener(themeEvent, syncEvent);
    };
  }, []);

  const dark = theme === "dark";
  return (
    <button
      type="button"
      className={`icon-btn theme-toggle ${className}`}
      aria-label={dark ? "Switch to paper (light) theme" : "Switch to lab (dark) theme"}
      title={dark ? "Paper mode" : "Lab mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );
}
