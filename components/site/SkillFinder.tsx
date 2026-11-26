"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { Search, X, ArrowDownRight } from "lucide-react";
import { archive, experience, profile, projects, research } from "@/lib/data";

const evidence = [
  ...research.map((item) => ({
    id: item.id,
    title: item.title,
    href: "#research",
    skills: item.methods.join(" / "),
    detail: item.summary,
    searchable: `${item.title} ${item.area} ${item.methods.join(" ")} ${item.points.join(" ")} research`,
  })),
  ...projects.map((project) => ({
    id: project.id,
    title: project.title,
    href: `#project-${project.id}`,
    skills: project.tech.join(" / "),
    detail: project.tagline,
    searchable: `${project.title} ${project.category} ${project.tech.join(" ")} ${project.summary} ${project.points.join(" ")}`,
  })),
  ...experience.map((job) => ({
    id: job.id,
    title: `${job.org}, ${job.role}`,
    href: "#experience",
    skills: job.tech.join(" / "),
    detail: job.points[0],
    searchable: `${job.org} ${job.role} ${job.tech.join(" ")} ${job.points.join(" ")}`,
  })),
  ...archive.map((item) => ({
    id: item.title,
    title: item.title,
    href: item.href,
    skills: item.tech,
    detail: item.note,
    searchable: `${item.title} ${item.tech} ${item.note}`,
  })),
];

export default function SkillFinder() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const previousOverflow = useRef("");
  const previousFocus = useRef<HTMLElement | null>(null);
  const navigating = useRef(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = evidence.filter((item) =>
    words.every((word) => item.searchable.toLowerCase().includes(word)),
  );

  function open() {
    if (!dialog.current || dialog.current.open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    previousOverflow.current = document.body.style.overflow;
    navigating.current = false;
    setQuery("");
    setActive(0);
    dialog.current.showModal();
    document.body.style.overflow = "hidden";
    input.current?.focus();
  }
  function closed() {
    document.body.style.overflow = previousOverflow.current;
    if (!navigating.current)
      previousFocus.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    const modal = dialog.current;
    const shortcut = (event: globalThis.KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k" &&
        !event.altKey
      ) {
        event.preventDefault();
        open();
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => {
      document.removeEventListener("keydown", shortcut);
      if (modal?.open) document.body.style.overflow = previousOverflow.current;
    };
  }, []);

  function navigate(event: KeyboardEvent, index: number) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = index + (event.key === "ArrowDown" ? 1 : -1);
      if (next < 0) input.current?.focus();
      else if (results.length) {
        const target = Math.min(next, results.length - 1);
        setActive(target);
        links.current[target]?.focus();
      }
    } else if (index === -1 && event.key === "Enter" && results.length) {
      event.preventDefault();
      links.current[active]?.click();
    }
  }
  function select(href: string) {
    navigating.current = true;
    dialog.current?.close();
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }),
    );
  }

  return (
    <>
      <button
        className="icon-btn finder-trigger"
        onClick={open}
        aria-haspopup="dialog"
        aria-controls="skill-finder"
        aria-label="Find skills and project evidence"
      >
        <Search size={16} aria-hidden="true" />
        <span className="finder-trigger-label">Search</span>
        <kbd>⌘K</kbd>
      </button>
      <dialog
        id="skill-finder"
        ref={dialog}
        className="finder"
        aria-labelledby="finder-title"
        onClose={closed}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            dialog.current?.close();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <motion.div
          className="finder-sheet"
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        >
          <div className="finder-heading">
            <h2 id="finder-title">
              Find the evidence
            </h2>
            <form method="dialog">
              <button
                className="icon-btn finder-close"
                aria-label="Close skill finder"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </form>
          </div>
          <label htmlFor="finder-search">Search skills or projects</label>
          <div className="finder-search-row">
            <Search size={22} aria-hidden="true" />
            <input
              ref={input}
              id="finder-search"
              type="search"
              autoComplete="off"
              spellCheck={false}
              value={query}
              placeholder="Try GRPO, speech, RAG, AWS, React…"
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => navigate(event, -1)}
            />
          </div>
          <p className="finder-count" role="status" aria-live="polite">
            {results.length} {results.length === 1 ? "match" : "matches"} across research, projects and experience
          </p>
          <ul className="finder-results">
            {results.map((item, index) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`finder-result ${active === index ? "active" : ""}`}
                  ref={(node) => {
                    links.current[index] = node;
                  }}
                  onFocus={() => setActive(index)}
                  onPointerEnter={() => setActive(index)}
                  onKeyDown={(event) => navigate(event, index)}
                  onClick={() => (item.href.startsWith("#") ? select(item.href) : dialog.current?.close())}
                >
                  <span className="finder-result-title">
                    {item.title}
                    <ArrowDownRight size={22} aria-hidden="true" />
                  </span>
                  <span className="finder-result-skills">{item.skills}</span>
                  <span className="finder-result-detail">{item.detail}</span>
                </a>
              </li>
            ))}
          </ul>
          {!results.length && (
            <div className="finder-empty">
              <p>
                No matching evidence yet. Browse all work or download the résumé.
              </p>
              <a
                className="text-link"
                href="#projects"
                onClick={() => select("#projects")}
              >
                Browse all projects
              </a>
              <a
                className="text-link"
                href={profile.resumeUrl}
                download="Ritwik_Jain_Resume.pdf"
              >
                Download résumé
              </a>
            </div>
          )}
          <p className="finder-help">
            Arrow keys to browse. Enter to open. Escape to close.
          </p>
        </motion.div>
      </dialog>
    </>
  );
}
