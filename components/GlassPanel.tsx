import type { HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLElement> {
  strong?: boolean;
  as?: "div" | "section" | "article";
}

export default function GlassPanel({ as: Element = "div", className = "", strong = false, children, ...props }: GlassPanelProps) {
  return <Element className={`${strong ? "glass-panel-strong" : "glass-panel"} rounded-2xl ${className}`} {...props}>{children}</Element>;
}
