"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useMediaQuery } from "@/components/Scene";

function TrailDot({ x, y, visible, index = 0 }: { x: MotionValue<number>; y: MotionValue<number>; visible: boolean; index?: number }) {
  const trailX = useSpring(x, { stiffness: 240, damping: 23, mass: 0.3 });
  const trailY = useSpring(y, { stiffness: 240, damping: 23, mass: 0.3 });
  return <>
    <motion.span data-cursor-trail aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[99] rounded-full bg-champagne" style={{ x: trailX, y: trailY, width: 6 - index * 0.6, height: 6 - index * 0.6, translateX: "-50%", translateY: "-50%", opacity: visible ? 0.45 - index * 0.05 : 0 }} />
    {index < 6 && <TrailDot x={trailX} y={trailY} visible={visible} index={index + 1} />}
  </>;
}

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const finePointer = useMediaQuery("(min-width: 768px) and (hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { damping: 28, stiffness: 320, mass: 0.4 });
  const springY = useSpring(cursorY, { damping: 28, stiffness: 320, mass: 0.4 });

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    document.body.classList.add("custom-cursor-enabled");
    const move = (event: MouseEvent) => { cursorX.set(event.clientX); cursorY.set(event.clientY); setIsVisible(true); };
    const over = (event: MouseEvent) => setIsHovering(!!(event.target as HTMLElement).closest("a, button, [data-cursor-hover]"));
    const leave = () => setIsVisible(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    document.addEventListener("mouseleave", leave);
    return () => {
      document.body.classList.remove("custom-cursor-enabled");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
    };
  }, [cursorX, cursorY, finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;
  return (
    <>
      <TrailDot x={springX} y={springY} visible={isVisible} />
      <motion.div data-cursor-ring aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-champagne/70 bg-champagne/10 backdrop-blur-sm" style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%", opacity: isVisible ? 1 : 0 }} animate={{ width: isHovering ? 52 : 32, height: isHovering ? 52 : 32, backgroundColor: isHovering ? "rgba(201, 162, 39, 0.18)" : "rgba(201, 162, 39, 0.10)" }} transition={{ type: "spring", damping: 24, stiffness: 300 }} />
    </>
  );
}
