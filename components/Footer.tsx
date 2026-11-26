"use client";

import { ArrowUp, ArrowUpRight } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile, socials } from "@/lib/data";
import { setNotebook } from "@/lib/ui-store";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <p className="footer-sign">
            Stay curious<span>.</span>
          </p>
          <a className="icon-btn footer-up" href="#top" aria-label="Back to top">
            <ArrowUp size={18} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-grid">
          <div>
            <p className="mono-label">Elsewhere</p>
            <ul className="footer-links">
              {socials.map((s) => (
                <li key={s.id}>
                  <a href={s.href} target={s.id === "email" ? undefined : "_blank"} rel="noopener noreferrer">
                    {s.id === "github" ? <GitHubIcon size={14} /> : s.id === "linkedin" ? <LinkedInIcon size={14} /> : null}
                    {s.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mono-label">On this site</p>
            <ul className="footer-links">
              <li>
                <a href="#research">Research</a>
              </li>
              <li>
                <a href="#work">Work</a>
              </li>
              <li>
                <a href={profile.resumeUrl} download="Ritwik_Jain_Resume.pdf">
                  Résumé (PDF)
                </a>
              </li>
              <li>
                <button type="button" className="footer-nb" onClick={() => setNotebook(true)}>
                  ritwik.ipynb
                </button>
              </li>
            </ul>
          </div>
          <div className="footer-hint">
            <p className="mono-label">Hidden in plain sight</p>
            <p>
              Press <kbd>`</kbd> for the notebook, <kbd>⌘K</kbd> to search, and try the Konami code if you’re feeling nostalgic.
            </p>
          </div>
        </div>
        <div className="footer-meta">
          <p>© 2026 {profile.name} · New Delhi</p>
          <p>
            Built with Next.js, Motion and too much chai.{" "}
            <a className="text-link" href="https://github.com/Ritwik389/portfolio" target="_blank" rel="noopener noreferrer">
              Source
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
