"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { setNotebook, useUi } from "@/lib/ui-store";

const Notebook = dynamic(() => import("@/components/notebook/Notebook"), {
  ssr: false,
  loading: () => (
    <div className="nb-loading" role="status">
      <span className="nb-kernel-dot" aria-hidden="true" /> Starting kernel…
    </div>
  ),
});

export default function NotebookMode() {
  const open = useUi((s) => s.notebook);

  useEffect(() => {
    try {
      if (new URLSearchParams(location.search).get("mode") === "notebook") setNotebook(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("notebook-open");
    return () => {
      document.body.style.overflow = previous;
      document.documentElement.classList.remove("notebook-open");
    };
  }, [open]);

  return open ? <Notebook /> : null;
}
