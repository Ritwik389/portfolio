"use client";

import { useCallback, useRef } from "react";
import { useCanvasAnimation, type CanvasFrame } from "./useCanvasAnimation";

// Adapted from Magic UI's MIT-licensed FlickeringGrid, with a shared animation
// lifecycle and lower density/opacity for this portfolio's existing palette.
export function FlickeringGrid() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const squares = useRef(new Float32Array(0));
  const last = useRef(0);
  const draw = useCallback(({ context: ctx, width, height, time, color, reducedMotion }: CanvasFrame) => {
    const step = 18, size = 2;
    const cols = Math.ceil(width / step), rows = Math.ceil(height / step);
    if (squares.current.length !== cols * rows) {
      squares.current = Float32Array.from({ length: cols * rows }, () => 0.05 + Math.random() * 0.16);
      last.current = time;
    }
    const delta = Math.min(Math.max(time - last.current, 0), 0.1);
    last.current = time;
    ctx.fillStyle = color;
    for (let column = 0; column < cols; column++) for (let row = 0; row < rows; row++) {
      const i = column * rows + row;
      if (!reducedMotion && Math.random() < 0.18 * delta) squares.current[i] = 0.05 + Math.random() * 0.16;
      ctx.globalAlpha = squares.current[i];
      ctx.fillRect(column * step, row * step, size, size);
    }
    ctx.globalAlpha = 1;
  }, []);
  useCanvasAnimation(canvas, draw, 20);
  return <div aria-hidden="true" className="project-grid pointer-events-none absolute inset-0"><canvas ref={canvas} className="h-full w-full text-terracotta" data-effect="flickering-grid" /></div>;
}
