"use client";
import { useCallback, useSyncExternalStore } from "react";
function subscribe(callback: () => void) {
  window.addEventListener("popstate", callback);
  window.addEventListener("portfolio:navigation", callback);
  return () => {
    window.removeEventListener("popstate", callback);
    window.removeEventListener("portfolio:navigation", callback);
  };
}
export function useUrlChoice(
  key: string,
  options: readonly string[],
  fallback: string,
) {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  const raw = new URLSearchParams(search).get(key);
  const value = raw && options.includes(raw) ? raw : fallback;
  const update = useCallback(
    (next: string) => {
      const url = new URL(window.location.href);
      if (next === fallback) url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      history.pushState({}, "", url);
      window.dispatchEvent(new Event("portfolio:navigation"));
    },
    [key, fallback],
  );
  return [value, update] as const;
}
