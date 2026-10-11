"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { projects, type Project } from "@/lib/data";
import { FlickeringGrid } from "@/components/effects/FlickeringGrid";

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.documentElement.style.overflow;
    element?.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      element?.close();
      document.documentElement.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog ref={dialog} aria-labelledby="project-dialog-title" aria-describedby="project-dialog-description" onCancel={(event) => { event.preventDefault(); onClose(); }} onKeyDown={(event) => {
      if (event.key !== "Tab") return;
      const controls = event.currentTarget.querySelectorAll<HTMLButtonElement | HTMLAnchorElement>("button, a[href]");
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }} className="glass-panel-strong fixed m-auto max-h-[85dvh] w-[calc(100%_-_2rem)] max-w-xl overflow-y-auto rounded-2xl p-0 backdrop:bg-espresso/40 backdrop:backdrop-blur-sm">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="project-dialog-title" className="font-display text-3xl text-espresso">{project.title}</h2>
          <button type="button" autoFocus onClick={onClose} className="min-h-11 shrink-0 px-2 font-body text-sm font-semibold text-espresso/60">Close</button>
        </div>
        <p className="mt-4 font-body text-xs font-semibold uppercase tracking-wide text-terracotta">{project.metric}</p>
        <p id="project-dialog-description" className="mt-4 font-body leading-relaxed text-espresso/80">{project.description}</p>
        <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((tech) => <li key={tech} className="rounded-full border border-champagne/40 px-3 py-1 text-xs font-semibold text-terracotta">{tech}</li>)}
        </ul>
        <div className="mt-8 flex flex-wrap gap-5">
          <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-body text-sm font-semibold uppercase tracking-wide text-oxblood underline underline-offset-4">GitHub <span className="sr-only">(opens in a new tab)</span></a>
          {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-body text-sm font-semibold uppercase tracking-wide text-oxblood underline underline-offset-4">Live demo <span className="sr-only">(opens in a new tab)</span></a>}
        </div>
      </div>
    </dialog>, document.body,
  );
}

export default function Projects() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = projects.find((project) => project.id === activeId);
  return (
    <section id="projects" className="relative overflow-hidden px-6 py-16 md:px-12 md:py-24">
      <FlickeringGrid />
      <div className="relative mx-auto max-w-6xl">
        <p className="eyebrow mb-4">Selected work</p>
        <h2 className="font-display text-4xl text-espresso md:text-5xl">Projects.</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article key={project.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45, delay: index * 0.04 }} whileHover={{ y: -4 }} className="glass-panel group relative flex flex-col rounded-2xl p-6 shadow-glass transition-shadow hover:shadow-glass-lg md:p-8">
              <h3 className="font-display text-2xl text-espresso">
                <button type="button" onClick={() => setActiveId(project.id)} aria-haspopup="dialog" className="text-left after:absolute after:inset-0 after:rounded-2xl">{project.title}<span className="sr-only"> — explore project</span></button>
              </h3>
              <p className="mt-3 font-body text-sm leading-relaxed text-espresso/70">{project.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                {project.tech.map((tech) => <li key={tech} className="rounded-full border border-champagne/40 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-wide text-terracotta">{tech}</li>)}
              </ul>
              <p className="mt-6 font-body text-xs font-semibold text-oxblood">{project.metric}</p>
              <span aria-hidden="true" className="mt-auto pt-5 font-body text-xs font-semibold uppercase tracking-wide text-espresso/60">Explore project ↗</span>
            </motion.article>
          ))}
        </div>
      </div>
      {active && <ProjectDialog project={active} onClose={() => setActiveId(null)} />}
    </section>
  );
}
