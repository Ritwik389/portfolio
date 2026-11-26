"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import SkillFinder from "@/components/site/SkillFinder";
import ThemeToggle from "@/components/ThemeToggle";
import { setNotebook } from "@/lib/ui-store";
import { profile } from "@/lib/data";

const links = [
  { href: "#research", label: "Research" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

function NotebookButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      className="nb-trigger"
      onClick={() => {
        onClick?.();
        setNotebook(true);
      }}
      title="Open the notebook edition of this site (shortcut: `)"
    >
      <span className="nb-trigger-braces" aria-hidden="true">
        {"{ }"}
      </span>
      <span>ritwik.ipynb</span>
    </button>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const sections = document.querySelectorAll(["#top", ...links.map((l) => l.href)].join(","));
    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) setActive(entry.target.id === "top" ? "" : `#${entry.target.id}`);
        },
        { rootMargin: `-${Math.round(innerHeight * 0.3)}px 0px -${Math.round(innerHeight * 0.6)}px 0px` },
      );
      sections.forEach((section) => observer?.observe(section));
    };
    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const outside = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", key);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  return (
    <header className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`} ref={header}>
      <nav className="nav-inner" aria-label="Main">
        <a href="#top" className="nav-mark" aria-label={`${profile.name}, back to top`} onClick={() => setOpen(false)}>
          <span className="nav-mark-glyph" aria-hidden="true">
            RJ
          </span>
          <span className="nav-mark-name">Ritwik Jain</span>
        </a>
        <div className="nav-links">
          {links.map((link) => (
            <a key={link.href} href={link.href} aria-current={active === link.href ? "location" : undefined}>
              {link.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <SkillFinder />
          <NotebookButton />
          <ThemeToggle />
          <button
            ref={toggle}
            type="button"
            className="icon-btn nav-menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </nav>
      <div id="mobile-nav" className="mobile-nav" hidden={!open}>
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
        ))}
        <div className="mobile-nav-row">
          <NotebookButton onClick={() => setOpen(false)} />
          <a className="btn btn-ghost" href={profile.resumeUrl} download="Ritwik_Jain_Resume.pdf">
            Résumé
          </a>
        </div>
      </div>
    </header>
  );
}
