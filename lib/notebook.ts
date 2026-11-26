/* The ritwik.ipynb kernel: a small whitelisted interpreter.
   It never evaluates JavaScript or Python. Every input is matched against
   known commands; everything else is a friendly NameError. Pure and
   data-driven so it can be unit-tested without React. */

import type * as Data from "./data";

export interface NotebookData {
  profile: typeof Data.profile;
  research: typeof Data.research;
  projects: typeof Data.projects;
  archive: typeof Data.archive;
  experience: typeof Data.experience;
  awards: typeof Data.awards;
  education: typeof Data.education;
  skillGroups: typeof Data.skillGroups;
  openSource: typeof Data.openSource;
  socials: typeof Data.socials;
  certifications: typeof Data.certifications;
  interests: typeof Data.interests;
  now: typeof Data.now;
}

export type Tone = "muted" | "accent" | "warn" | "ok";
export type Action =
  | { type: "site"; section?: string }
  | { type: "theme"; theme: "light" | "dark" | "toggle" }
  | { type: "resume" }
  | { type: "mail" }
  | { type: "clear" }
  | { type: "restart" }
  | { type: "open"; href: string };

export type Output =
  | { kind: "text"; text: string; tone?: Tone }
  | { kind: "md"; title?: string; lines: string[] }
  | { kind: "table"; columns: string[]; rows: string[][]; caption?: string }
  | { kind: "bars"; title: string; bars: { label: string; value: number; display: string }[]; note?: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "links"; links: { label: string; href: string }[] }
  | { kind: "pre"; text: string }
  | { kind: "stream"; lines: string[] }
  | { kind: "error"; ename: string; evalue: string; hint?: string }
  | { kind: "action"; action: Action; text: string };

export interface Doc {
  call: string;
  doc: string;
}

export const docs: Record<string, Doc> = {
  about: { call: "ritwik.about()", doc: "Who Ritwik is, in one cell." },
  research: { call: "ritwik.research()", doc: "Current research questions and methods." },
  projects: { call: "ritwik.projects()", doc: "All projects as a DataFrame." },
  project: { call: 'ritwik.project("voicesep")', doc: "Deep dive into one project by id." },
  eval: { call: 'ritwik.eval("digital-twin")', doc: "Plot a project’s measured results." },
  experience: { call: "ritwik.experience()", doc: "Work and leadership history." },
  skills: { call: "ritwik.skills()", doc: "Languages, ML stack and tools." },
  awards: { call: "ritwik.awards()", doc: "Hackathons and prizes." },
  education: { call: "ritwik.education()", doc: "Schools and grades." },
  open_source: { call: "ritwik.open_source()", doc: "Upstream pull requests." },
  now: { call: "ritwik.now()", doc: "What’s on the desk this month." },
  contact: { call: "ritwik.contact()", doc: "Ways to reach Ritwik." },
  resume: { call: "ritwik.resume()", doc: "Download the résumé PDF." },
  theme: { call: 'ritwik.theme("dark")', doc: "Switch between paper and lab themes." },
  export_to_glue: { call: "ritwik.export_to_glue()", doc: "Productionise this notebook. Allegedly." },
};

export const suggestions = [
  "ritwik.about()",
  "ritwik.research()",
  "ritwik.projects()",
  'ritwik.project("voicesep")',
  'ritwik.eval("digital-twin")',
  "ritwik.experience()",
  "ritwik.contact()",
  "!nvidia-smi",
  "model.fit(life)",
];

export const completions = [
  ...Object.values(docs).map((d) => d.call.replace(/\(.*\)$/, "(")),
  "help()",
  "exit()",
  "clear",
  "ls",
  "cat about.md",
  "!nvidia-smi",
  "model.fit(life)",
  "import this",
  "%timeit ritwik.procrastinate()",
  "!sudo hire ritwik",
];

export const files = [
  { name: "about.md", run: "cat about.md" },
  { name: "research/", run: "ritwik.research()" },
  { name: "projects.csv", run: "ritwik.projects()" },
  { name: "experience.json", run: "ritwik.experience()" },
  { name: "skills.yaml", run: "ritwik.skills()" },
  { name: "awards.md", run: "ritwik.awards()" },
  { name: "resume.pdf", run: "ritwik.resume()" },
];

const text = (t: string, tone?: Tone): Output => ({ kind: "text", text: t, tone });
const error = (ename: string, evalue: string, hint?: string): Output => ({ kind: "error", ename, evalue, hint });

function distance(a: string, b: string) {
  const m = a.length, n = b.length;
  const row = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[n];
}

export function nearest(input: string, options: string[]) {
  let best = "", score = Infinity;
  for (const option of options) {
    const d = distance(input.toLowerCase(), option.toLowerCase());
    if (d < score) { best = option; score = d; }
  }
  return score <= Math.max(2, Math.floor(best.length / 3)) ? best : null;
}

/* A tiny arithmetic parser (+ - * / % ** and parentheses). No eval. */
export function arithmetic(src: string): number | null {
  if (!/^[\d\s+\-*/%.()]+$/.test(src) || !/\d/.test(src)) return null;
  const tokens = src.match(/\*\*|\d+\.?\d*|\.\d+|[+\-*/%()]/g);
  if (!tokens || tokens.join("") !== src.replace(/\s+/g, "")) return null;
  let i = 0;
  const peek = () => tokens[i];
  const take = () => tokens[i++];
  function primary(): number {
    const t = take();
    if (t === "(") { const v = sum(); if (take() !== ")") throw new Error(); return v; }
    if (t === "-") return -power();
    if (t === "+") return power();
    const v = Number(t);
    if (!Number.isFinite(v)) throw new Error();
    return v;
  }
  function power(): number {
    const base = primary();
    if (peek() === "**") { take(); return base ** power(); }
    return base;
  }
  function product(): number {
    let v = power();
    while (peek() === "*" || peek() === "/" || peek() === "%") {
      const op = take(), r = power();
      v = op === "*" ? v * r : op === "/" ? v / r : v % r;
    }
    return v;
  }
  function sum(): number {
    let v = product();
    while (peek() === "+" || peek() === "-") {
      const op = take(), r = product();
      v = op === "+" ? v + r : v - r;
    }
    return v;
  }
  try {
    const v = sum();
    return i === tokens.length ? v : null;
  } catch {
    return null;
  }
}

function findProject(data: NotebookData, raw: string) {
  const id = raw.toLowerCase().replace(/[\s_]/g, "-");
  return data.projects.find((p) => p.id === id || p.title.toLowerCase() === raw.toLowerCase());
}

const zen = [
  "Check the dataset before blaming the model.",
  "Save checkpoints. Kaggle sessions end without warning.",
  "Run the baseline first. It’s often closer than you’d like.",
  "Read the whole error message.",
  "If the demo works on the first try, something is wrong.",
  "Write the README while you still remember how it works.",
];

export function run(rawInput: string, data: NotebookData): Output[] {
  const input = rawInput.trim();
  if (!input) return [];
  const lower = input.toLowerCase().replace(/\s+/g, " ");
  const { profile } = data;

  // Docstrings: ritwik.project? / help(ritwik.projects)
  const docMatch = input.match(/^(?:help\()?ritwik\.(\w+)(?:\(\))?\)?\s*\?$|^help\(ritwik\.(\w+)\)$/);
  if (docMatch) {
    const key = docMatch[1] || docMatch[2];
    const doc = docs[key];
    return doc
      ? [{ kind: "md", title: `Signature: ${doc.call}`, lines: [`Docstring: ${doc.doc}`] }]
      : [error("AttributeError", `'Ritwik' object has no attribute '${key}'`, nearestHint(key))];
  }

  if (["help", "help()", "?", "%help", "man ritwik"].includes(lower)) {
    return [
      { kind: "md", title: "ritwik.ipynb — available commands", lines: ["Shift + Enter runs a cell. Tab completes. ↑/↓ walks history."] },
      { kind: "table", columns: ["call", "what it does"], rows: Object.values(docs).map((d) => [d.call, d.doc]) },
      text("Also try: ls · cat about.md · !nvidia-smi · model.fit(life) · import this · exit()", "muted"),
    ];
  }

  if (["exit()", "quit()", "exit", "quit", "%site", "q"].includes(lower))
    return [{ kind: "action", action: { type: "site" }, text: "Kernel detached. Returning to the website…" }];

  if (["clear", "%clear", "cls", "clear()"].includes(lower))
    return [{ kind: "action", action: { type: "clear" }, text: "" }];

  if (["%restart", "restart", "ritwik.restart()"].includes(lower))
    return [{ kind: "action", action: { type: "restart" }, text: "Kernel restarted." }];

  if (lower === "ritwik" || lower === "print(ritwik)" || lower === "repr(ritwik)")
    return [text(`<Ritwik: undergraduate researcher @ DTU | gpa=9.40 | focus='multimodal AI' | status='${profile.status.toLowerCase()}'>`)];

  if (lower === "from ritwik import ritwik" || lower === "import ritwik")
    return [text("✓ ritwik 2026.11 loaded — 5 featured projects, 1 paper in preparation, 0 unhandled exceptions (so far)", "ok")];

  if (lower === "ls" || lower === "!ls" || lower === "ls -la" || lower === "!ls -la")
    return [{ kind: "pre", text: files.map((f) => `${f.name.endsWith("/") ? "drwxr-xr-x" : "-rw-r--r--"}  ritwik  ${f.name}`).join("\n") }];

  if (/^!?cat about\.md$/.test(lower) || lower === "ritwik.about()") {
    return [
      { kind: "md", title: `# ${profile.name}`, lines: [profile.role, profile.summary] },
      { kind: "table", columns: ["key", "value"], rows: [
        ["based in", profile.location],
        ["university", "Delhi Technological University · B.Tech IT · GPA 9.40"],
        ["previously", "AI/ML Intern, Deloitte (Apr – Jul 2026)"],
        ["interests", data.interests.join(", ")],
        ["status", profile.status],
      ] },
    ];
  }

  if (lower === "ritwik.research()") {
    return [
      ...data.research.map((r): Output => ({
        kind: "md",
        title: `${r.title} — ${r.status}`,
        lines: [r.summary, ...r.points.map((p) => `• ${p}`), `methods: ${r.methods.join(" · ")}`],
      })),
      text("Unpublished work is described at résumé level only until the paper is out.", "muted"),
    ];
  }

  if (lower === "ritwik.projects()" || lower === "projects" || lower === "df = ritwik.projects()") {
    return [{
      kind: "table",
      caption: `DataFrame: ${data.projects.length + data.archive.length} rows × 4 columns`,
      columns: ["id", "area", "headline result", "stack"],
      rows: [
        ...data.projects.map((p) => [p.id, p.category, `${p.metrics[0].value} ${p.metrics[0].label}`, p.tech.slice(0, 3).join(", ")]),
        ...data.archive.map((a) => [a.title.toLowerCase().replace(/\s+/g, "-"), "archive", a.note.split(";")[0], a.tech]),
      ],
    }, text('Try ritwik.project("pramana") for a deep dive.', "muted")];
  }

  const projectMatch = input.match(/^ritwik\.project\(\s*["']([^"']+)["']\s*\)$/i);
  if (projectMatch) {
    const project = findProject(data, projectMatch[1]);
    if (!project) {
      const guess = nearest(projectMatch[1], data.projects.map((p) => p.id));
      return [error("KeyError", `'${projectMatch[1]}'`, guess ? `Did you mean ritwik.project("${guess}")?` : `Known ids: ${data.projects.map((p) => p.id).join(", ")}`)];
    }
    const out: Output[] = [
      { kind: "md", title: `${project.title} — ${project.tagline}`, lines: [project.summary, ...project.points.map((p) => `• ${p}`), ...(project.team ? [`(${project.team})`] : [])] },
      { kind: "table", columns: ["metric", "value"], rows: project.metrics.map((m) => [m.label, m.value]) },
    ];
    if (project.image) out.push({ kind: "image", src: project.image.src, alt: project.image.alt });
    out.push({ kind: "links", links: [{ label: "source", href: project.github }, ...(project.demo ? [{ label: "live demo", href: project.demo }] : [])] });
    return out;
  }

  const evalMatch = input.match(/^ritwik\.(?:eval|plot)\(\s*["']([^"']+)["']\s*\)$/i);
  if (evalMatch) {
    const id = evalMatch[1].toLowerCase();
    if (id === "digital-twin")
      return [{ kind: "bars", title: "Digital Twin · 50-question labelled eval", bars: [
        { label: "Recall@5, vector only", value: 33.3, display: "33.3%" },
        { label: "Recall@5, + reranker", value: 47.2, display: "47.2%" },
        { label: "MRR@5 ×100, vector only", value: 24.8, display: "0.248" },
        { label: "MRR@5 ×100, + reranker", value: 39.4, display: "0.394" },
      ], note: "Cost: +1.35 s median latency. Worth it." }];
    if (id === "voicesep")
      return [{ kind: "bars", title: "VoiceSep · 1,200 held-out mixtures (4–5 speakers)", bars: [
        { label: "SI-SDRi, low end", value: 8.84, display: "8.84 dB" },
        { label: "SI-SDRi, high end", value: 12.41, display: "12.41 dB" },
      ], note: "Exact speaker-count accuracy: 71–95%. Research-stage model." }];
    if (id === "morphlab")
      return [{ kind: "bars", title: "MorphLab · live trials", bars: [
        { label: "FPS, low", value: 19.6, display: "19.6" },
        { label: "FPS, high", value: 21.3, display: "21.3" },
      ], note: "p95 latency 76.5–115 ms." }];
    const project = findProject(data, id);
    if (project)
      return [{ kind: "table", columns: ["metric", "value"], rows: project.metrics.map((m) => [m.label, m.value]) }, text(`No plot recipe for ${project.id} yet; here is the table.`, "muted")];
    return [error("KeyError", `'${evalMatch[1]}'`, 'Try ritwik.eval("digital-twin"), ("voicesep") or ("morphlab").')];
  }

  if (lower === "ritwik.experience()")
    return [{ kind: "table", columns: ["when", "role", "where", "highlight"], rows: data.experience.map((e) => [e.period, e.role, e.org, e.points[0]]) }];

  if (lower === "ritwik.skills()" || lower === "ritwik.stack" || lower === "ritwik.skills")
    return [{ kind: "table", columns: ["group", "skills"], rows: data.skillGroups.map((g) => [g.title, g.skills.join(", ")]) }];

  if (lower === "ritwik.awards()")
    return [{ kind: "table", columns: ["project", "event", "result"], rows: data.awards.map((a) => [a.title, a.event, a.result]) }];

  if (lower === "ritwik.education()")
    return [{ kind: "table", columns: ["school", "programme", "years", "score"], rows: data.education.map((e) => [e.school, e.degree, e.period, e.detail]) },
      { kind: "table", columns: ["certification", "issuer"], rows: data.certifications.map((c) => [c.name, c.issuer]) }];

  if (lower === "ritwik.open_source()" || lower === "ritwik.contributions()")
    return [{ kind: "table", columns: ["repo", "PR", "status"], rows: data.openSource.map((o) => [o.repo, `#${o.number} ${o.title}`, o.status]) },
      { kind: "links", links: data.openSource.map((o) => ({ label: `${o.repo}#${o.number}`, href: o.href })) }];

  if (lower === "ritwik.now()")
    return [{ kind: "md", title: "Currently", lines: data.now.map((n) => `• ${n}`) }];

  if (lower === "ritwik.contact()" || lower === "contact")
    return [{ kind: "links", links: data.socials.map((s) => ({ label: `${s.label} · ${s.handle}`, href: s.href })) }, text("Fastest: email. Replies are not rate-limited.", "muted")];

  if (lower === "ritwik.resume()" || lower === "ritwik.cv()" || lower === "open resume.pdf")
    return [{ kind: "action", action: { type: "resume" }, text: "Downloading Ritwik_Jain_Resume.pdf (1 page, 0 fluff)…" }];

  const themeMatch = lower.match(/^(?:ritwik\.theme\(\s*["'](light|dark)["']\s*\)|%theme (light|dark))$/);
  if (themeMatch) {
    const theme = (themeMatch[1] || themeMatch[2]) as "light" | "dark";
    return [{ kind: "action", action: { type: "theme", theme }, text: theme === "dark" ? "Lights off. Welcome to the lab." : "Back to paper." }];
  }

  if (lower === "ritwik.export_to_glue()")
    return [{ kind: "stream", lines: [
      "Resolving notebook cells…",
      "Packaging dependencies… 10+ notebooks already migrated at Deloitte ✓",
      "Scheduling AWS Glue job…",
      "Aborted: this notebook is more fun interactive. Keeping it a notebook.",
    ] }];

  // ———— easter eggs ————
  if (lower === "!nvidia-smi" || lower === "nvidia-smi")
    return [{ kind: "pre", text: [
      "+-----------------------------------------------------------------------------+",
      "| NVIDIA-SMI 2026.11      Driver: caffeine-525      CUDA Version: hope         |",
      "|-------------------------------+----------------------+----------------------+",
      "| GPU  Name        Persistence  | Memory-Usage         | GPU-Util  Compute M. |",
      "|   0  Tesla T4 (Kaggle)   On   | 15109MiB / 15360MiB  |   100%     Default   |",
      "+-------------------------------+----------------------+----------------------+",
      "| Processes:                                                                  |",
      "|  PID   Type   Process name                                     GPU Memory   |",
      "|  4242  C      python train_voicesep.py --speakers 5               15002MiB  |",
      "+-----------------------------------------------------------------------------+",
      "Weekly GPU quota remaining: 0h 07m. Checkpoint early, checkpoint often.",
    ].join("\n") }];

  if (/^model\.fit\(\s*life\s*\)$/.test(lower))
    return [{ kind: "stream", lines: [
      "Epoch 1/4 — loss: 2.31 — val_acc: 0.41 — learned: C, C++, for-loops",
      "Epoch 2/4 — loss: 1.12 — val_acc: 0.68 — learned: PyTorch, why gradients explode",
      "Epoch 3/4 — loss: 0.47 — val_acc: 0.86 — learned: bootstrap CIs, humility",
      "Epoch 4/4 — loss: 0.19 — val_acc: 0.93 — learned: to audit the dataset first",
      "EarlyStopping: val_loss plateaued. Restoring best weights (coffee.ckpt).",
    ] }];

  if (lower === "import this")
    return [{ kind: "md", title: "Things I learned the hard way", lines: zen }];

  if (lower === "import antigravity")
    return [{ kind: "links", links: [{ label: "xkcd 353 — you’re flying!", href: "https://xkcd.com/353/" }] }];

  if (/^!?sudo (hire|recruit) ritwik$/.test(lower))
    return [
      { kind: "stream", lines: ["[sudo] password for recruiter: ********", "Authenticating… ✓", "Permission granted. Opening a draft email…"] },
      { kind: "action", action: { type: "mail" }, text: "" },
    ];

  if (/^!?sudo rm -rf/.test(lower) || lower === "rm -rf /")
    return [error("PermissionError", "[Errno 1] Operation not permitted: '/' — nice try. This kernel is a React component.")];

  if (lower === "del ritwik")
    return [error("PermissionError", "ritwik is a protected singleton and cannot be deleted. He can be emailed, though.")];

  if (/^!?pip install sleep$/.test(lower))
    return [error("ERROR", "No matching distribution found for sleep (incompatible with: B.Tech, SIH, Kaggle quota resets)")];

  if (/^%timeit ritwik\.procrastinate\(\)$/.test(lower))
    return [text("0 ns ± 0 ns per loop (mean ± std. dev. of 7 runs) — procrastination was optimised away by the compiler.")];

  if (["coffee", "ritwik.coffee()", "brew coffee"].includes(lower))
    return [text("HTTP 418: I’m a teapot. Chai accepted.", "warn")];

  if (["hi", "hello", "hey", "namaste", "hello()", "print('hello')", 'print("hello")'].includes(lower))
    return [text("Hello! 👋 Try ritwik.about(), or help() for the full menu.", "accent")];

  if (lower === "whoami" || lower === "!whoami")
    return [text("recruiter? researcher? curious engineer? All welcome — try ritwik.contact().")];

  if (lower === "42" || lower === "ritwik.meaning_of_life()")
    return [text("42 — but with bootstrap CIs: 42 ± 0.0 (n = 1, so don’t quote it).")];

  const printMatch = input.match(/^print\(\s*(["'])(.*)\1\s*\)$/);
  if (printMatch) return [text(printMatch[2])];

  const value = arithmetic(input);
  if (value !== null)
    return [text(Number.isFinite(value) ? String(Number.isInteger(value) ? value : Number(value.toPrecision(10))) : "ZeroDivisionError: division by zero", Number.isFinite(value) ? undefined : "warn")];

  // ———— errors ————
  const attr = input.match(/^ritwik\.(\w+)/);
  if (attr) return [error("AttributeError", `'Ritwik' object has no attribute '${attr[1]}'`, nearestHint(attr[1]))];

  const name = input.match(/^[A-Za-z_]\w*/)?.[0] ?? input.slice(0, 24);
  const guess = nearest(input, completions);
  return [error("NameError", `name '${name}' is not defined`, guess ? `Did you mean ${guess.endsWith("(") ? guess + ")" : guess}?` : "Type help() to see what this kernel understands.")];
}

function nearestHint(key: string) {
  const guess = nearest(key, Object.keys(docs));
  return guess ? `Did you mean ${docs[guess].call}?` : "Type help() for the list of methods.";
}

export function complete(input: string) {
  if (!input.trim()) return [];
  const lower = input.toLowerCase();
  return completions.filter((c) => c.toLowerCase().startsWith(lower) && c.toLowerCase() !== lower);
}

