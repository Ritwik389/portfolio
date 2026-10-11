"use client";

import { useEffect, type RefObject } from "react";

export type CanvasFrame = { context: CanvasRenderingContext2D; width: number; height: number; time: number; color: string; reducedMotion: boolean };

// Decorative effects share one lifecycle: stop offscreen, pause hidden tabs, and draw
// a still frame for reduced motion. Resolution and frame rate are deliberately capped.
export function useCanvasAnimation(canvasRef: RefObject<HTMLCanvasElement>, draw: (frame: CanvasFrame) => void, fps = 30) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0, height = 0, frame = 0, last = 0, visible = false;
    const color = getComputedStyle(canvas).color;
    function render(time: number) {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      draw({ context, width, height, time: media.matches ? 0 : time / 1000, color, reducedMotion: media.matches });
    }
    function tick(time: number) {
      if (time - last >= 1000 / fps) { render(time); last = time; }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame);
      if (visible && !document.hidden && !media.matches) frame = requestAnimationFrame(tick);
      else render(0);
    }
    const resize = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(performance.now());
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    resize.observe(canvas); observer.observe(canvas);
    document.addEventListener("visibilitychange", sync);
    media.addEventListener("change", sync);
    return () => { cancelAnimationFrame(frame); resize.disconnect(); observer.disconnect(); document.removeEventListener("visibilitychange", sync); media.removeEventListener("change", sync); };
  }, [canvasRef, draw, fps]);
}
