"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { X } from "lucide-react";
import { useUi } from "@/lib/ui-store";

const EPOCHS = 9;
const SAMPLES = 64;
const hideKey = "portfolio-hud-hidden";

/* A decorative "training run" driven by scroll position. The loss curve is
   a fixed function of progress (with deterministic jitter), so it converges
   exactly when the reader reaches the contact section. */
function lossAt(p: number) {
  const jitter = Math.sin(p * 41) * 0.035 + Math.sin(p * 97) * 0.018;
  return Math.max(0.03, 2.35 * Math.exp(-4.4 * p) + 0.05 + jitter * (1 - p));
}
function accAt(p: number) {
  return Math.min(0.99, 0.41 + 0.56 * (1 - Math.exp(-3.8 * p)));
}

const hideListeners = new Set<() => void>();
function readHidden() {
  try {
    return localStorage.getItem(hideKey) === "1";
  } catch {
    return false;
  }
}
function hideHud() {
  try {
    localStorage.setItem(hideKey, "1");
  } catch {
    /* storage can be unavailable; hide for this page only */
  }
  sessionHidden = true;
  hideListeners.forEach((l) => l());
}
let sessionHidden = false;
function subscribeHidden(listener: () => void) {
  hideListeners.add(listener);
  return () => hideListeners.delete(listener);
}

const curve = Array.from({ length: SAMPLES + 1 }, (_, i) => lossAt(i / SAMPLES));
const maxLoss = curve[0];

export default function TrainingHud() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const hidden = useSyncExternalStore(subscribeHidden, () => sessionHidden || readHidden(), () => true);
  const notebook = useUi((s) => s.notebook);
  const overfitting = useUi((s) => s.overfit);
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const contact = document.getElementById("contact");
        const end = contact
          ? contact.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35
          : document.documentElement.scrollHeight - window.innerHeight;
        setProgress(Math.min(1, Math.max(0, window.scrollY / Math.max(1, end))));
        const footer = document.querySelector("footer");
        const footerInView = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.9 : false;
        setVisible(window.scrollY > window.innerHeight * 0.6 && !footerInView);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (hidden || notebook || !visible) return null;

  const epoch = Math.min(EPOCHS, 1 + Math.floor(progress * EPOCHS));
  const converged = progress >= 0.995;
  const loss = overfitting ? 0.004 : lossAt(progress);
  const valLoss = overfitting ? 3.71 : lossAt(progress) * 1.08 + 0.02;
  const upto = Math.max(1, Math.round(progress * SAMPLES));
  const points = curve
    .slice(0, upto + 1)
    .map((v, i) => `${(i / SAMPLES) * 100},${28 - (v / maxLoss) * 26}`)
    .join(" ");

  return (
    <aside className="hud js-only" aria-label="Decorative training run driven by scrolling">
      <div className="hud-top">
        <span className={`hud-dot ${converged ? "is-done" : ""} ${overfitting ? "is-warn" : ""}`} aria-hidden="true" />
        <span className="hud-title">train.py</span>
        <span className="hud-epoch">
          epoch {epoch}/{EPOCHS}
        </span>
        <button
          type="button"
          className="hud-close"
          aria-label="Hide training run"
          onClick={hideHud}
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>
      <svg className="hud-curve" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
        <polyline className="hud-curve-ghost" points={curve.map((v, i) => `${(i / SAMPLES) * 100},${28 - (v / maxLoss) * 26}`).join(" ")} />
        <polyline className="hud-curve-live" points={points} />
      </svg>
      <p className="hud-metrics">
        loss <b>{loss.toFixed(3)}</b> · val <b>{valLoss.toFixed(3)}</b> · acc <b>{(overfitting ? 1 : accAt(progress)).toFixed(2)}</b>
      </p>
      <p className="hud-status" aria-live="off">
        {overfitting
          ? "overfitting! applying dropout…"
          : converged
            ? "✓ converged — early stopping at contact"
            : "training… keep scrolling"}
      </p>
    </aside>
  );
}
