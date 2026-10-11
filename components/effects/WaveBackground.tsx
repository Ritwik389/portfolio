"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCanvasAnimation, type CanvasFrame } from "./useCanvasAnimation";

// Local adaptation of Kain Xu's Wave Background on 21st.dev.
export default function WaveBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const pointer = useRef({ x: -1000, y: -1000 });
  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !canvas.current) return;
      const rect = canvas.current.getBoundingClientRect();
      pointer.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const leave = () => { pointer.current = { x: -1000, y: -1000 }; };
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => { window.removeEventListener("pointermove", move); document.removeEventListener("mouseleave", leave); };
  }, []);
  const draw = useCallback(({ context: ctx, width, height, time, color, reducedMotion }: CanvasFrame) => {
    ctx.strokeStyle = color; ctx.lineWidth = 0.85; ctx.globalAlpha = 0.34;
    for (let x = -36; x <= width + 36; x += 28) {
      ctx.beginPath();
      for (let y = 0; y <= height + 16; y += 16) {
        const wave = Math.sin(y * 0.006 + x * 0.003 + time * 0.25) * 25 + Math.sin(y * 0.012 - time * 0.16) * 10;
        const dx = x - pointer.current.x, dy = y - pointer.current.y;
        const distance = Math.hypot(dx, dy);
        const push = !reducedMotion && distance < 160 ? (1 - distance / 160) * Math.sign(dx) * 24 : 0;
        if (y === 0) ctx.moveTo(x + wave + push, y); else ctx.lineTo(x + wave + push, y);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }, []);
  useCanvasAnimation(canvas, draw);
  return <div className="hero-waves pointer-events-none absolute inset-0" aria-hidden="true"><canvas ref={canvas} className="h-full w-full text-champagne" data-effect="waves" /></div>;
}
