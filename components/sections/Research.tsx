import { ArrowUpRight } from "lucide-react";
import SectionHead from "@/components/sections/SectionHead";
import SeaIceFigure from "@/components/fx/SeaIceFigure";
import { interests, research } from "@/lib/data";

export default function Research() {
  const [lead, ...rest] = research;
  return (
    <section id="research" className="section" aria-labelledby="research-title">
      <div className="wrap">
        <SectionHead
          num="01"
          kicker="Research"
          id="research-title"
          title={
            <>
              What I’m researching
            </>
          }
          intro="Right now that’s mostly one project: getting vision-language models to segment sea ice in satellite radar images. On the side, I’ve been looking at what fine-tuning actually changes inside a language model."
        />

        <article className="research-lead reveal" aria-labelledby={`r-${lead.id}`}>
          <div className="research-text">
            <div className="research-meta">
              <span className="tag tag-signal">
                <span className="status-dot" aria-hidden="true" /> {lead.status}
              </span>
              <span className="mono-label">{lead.area}</span>
            </div>
            <h3 id={`r-${lead.id}`} className="research-title">
              {lead.title}
            </h3>
            <p className="research-summary">{lead.summary}</p>
            <ol className="research-points">
              {lead.points.map((point, i) => (
                <li key={i}>
                  <span className="research-step" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ol>
            <ul className="chips" aria-label="Methods">
              {lead.methods.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
          <SeaIceFigure />
        </article>

        <div className="research-grid">
          {rest.map((item) => (
            <article className="research-card reveal" key={item.id} aria-labelledby={`r-${item.id}`}>
              <div className="research-meta">
                <span className="tag">{item.status}</span>
                <span className="mono-label">{item.area}</span>
              </div>
              <h3 id={`r-${item.id}`}>{item.title}</h3>
              <p>{item.summary}</p>
              <ul className="research-bullets">
                {item.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <div className="research-card-foot">
                <ul className="chips chips-sm" aria-label="Methods">
                  {item.methods.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
                {item.link && (
                  <a className="text-link" href={item.link.href} target="_blank" rel="noopener noreferrer">
                    {item.link.label} <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
          <aside className="research-card research-interests reveal" aria-label="Research interests">
            <p className="mono-label">Interests</p>
            <ul className="interest-list">
              {interests.map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
            <p className="research-note">
              I’m looking for research internships in multimodal learning, speech or interpretability.{" "}
              <a className="text-link" href="#contact">
                Get in touch
              </a>
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
