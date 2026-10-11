"use client";

export interface Step {
  title: string;
  description: string;
  colorTheme?: "orange" | "blue" | "purple";
}

// The existing paper surface, orange accents, and ruled background are preserved.
export default function HowItWorks({ features = [] }: { features?: Step[] }) {
  return (
    <div className="relative rounded-2xl bg-white px-6 py-12 dark:bg-black sm:px-8">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.15]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px)", backgroundSize: "100% 32px", marginTop: "4px" }} />
      <div className="pointer-events-none absolute inset-0 opacity-0 dark:opacity-[0.1]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px)", backgroundSize: "100% 32px", marginTop: "4px" }} />
      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r" />
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l" />
      <ol className="relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-3 lg:gap-6">
        {features.map((step, index) => (
          <li key={step.title} className={`mx-auto w-full max-w-sm transition-transform duration-300 lg:max-w-none lg:hover:scale-105 ${index === 1 ? "lg:-rotate-[4deg]" : "lg:rotate-[4deg]"}`}>
            <div className="h-full rounded-[25px] border border-neutral-100 bg-white p-2 shadow-[0px_10px_20px_0px_#D3D3D3] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="mx-auto mb-5 h-8 w-8 text-orange-500 dark:text-orange-400" fill="currentColor"><path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007-.117v-4h-4a1 1 0 0 1 -.993-.883l-.007-.117v-2a1 1 0 0 1 .06-.34l.046-.107l1.894-3.791v-4.762a1 1 0 0 1 -.117-1.993l.117-.007h8z" /></svg>
              <div className="relative rounded-[15px] border border-orange-100 bg-orange-50 p-5 dark:border-orange-500/20 dark:bg-orange-500/10">
                <span className="mb-5 block text-4xl text-orange-500 dark:text-orange-400" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>0{index + 1}</span>
                <h3 className="mb-3 text-xl font-semibold leading-tight text-neutral-800 dark:text-neutral-100">{step.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{step.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
