import type { ReactNode } from "react";

export default function SectionHead({
  num,
  kicker,
  title,
  intro,
  id,
  aside,
}: {
  num: string;
  kicker: string;
  title: ReactNode;
  intro?: ReactNode;
  id: string;
  aside?: ReactNode;
}) {
  return (
    <header className="section-head reveal">
      <p className="kicker">
        <span className="kicker-num">{num}</span>
        <span className="kicker-rule" aria-hidden="true" />
        <span>{kicker}</span>
      </p>
      <div className="section-head-row">
        <h2 className="section-title" id={id}>
          {title}
        </h2>
        {aside}
      </div>
      {intro && <p className="section-intro">{intro}</p>}
    </header>
  );
}
