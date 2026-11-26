"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerScroller, scrollToElement } from "@/lib/smooth-scroll";

/* Native wheel/touch scrolling stays native. Lenis only animates in-page
   anchor jumps; an IntersectionObserver reveals sections once. */
export default function ScrollExperience() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    const revealer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const observeAll = () =>
      document.querySelectorAll(".reveal:not(.is-in)").forEach((el) => revealer.observe(el));
    observeAll();
    const mutations = new MutationObserver(observeAll);
    mutations.observe(document.body, { childList: true, subtree: true });

    let lenis: Lenis | null = null;
    let raf = 0;
    let unregister = () => {};
    if (!reduced.matches) {
      lenis = new Lenis({
        smoothWheel: false,
        syncTouch: false,
        stopInertiaOnNavigate: true,
        prevent: (node) => Boolean(node.closest("dialog, [data-lenis-prevent]")),
      });
      unregister = registerScroller(lenis);
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const followAnchor = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (!anchor?.hash || anchor.hasAttribute("download") || anchor.target === "_blank") return;
      let id: string;
      try {
        id = decodeURIComponent(anchor.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      if (location.hash !== anchor.hash) history.pushState(history.state, "", anchor.hash);
      requestAnimationFrame(() => {
        if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
        scrollToElement(target, { immediate: anchor.classList.contains("skip-link") });
      });
    };
    document.addEventListener("click", followAnchor);

    return () => {
      revealer.disconnect();
      mutations.disconnect();
      document.removeEventListener("click", followAnchor);
      cancelAnimationFrame(raf);
      unregister();
      lenis?.destroy();
    };
  }, []);
  return null;
}
