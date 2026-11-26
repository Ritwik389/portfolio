import type Lenis from "lenis";

let scroller: Lenis | null = null;

export function registerScroller(instance: Lenis) {
  scroller = instance;
  return () => {
    if (scroller === instance) scroller = null;
  };
}

export function scrollToElement(
  element: HTMLElement,
  { immediate = false }: { immediate?: boolean } = {},
) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rect = element.getBoundingClientRect();
  const inset =
    parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
  const top = Math.max(0, window.scrollY + rect.top - inset);
  if (scroller && !reduced) {
    if (scroller.isStopped && !document.querySelector("dialog[open]"))
      scroller.start();
    scroller.scrollTo(top, { immediate, duration: 0.65, lerp: 0 });
  } else {
    window.scrollTo({
      top,
      behavior: immediate || reduced ? "instant" : "smooth",
    });
  }
}
