export type Theme = "light" | "dark";

export const themeKey = "portfolio-theme";
export const darkThemeQuery = "(prefers-color-scheme: dark)";
export const themeColors = { light: "#f6f2e9", dark: "#07090d" } as const;
let restoreTransitions = 0;

export function preferredTheme(systemDark: boolean): Theme {
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // The browser can disable storage.
  }
  return systemDark ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  cancelAnimationFrame(restoreTransitions);
  root.setAttribute("data-theme-changing", "");
  root.dataset.theme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", themeColors[theme]);
  restoreTransitions = requestAnimationFrame(() => {
    restoreTransitions = requestAnimationFrame(() => {
      root.removeAttribute("data-theme-changing");
    });
  });
}

export const initializeTheme = `(() => {
  let saved;
  try { saved = localStorage.getItem(${JSON.stringify(themeKey)}); } catch {}
  const theme = saved === "light" || saved === "dark"
    ? saved
    : matchMedia(${JSON.stringify(darkThemeQuery)}).matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", ${JSON.stringify(themeColors)}[theme]);
})();`;

export const themeEvent = "portfolio-themechange";

export function setTheme(theme: Theme) {
  applyTheme(theme);
  try {
    localStorage.setItem(themeKey, theme);
  } catch {
    // The selection still applies to this page when storage is disabled.
  }
  window.dispatchEvent(new CustomEvent(themeEvent, { detail: theme }));
}

export function currentTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
