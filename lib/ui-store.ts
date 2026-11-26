"use client";

import { useSyncExternalStore } from "react";

interface UiState {
  notebook: boolean;
  toast: { id: number; text: string } | null;
  overfit: boolean;
}

let state: UiState = { notebook: false, toast: null, overfit: false };
const listeners = new Set<() => void>();
const server: UiState = { notebook: false, toast: null, overfit: false };

function emit(next: Partial<UiState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useUi<T>(select: (s: UiState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => select(state),
    () => select(server),
  );
}

function syncUrl(open: boolean) {
  try {
    const url = new URL(location.href);
    if (open) url.searchParams.set("mode", "notebook");
    else url.searchParams.delete("mode");
    history.replaceState(history.state, "", url);
  } catch {
    /* URL state is a convenience. */
  }
}

export function setNotebook(open: boolean) {
  if (state.notebook === open) return;
  emit({ notebook: open });
  syncUrl(open);
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(text: string, ms = 3600) {
  clearTimeout(toastTimer);
  emit({ toast: { id: Date.now(), text } });
  toastTimer = setTimeout(() => emit({ toast: null }), ms);
}

let overfitTimer: ReturnType<typeof setTimeout> | undefined;
export function overfit() {
  clearTimeout(overfitTimer);
  emit({ overfit: true });
  overfitTimer = setTimeout(() => emit({ overfit: false }), 5200);
}
