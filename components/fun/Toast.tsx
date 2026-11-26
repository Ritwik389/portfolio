"use client";

import { AnimatePresence, motion } from "motion/react";
import { useUi } from "@/lib/ui-store";

export default function Toast() {
  const toast = useUi((s) => s.toast);
  return (
    <div className="toast-region" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.p
            key={toast.id}
            className="toast"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", visualDuration: 0.3, bounce: 0.15 }}
          >
            {toast.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
