import { ArrowUpRight, GitPullRequest } from "lucide-react";
import SectionHead from "@/components/sections/SectionHead";
import { awards, experience, openSource } from "@/lib/data";

export default function Experience() {
  return (
    <section id="experience" className="section section-alt" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead
          num="04"
          kicker="Experience & leadership"
          id="experience-title"
          title={
            <>
              Work and teaching
            </>
          }
        />

        <ol className="timeline">
          {experience.map((job) => (
            <li className="timeline-item reveal" key={job.id}>
              <div className="timeline-when">
                <span className="mono-label">{job.period}</span>
                <span className="timeline-where">{job.location}</span>
              </div>
              <div className="timeline-body">
                <h3>
                  {job.role} <span className="timeline-org">· {job.org}</span>
                </h3>
                <ul>
                  {job.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
                <ul className="chips chips-sm" aria-label="Skills">
                  {job.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div className="recognition">
          <div className="reveal">
            <h3 className="sub-title">Hackathons & awards</h3>
            <ul className="awards">
              {awards.map((award) => (
                <li className="award" key={award.id}>
                  <div className="award-top">
                    <span className={`award-result ${award.id === "greentag" ? "is-gold" : ""}`}>{award.result}</span>
                    <span className="mono-label">{award.event}</span>
                  </div>
                  <h4>
                    {award.href ? (
                      <a href={award.href} target="_blank" rel="noopener noreferrer" className="text-link">
                        {award.title} <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    ) : (
                      award.title
                    )}
                  </h4>
                  <p>{award.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="reveal">
            <h3 className="sub-title">Open source</h3>
            <ul className="prs">
              {openSource.map((pr) => (
                <li key={pr.href}>
                  <a className="pr" href={pr.href} target="_blank" rel="noopener noreferrer">
                    <GitPullRequest size={16} aria-hidden="true" className="pr-icon" />
                    <span className="pr-body">
                      <span className="pr-repo">
                        {pr.repo} <span className="pr-num">#{pr.number}</span>
                      </span>
                      <span className="pr-title">{pr.title}</span>
                    </span>
                    <span className="pr-status">{pr.status}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="prs-note">
              Bug reports and fixes upstream: a validation bug in pgmpy’s BDeu/BDs scores, and a broken CLI example in neural-lam’s docs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
