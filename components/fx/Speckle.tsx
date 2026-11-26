"use client";

import { useEffect, useRef } from "react";

/* A procedural "SAR scene": low-frequency value noise decides ice vs water,
   multiplicative exponential noise adds radar speckle. Rendered once per
   theme/size into a small canvas and upscaled. No animation loop. */

function hash(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x: number, y: number, seed: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function field(x: number, y: number) {
  let total = 0, amp = 1, freq = 1, norm = 0;
  for (let o = 0; o < 4; o++) {
    total += valueNoise(x * freq, y * freq, 7 + o) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return total / norm;
}

export default function Speckle({ className = "" }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let seed = 1;
    const draw = () => {
      const rect = el.getBoundingClientRect();
      const scale = 0.32;
      const w = Math.max(80, Math.round(rect.width * scale));
      const h = Math.max(60, Math.round(rect.height * scale));
      el.width = w;
      el.height = h;
      const ctx = el.getContext("2d");
      if (!ctx) return;
      const rgb = getComputedStyle(el).getPropertyValue("--speckle").trim().split(/\s+/).map(Number);
      const dark = document.documentElement.dataset.theme === "dark";
      const img = ctx.createImageData(w, h);
      seed = 1;
      const rand = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const f = field(x / 46, y / 46);
          const ice = f > 0.52 ? 1 : f > 0.47 ? (f - 0.47) / 0.05 : 0;
          const backscatter = 0.18 + ice * 0.82;
          const speckle = -Math.log(1 - rand() * 0.999);
          const intensity = Math.min(1, backscatter * speckle * 0.62);
          const i = (y * w + x) * 4;
          img.data[i] = rgb[0];
          img.data[i + 1] = rgb[1];
          img.data[i + 2] = rgb[2];
          img.data[i + 3] = Math.round(intensity * (dark ? 150 : 60));
        }
      }
      ctx.putImageData(img, 0, 0);
    };
    draw();
    let timer: ReturnType<typeof setTimeout>;
    const resize = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(draw, 120);
    });
    resize.observe(el);
    const theme = new MutationObserver(draw);
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      clearTimeout(timer);
      resize.disconnect();
      theme.disconnect();
    };
  }, []);

  return <canvas ref={canvas} className={`speckle ${className}`} aria-hidden="true" />;
}
