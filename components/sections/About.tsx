/* eslint-disable @next/next/no-img-element */
import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/sections/SectionHead";
import Ratings from "@/components/sections/Ratings";
import { certifications, education, now, profile, skillGroups } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead
          num="05"
          kicker="About"
          id="about-title"
          title={
            <>
              Curious by default, <em>rigorous by habit</em>
            </>
          }
        />
        <div className="about-grid">
          <figure className="portrait plate reveal">
            <span className="plate-tick tl" aria-hidden="true" />
            <span className="plate-tick tr" aria-hidden="true" />
            <span className="plate-tick bl" aria-hidden="true" />
            <span className="plate-tick br" aria-hidden="true" />
            <img src={profile.portrait} alt="Portrait of Ritwik Jain in a dark blazer and white shirt" width={1193} height={1318} loading="lazy" />
            <figcaption className="plate-caption">
              <span className="mono-label">FIG. 05 · the researcher</span>
              <span className="plate-caption-text">Rarely this well dressed during a training run.</span>
            </figcaption>
          </figure>

          <div className="about-text reveal">
            <p className="about-lead">
              I’m a second-year IT undergraduate at Delhi Technological University. I like problems where the honest answer takes work: is the model
              right, or just confident?
            </p>
            <p>
              My research is on reasoning segmentation for SAR sea-ice imagery: benchmarking vision-language models, fine-tuning them with GRPO, and
              digging into why they miss scattered targets. Outside the lab I build systems end to end, from a five-speaker speech separator trained on
              a free GPU to RAG assistants that prove their claims, and I spent a summer at Deloitte moving ML from notebooks into production on AWS.
            </p>
            <p>I also co-teach first-year students machine learning at AIMS-DTU and mentor school students.</p>

            <div className="now">
              <p className="mono-label">
                <span className="status-dot" aria-hidden="true" /> Now · November 2026
              </p>
              <ul>
                {now.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="stack reveal">
          {skillGroups.map((group) => (
            <div className="stack-group" key={group.title}>
              <h3 className="mono-label">{group.title}</h3>
              <ul className="chips">
                {group.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="creds">
          <div className="reveal">
            <h3 className="sub-title">Education</h3>
            <ul className="edu">
              {education.map((e) => (
                <li key={e.id}>
                  <span className="mono-label">{e.period}</span>
                  <span className="edu-school">{e.school}</span>
                  <span className="edu-degree">{e.degree}</span>
                  <span className="edu-score">{e.detail}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h3 className="sub-title">Certifications</h3>
            <ul className="certs">
              {certifications.map((c) => (
                <li key={c.id}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    <span className="cert-name">{c.name}</span>
                    <span className="cert-issuer">
                      {c.issuer} · {c.date}
                    </span>
                    <ArrowUpRight size={15} aria-hidden="true" className="cert-arrow" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Ratings />
        </div>
      </div>
    </section>
  );
}
