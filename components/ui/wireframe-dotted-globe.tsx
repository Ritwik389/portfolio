"use client";

import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { geoDistance, geoGraticule, geoOrthographic, geoPath } from "d3";
import type { FeatureCollection, Polygon, MultiPolygon } from "geojson";
import landGeometry from "@/lib/globe-land-geometry.json";
import landPoints from "@/lib/globe-land.json";
import { cn } from "@/lib/utils";
import { useCanvasAnimation, type CanvasFrame } from "@/components/effects/useCanvasAnimation";

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
}

const land = landGeometry as FeatureCollection<Polygon | MultiPolygon>;
const dots = landPoints as [number, number][];
const graticule = geoGraticule().step([15, 15])();
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

// Adapted from the supplied 21st.dev reference: D3's orthographic projection,
// graticule, coastline paths, and halftone land dots, in the portfolio palette.
export default function RotatingEarth({ width = 800, height = 600, className = "" }: RotatingEarthProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const projection = useRef(geoOrthographic().clipAngle(90));
  const rotation = useRef<[number, number, number]>([-20, -12, 0]);
  const zoom = useRef(1);
  const previousTime = useRef<number | null>(null);
  const lastFrame = useRef<CanvasFrame | null>(null);
  const drag = useRef<{ x: number; y: number; rotation: [number, number, number] } | null>(null);

  const draw = useCallback((frame: CanvasFrame) => {
    const { context, width, height, time, color, reducedMotion } = frame;
    lastFrame.current = frame;
    const delta = previousTime.current === null ? 0 : clamp(time - previousTime.current, 0, 0.1);
    previousTime.current = time;
    if (!reducedMotion && !drag.current) rotation.current[0] = (rotation.current[0] + delta * 8) % 360;

    const radius = Math.min(width, height) * 0.45;
    const cx = width / 2, cy = height / 2;
    const globe = projection.current
      .scale(radius * zoom.current)
      .translate([cx, cy])
      .rotate(rotation.current);
    const path = geoPath(globe, context);

    // Keep zoom inside the same globe silhouette, clear of neighbouring content.
    context.save();
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = color;
    context.fillStyle = color;

    context.beginPath();
    path(graticule);
    context.lineWidth = 0.65;
    context.globalAlpha = 0.22;
    context.stroke();

    context.beginPath();
    path(land);
    context.lineWidth = 0.9;
    context.globalAlpha = 0.7;
    context.stroke();

    const center = globe.invert?.([cx, cy]);
    if (center) {
      context.globalAlpha = 0.85;
      const dotRadius = 1.05 * Math.min(1, radius / 216) * zoom.current;
      for (const point of dots) {
        // Direct projection does not cull the back hemisphere of individual dots.
        if (geoDistance(center, point) > Math.PI / 2) continue;
        const projected = globe(point);
        if (!projected) continue;
        context.beginPath();
        context.arc(projected[0], projected[1], dotRadius, 0, Math.PI * 2);
        context.fill();
      }
    }
    context.restore();
    context.beginPath();
    context.arc(cx, cy, radius, 0, Math.PI * 2);
    context.strokeStyle = color;
    context.lineWidth = 1.25;
    context.globalAlpha = 0.65;
    context.stroke();
    context.globalAlpha = 1;
  }, []);

  useCanvasAnimation(canvas, draw, 24);

  const redraw = useCallback(() => {
    const frame = lastFrame.current;
    if (!frame) return;
    frame.context.clearRect(0, 0, frame.width, frame.height);
    draw(frame);
  }, [draw]);

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const wheel = (event: WheelEvent) => {
      // Page scrolling remains available until the user focuses the globe.
      if (document.activeElement !== element) return;
      event.preventDefault();
      zoom.current = clamp(zoom.current * (event.deltaY > 0 ? 0.9 : 1.1), 0.75, 2);
      redraw();
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => element.removeEventListener("wheel", wheel);
  }, [redraw]);

  const startDrag = (event: PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0) return;
    if (event.pointerType === "mouse") event.currentTarget.focus({ preventScroll: true });
    drag.current = { x: event.clientX, y: event.clientY, rotation: [...rotation.current] };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const rotate = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!drag.current) return;
    const sensitivity = 180 / event.currentTarget.getBoundingClientRect().width;
    rotation.current = [
      drag.current.rotation[0] + (event.clientX - drag.current.x) * sensitivity,
      clamp(drag.current.rotation[1] - (event.clientY - drag.current.y) * sensitivity, -85, 85),
      0,
    ];
    redraw();
  };
  const keyboard = (event: KeyboardEvent<HTMLCanvasElement>) => {
    switch (event.key) {
      case "ArrowLeft": rotation.current[0] -= 10; break;
      case "ArrowRight": rotation.current[0] += 10; break;
      case "ArrowUp": rotation.current[1] = clamp(rotation.current[1] + 10, -85, 85); break;
      case "ArrowDown": rotation.current[1] = clamp(rotation.current[1] - 10, -85, 85); break;
      case "+": case "=": zoom.current = clamp(zoom.current * 1.1, 0.75, 2); break;
      case "-": zoom.current = clamp(zoom.current * 0.9, 0.75, 2); break;
      case "Home": rotation.current = [-20, -12, 0]; zoom.current = 1; break;
      default: return;
    }
    event.preventDefault();
    redraw();
  };

  return (
    <div className={cn("relative max-w-full overflow-hidden text-champagne", className)} style={{ width, aspectRatio: `${width} / ${height}` }}>
      <canvas
        ref={canvas}
        data-effect="dotted-globe"
        role="img"
        tabIndex={0}
        aria-label="Interactive dotted globe. Drag or use arrow keys to rotate. Click then scroll, or use plus and minus, to zoom. Press Home to reset."
        className="absolute inset-0 h-full w-full touch-pan-y rounded-2xl focus-visible:outline focus-visible:outline-1 focus-visible:outline-champagne/60"
        onPointerDown={startDrag}
        onPointerMove={rotate}
        onPointerUp={() => { drag.current = null; }}
        onPointerCancel={() => { drag.current = null; }}
        onLostPointerCapture={() => { drag.current = null; }}
        onKeyDown={keyboard}
      />
      <p aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 text-center font-body text-[10px] text-oxblood/60">
        Drag to rotate<span className="hidden sm:inline"> · Click then scroll to zoom</span>
      </p>
    </div>
  );
}
