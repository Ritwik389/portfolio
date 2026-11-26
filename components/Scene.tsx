"use client";
/* eslint-disable @next/next/no-img-element */

import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  useCallback,
} from "react";
import type { Application } from "@splinetool/runtime";

export const interactiveSceneQuery =
  "(min-width: 768px) and (hover: hover) and (pointer: fine)";

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

function Ornament() {
  return (
    <div
      className="scene-ornament"
      aria-hidden="true"
    >
      <svg
        className="scene-ornament-ring"
        viewBox="0 0 300 300"
        fill="none"
      >
        <circle
          cx="150"
          cy="150"
          r="112"
          stroke="currentColor"
          strokeWidth="1"
        />
        <ellipse
          cx="150"
          cy="150"
          rx="128"
          ry="66"
          stroke="currentColor"
          strokeWidth="1"
          transform="rotate(-35 150 150)"
        />
        <ellipse
          cx="150"
          cy="150"
          rx="128"
          ry="66"
          stroke="currentColor"
          strokeWidth="1"
          transform="rotate(35 150 150)"
        />
      </svg>
      <span className="scene-ornament-mark">RJ</span>
    </div>
  );
}

class SceneBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Ornament /> : this.props.children;
  }
}

function ScenePoster({ poster, darkPoster }: { poster?: string; darkPoster?: string }) {
  if (!poster) return <Ornament />;
  return (
    <>
      <img
        className={darkPoster ? "hero-scene-poster hero-scene-poster-light" : "hero-scene-poster"}
        src={poster}
        width={552}
        height={552}
        alt=""
      />
      {darkPoster && (
        <img
          className="hero-scene-poster-dark"
          src={darkPoster}
          width={552}
          height={552}
          alt=""
        />
      )}
    </>
  );
}

function LoadedScene({
  scene,
  fitWidth,
  poster,
  darkPoster,
  background,
}: {
  scene: string;
  fitWidth?: number;
  poster?: string;
  darkPoster?: string;
  background?: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let application: Application | undefined;
    let observer: ResizeObserver | undefined;
    let themeObserver: MutationObserver | undefined;
    void import("@splinetool/runtime")
      .then(async ({ Application: SplineApplication }) => {
        const element = canvas.current;
        if (cancelled || !element) return;
        const spline = new SplineApplication(element, {
          renderOnDemand: true,
        });
        application = spline;
        await spline.load(scene);
        if (!cancelled) {
          if (background) {
            const variable = background.startsWith("var(") ? background.slice(4, -1) : null;
            const update = () => {
              const color = variable
                ? getComputedStyle(element).getPropertyValue(variable).trim()
                : background;
              spline.setBackgroundColor(color);
            };
            update();
            if (variable) {
              themeObserver = new MutationObserver(update);
              themeObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["data-theme"],
              });
            }
          }
          if (fitWidth && stage.current?.parentElement) {
            const parent = stage.current.parentElement;
            spline.setSize(fitWidth, fitWidth);
            const resize = () => {
              if (stage.current)
                stage.current.style.transform = `translate(-50%, -50%) scale(${Math.min(parent.clientWidth, parent.clientHeight) / fitWidth})`;
            };
            resize();
            observer = new ResizeObserver(resize);
            observer.observe(parent);
          }
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      observer?.disconnect();
      themeObserver?.disconnect();
      application?.dispose();
    };
  }, [scene, fitWidth, background]);
  return (
    <>
      {!ready && (
        <div className="absolute inset-0">
          <ScenePoster poster={poster} darkPoster={darkPoster} />
        </div>
      )}
      {!failed && (
        <div
          ref={stage}
          className="absolute"
          style={
            fitWidth
              ? {
                  width: fitWidth,
                  height: fitWidth,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }
              : { inset: 0 }
          }
        >
          <canvas
            ref={canvas}
            aria-hidden="true"
            className="relative h-full w-full"
            style={{ visibility: ready ? "visible" : "hidden" }}
          />
        </div>
      )}
    </>
  );
}

export default function Scene({
  scene,
  poster,
  darkPoster,
  fitWidth,
  paused = false,
  background,
}: {
  scene: string;
  poster?: string;
  darkPoster?: string;
  fitWidth?: number;
  paused?: boolean;
  background?: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const finePointer = useMediaQuery(interactiveSceneQuery);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearViewport(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  const showScene = nearViewport && finePointer && !reducedMotion && !paused;
  return (
    <div ref={container} className="relative h-full w-full" aria-hidden="true">
      {!showScene && (
        <div className="absolute inset-0">
          <ScenePoster poster={poster} darkPoster={darkPoster} />
        </div>
      )}
      {showScene && (
        <SceneBoundary>
          <LoadedScene
            scene={scene}
            fitWidth={fitWidth}
            poster={poster}
            darkPoster={darkPoster}
            background={background}
          />
        </SceneBoundary>
      )}
    </div>
  );
}
