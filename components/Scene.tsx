"use client";

import { Component, useEffect, useRef, useState, useSyncExternalStore, useCallback } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false });

export function useMediaQuery(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, () => false);
}

function Ornament() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden="true">
      <svg className="absolute h-4/5 w-4/5 text-champagne/40" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="112" stroke="currentColor" strokeWidth="1" />
        <ellipse cx="150" cy="150" rx="128" ry="66" stroke="currentColor" strokeWidth="1" transform="rotate(-35 150 150)" />
        <ellipse cx="150" cy="150" rx="128" ry="66" stroke="currentColor" strokeWidth="1" transform="rotate(35 150 150)" />
      </svg>
      <span className="font-display text-7xl italic text-oxblood md:text-8xl">RJ</span>
    </div>
  );
}

class SceneBoundary extends Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <Ornament /> : this.props.children; }
}

function LoadedScene({ scene }: { scene: string }) {
  const [ready, setReady] = useState(false);
  return <>
    {!ready && <div className="absolute inset-0"><Ornament /></div>}
    <Spline scene={scene} renderOnDemand onLoad={() => setReady(true)} className="relative h-full w-full" />
  </>;
}

export default function Scene({ scene }: { scene: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const finePointer = useMediaQuery("(min-width: 768px) and (hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => setNearViewport(entry.isIntersecting), { rootMargin: "200px" });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  const showScene = nearViewport && finePointer && !reducedMotion;
  return (
    <div ref={container} className="relative h-full w-full" aria-hidden="true">
      {!showScene && <div className="absolute inset-0"><Ornament /></div>}
      {showScene && (
        <SceneBoundary>
          <LoadedScene scene={scene} />
        </SceneBoundary>
      )}
    </div>
  );
}
