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
              A bit about me
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
              <span className="plate-caption-text">Me, on a day I dressed up.</span>
            </figcaption>
          </figure>

          <div className="about-text reveal">
            <p className="about-lead">
              I’m a second-year IT student at Delhi Technological University. Most of my time goes into machine learning, either research or
              building things.
            </p>
            <p>
              My research is on SAR sea-ice images: I benchmark vision-language models, fine-tune them with GRPO, and try to work out why they miss
              small, scattered pieces of ice. Outside of that I like building complete projects, like a speech separator I trained on Kaggle’s free
              GPU and a legal research assistant for Smart India Hackathon. This summer I interned at Deloitte, turning notebook-based ML workflows
              into AWS Glue jobs.
            </p>
            <p>Outside of all that, I’m part of AIMS-DTU, the college ML society, and help out with its first-year sessions now and then.</p>

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
