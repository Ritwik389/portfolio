/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import SectionHead from "@/components/sections/SectionHead";
import VoiceSepVisual from "@/components/fx/VoiceSepVisual";
import { archive, projects, type Project } from "@/lib/data";

function host(href: string) {
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return href;
  }
}

function Media({ project }: { project: Project }) {
  if (project.visual === "voicesep") return <VoiceSepVisual />;
  if (!project.image) return null;
  return (
    <div className="shot">
      <div className="shot-bar" aria-hidden="true">
        <span className="vs-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="shot-url">{project.demo ? host(project.demo) : host(project.github)}</span>
      </div>
      <img src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} loading="lazy" decoding="async" />
    </div>
  );
}

function Links({ project }: { project: Project }) {
  return (
    <div className="project-links">
      <a className="btn btn-ghost btn-sm" href={project.github} target="_blank" rel="noopener noreferrer">
        <GitHubIcon size={15} /> Source
      </a>
      {project.demo && (
        <a className="btn btn-primary btn-sm" href={project.demo} target="_blank" rel="noopener noreferrer">
          Live demo <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

export default function Work() {
  const featured = projects.filter((p) => p.kind === "featured");
  const selected = projects.filter((p) => p.kind === "selected");
  return (
    <section id="work" className="section section-alt" aria-labelledby="work-title">
      <div className="wrap">
        <SectionHead
          num="02"
          kicker="Selected work"
          id="work-title"
          title={
            <>
              Things I’ve built
            </>
          }
          intro="Some started as hackathon entries, some as weekend experiments. The numbers are from my own evaluations, and the code for each one is on GitHub."
        />

        <div className="featured">
          {featured.map((project, i) => (
            <article id={`project-${project.id}`} className={`feature reveal ${i % 2 ? "is-flipped" : ""}`} key={project.id} aria-labelledby={`t-${project.id}`}>
              <div className="feature-media">
                <Media project={project} />
              </div>
              <div className="feature-text">
                <p className="feature-index">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span className="mono-label">
                    {project.category} · {project.period}
                  </span>
                </p>
                <h3 id={`t-${project.id}`} className="feature-title">
                  {project.title}
                </h3>
                <p className="feature-tagline">{project.tagline}</p>
                {project.badge && <p className="tag tag-signal feature-badge">{project.badge}</p>}
                <p className="feature-summary">{project.summary}</p>
                <dl className="metrics">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>{m.value}</dd>
                    </div>
                  ))}
                </dl>
                <details className="feature-more">
                  <summary>How it works</summary>
                  <ul>
                    {project.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                  {project.team && <p className="feature-team">{project.team}. My contributions are described above.</p>}
                </details>
                <ul className="chips chips-sm" aria-label="Tech stack">
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <Links project={project} />
              </div>
            </article>
          ))}
        </div>

        <div className="selected">
          {selected.map((project) => (
            <article id={`project-${project.id}`} className="card reveal" key={project.id} aria-labelledby={`t-${project.id}`}>
              <Media project={project} />
              <div className="card-body">
                <p className="mono-label">
                  {project.category} · {project.period}
                </p>
                <h3 id={`t-${project.id}`}>{project.title}</h3>
                <p className="card-tagline">{project.tagline}</p>
                {project.badge && <p className="tag tag-signal">{project.badge}</p>}
                <ul className="card-points">
                  {project.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
                <dl className="metrics metrics-sm">
                  {project.metrics.map((m) => (
                    <div key={m.label}>
                      <dt>{m.label}</dt>
                      <dd>{m.value}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="chips chips-sm" aria-label="Tech stack">
                  {project.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <Links project={project} />
              </div>
            </article>
          ))}
        </div>

        <div className="archive reveal">
          <div className="archive-head">
            <h3>Other projects</h3>
            <a className="text-link" href="https://github.com/Ritwik389?tab=repositories" target="_blank" rel="noopener noreferrer">
              All repositories <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>
          <ul className="archive-list">
            {archive.map((item) => (
              <li key={item.title}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="archive-year">{item.year}</span>
                  <span className="archive-title">{item.title}</span>
                  <span className="archive-note">{item.note}</span>
                  <span className="archive-tech">{item.tech}</span>
                  <ArrowUpRight className="archive-arrow" size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
