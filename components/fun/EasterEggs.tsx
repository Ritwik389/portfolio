"use client";

import { useEffect } from "react";
import { overfit, setNotebook, toast, useUi } from "@/lib/ui-store";

const konami = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];

function typing(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export default function EasterEggs() {
  const overfitting = useUi((s) => s.overfit);

  useEffect(() => {
    document.documentElement.classList.toggle("is-overfit", overfitting);
  }, [overfitting]);

  useEffect(() => {
    const w = window as Window & { __ritwikHello?: boolean };
    if (!w.__ritwikHello) {
      w.__ritwikHello = true;
      console.log(
        "%c ritwik.ipynb %c\n\nHey, fellow inspector of consoles.\n" +
          "• Press ` (backtick) or add ?mode=notebook to open the notebook.\n" +
          "• ↑ ↑ ↓ ↓ ← → ← → B A does something regrettable.\n" +
          "• Source: https://github.com/Ritwik389/portfolio\n",
        "background:#5fe3c6;color:#03140f;font:600 13px/2 monospace;padding:2px 8px;border-radius:4px",
        "color:inherit;font:12px/1.6 monospace",
      );
    }

    let index = 0;
    const onKey = (event: KeyboardEvent) => {
      if (typing(event.target)) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      index = key === konami[index] ? index + 1 : key === konami[0] ? 1 : 0;
      if (index === konami.length) {
        index = 0;
        overfit();
        toast("⚠ val_loss ↑ — model overfit to this visitor. Applying dropout…", 5000);
      }
      if (event.key === "`" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setNotebook(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return null;
}
