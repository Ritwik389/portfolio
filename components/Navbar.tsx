"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#hackathons", label: "Hackathons" },
  { href: "#education", label: "Education" },
  { href: "#certifications", label: "Certifications" },
  { href: "#achievements", label: "Achievements" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    const media = window.matchMedia("(min-width: 1280px)");
    const close = () => setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", outside);
    media.addEventListener("change", close);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", outside);
      media.removeEventListener("change", close);
    };
  }, [open]);

  return (
    <motion.header ref={header} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: "easeOut" }} className="fixed left-0 right-0 top-0 z-50 px-4">
      <nav aria-label="Main navigation" className={`glass-panel relative mx-auto mt-4 flex w-full max-w-6xl items-center justify-between gap-4 rounded-full px-5 transition-all duration-300 ${scrolled ? "py-2" : "py-3.5"}`}>
        <a href="#hero" onClick={() => setOpen(false)} className="font-display text-lg italic tracking-wide text-oxblood">Home</a>
        <ul className="hidden gap-4 xl:flex">
          {links.map((link) => <li key={link.href}><a href={link.href} className="font-body text-xs font-medium uppercase tracking-wide text-espresso/80 transition-colors hover:text-oxblood">{link.label}</a></li>)}
        </ul>
        <div className="flex items-center gap-3">
          <a href="#contact" onClick={() => setOpen(false)} className="rounded-full border border-champagne/60 bg-champagne/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-oxblood transition-colors hover:bg-champagne/20">Contact</a>
          <button ref={toggle} type="button" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close navigation menu" : "Open navigation menu"} onClick={() => setOpen(!open)} className="min-h-11 min-w-11 rounded-full border border-champagne/40 font-body text-xs font-semibold text-oxblood xl:hidden">{open ? "Close" : "Menu"}</button>
        </div>
        <ul id="mobile-navigation" hidden={!open} className="glass-panel-strong absolute left-0 right-0 top-full mt-3 max-h-[75dvh] overflow-y-auto rounded-2xl p-3 xl:hidden">
          {links.map((link) => <li key={link.href}><a href={link.href} onClick={() => setOpen(false)} className="block rounded-lg px-4 py-3 font-body text-sm font-medium text-espresso/80 hover:text-oxblood">{link.label}</a></li>)}
        </ul>
      </nav>
    </motion.header>
  );
}
