"use client";
/* eslint-disable @next/next/no-img-element */

import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowLeft, FileText, Folder, Moon, Play, RotateCcw, Sun } from "lucide-react";
import * as data from "@/lib/data";
import { complete, files, run, suggestions, type Output } from "@/lib/notebook";
import { setNotebook, toast } from "@/lib/ui-store";
import { currentTheme, setTheme, themeEvent, type Theme } from "@/lib/theme";
import { scrollToElement } from "@/lib/smooth-scroll";

interface Cell {
  id: number;
  count: number | null;
  source: string;
  outputs: Output[];
  status: "done" | "running";
}

const intro: { source: string }[] = [
  { source: "import ritwik" },
  { source: "ritwik.about()" },
];

function highlight(source: string) {
  const parts = source.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\britwik\b|^[!%][\w-]+|\b\d+(?:\.\d+)?\b|\.\w+(?=\())/g);
  return parts.map((part, i) => {
    if (!part) return null;
    let cls = "";
    if (/^["']/.test(part)) cls = "tk-str";
    else if (part === "ritwik") cls = "tk-obj";
    else if (/^[!%]/.test(part)) cls = "tk-magic";
    else if (/^\d/.test(part)) cls = "tk-num";
    else if (/^\.\w+$/.test(part)) cls = "tk-fn";
    return cls ? (
      <span key={i} className={cls}>
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    );
  });
}

function Stream({ lines, animate }: { lines: string[]; animate: boolean }) {
  const [shown, setShown] = useState(animate ? 1 : lines.length);
  useEffect(() => {
    if (shown >= lines.length) return;
    const timer = setTimeout(() => setShown((n) => n + 1), 420);
    return () => clearTimeout(timer);
  }, [shown, lines.length]);
  return (
    <pre className="nb-stream">
      {lines.slice(0, shown).join("\n")}
      {shown < lines.length && <span className="nb-caret" aria-hidden="true" />}
    </pre>
  );
}

function OutputView({ out, count, source, animate }: { out: Output; count: number | null; source: string; animate: boolean }) {
  switch (out.kind) {
    case "text":
      return <pre className={`nb-text ${out.tone ? `tone-${out.tone}` : ""}`}>{out.text}</pre>;
    case "pre":
      return <pre className="nb-pre">{out.text}</pre>;
    case "stream":
      return <Stream lines={out.lines} animate={animate} />;
    case "md":
      return (
        <div className="nb-md">
          {out.title && <h4>{out.title}</h4>}
          {out.lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="nb-df">
          <table>
            <thead>
              <tr>
                <th aria-label="index" />
                {out.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {out.rows.map((row, r) => (
                <tr key={r}>
                  <th scope="row">{r}</th>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {out.caption && <p className="nb-caption">{out.caption}</p>}
        </div>
      );
    case "bars": {
      const max = Math.max(...out.bars.map((b) => b.value));
      return (
        <figure className="nb-bars">
          <figcaption>{out.title}</figcaption>
          {out.bars.map((bar, i) => (
            <div className="nb-bar" key={bar.label}>
              <span className="nb-bar-label">{bar.label}</span>
              <span className="nb-bar-track">
                <motion.span
                  className="nb-bar-fill"
                  initial={animate ? { scaleX: 0 } : false}
                  animate={{ scaleX: bar.value / max }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
              <span className="nb-bar-value">{bar.display}</span>
            </div>
          ))}
          {out.note && <p className="nb-caption">{out.note}</p>}
        </figure>
      );
    }
    case "image":
      return <img className="nb-image" src={out.src} alt={out.alt} loading="lazy" />;
    case "links":
      return (
        <ul className="nb-links">
          {out.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target={link.href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer">
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      );
    case "error":
      return (
        <pre className="nb-error">
          <span className="nb-error-rule">{"-".repeat(48)}</span>
          {"\n"}
          <b>{out.ename}</b>
          {"                 Traceback (most recent call last)\n"}
          {`Cell In[${count ?? " "}], line 1\n----> 1 ${source}\n\n`}
          <b>{out.ename}</b>: {out.evalue}
          {out.hint && <span className="nb-hint">{`\n💡 ${out.hint}`}</span>}
        </pre>
      );
    case "action":
      return out.text ? <pre className="nb-text tone-muted">{out.text}</pre> : null;
  }
}

export default function Notebook() {
  const [cells, setCells] = useState<Cell[]>([]);
  const [draft, setDraft] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [theme, setThemeState] = useState<Theme>(() => currentTheme());
  const [animateFrom, setAnimateFrom] = useState(Infinity);
  const counter = useRef(0);
  const nextId = useRef(0);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(-1);
  const input = useRef<HTMLTextAreaElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const reduced = useMemo(() => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const close = useCallback((section?: string) => {
    setNotebook(false);
    requestAnimationFrame(() => {
      const target = section ? document.getElementById(section) : null;
      if (target) scrollToElement(target);
      returnFocus.current?.focus({ preventScroll: Boolean(target) });
    });
  }, []);

  const perform = useCallback(
    (outputs: Output[]) => {
      for (const out of outputs) {
        if (out.kind !== "action") continue;
        const action = out.action;
        if (action.type === "site") setTimeout(() => close(action.section), 500);
        if (action.type === "theme") {
          const next = action.theme === "toggle" ? (currentTheme() === "dark" ? "light" : "dark") : action.theme;
          setTheme(next);
        }
        if (action.type === "resume") {
          const link = document.createElement("a");
          link.href = data.profile.resumeUrl;
          link.download = "Ritwik_Jain_Resume.pdf";
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
        if (action.type === "mail")
          setTimeout(() => {
            location.href = `mailto:${data.profile.email}?subject=${encodeURIComponent("Hello from ritwik.ipynb")}`;
          }, 900);
        if (action.type === "open") window.open(action.href, "_blank", "noopener");
      }
    },
    [close],
  );

  const execute = useCallback(
    (source: string, { instant = false }: { instant?: boolean } = {}) => {
      const trimmed = source.trim();
      if (!trimmed) return;
      const outputs = run(trimmed, data);
      const action = outputs.find((o) => o.kind === "action");
      if (action?.kind === "action" && (action.action.type === "clear" || action.action.type === "restart")) {
        if (action.action.type === "restart") counter.current = 0;
        setCells([]);
        if (action.action.type === "restart") toast("Kernel restarted. All variables cleared (ritwik survived).");
        return;
      }
      const count = ++counter.current;
      const id = nextId.current++;
      if (instant || reduced) {
        setCells((c) => [...c, { id, count, source: trimmed, outputs, status: "done" }]);
        perform(outputs);
        return;
      }
      setBusy(true);
      setAnimateFrom((n) => Math.min(n, id));
      setCells((c) => [...c, { id, count: null, source: trimmed, outputs: [], status: "running" }]);
      setTimeout(() => {
        setCells((c) => c.map((cell) => (cell.id === id ? { ...cell, count, outputs, status: "done" } : cell)));
        setBusy(false);
        perform(outputs);
      }, 260 + Math.random() * 280);
    },
    [perform, reduced],
  );

  useEffect(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    const site = document.getElementById("site");
    site?.setAttribute("inert", "");
    const onTheme = (e: Event) => setThemeState((e as CustomEvent<Theme>).detail);
    window.addEventListener(themeEvent, onTheme);
    if (!nextId.current) intro.forEach((cell) => execute(cell.source, { instant: true }));
    input.current?.focus();
    return () => {
      site?.removeAttribute("inert");
      window.removeEventListener(themeEvent, onTheme);
    };
  }, [execute]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [cells, reduced]);

  function submit(value = draft) {
    if (!value.trim() || busy) return;
    history.current.push(value.trim());
    historyIndex.current = -1;
    setDraft("");
    setMatches([]);
    execute(value);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.altKey) {
      event.preventDefault();
      submit();
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      if (matches.length) setMatches([]);
      else close();
      return;
    }
    if (event.key === "Tab" && draft.trim()) {
      const found = complete(draft);
      if (found.length) {
        event.preventDefault();
        if (found.length === 1) {
          setDraft(found[0]);
          setMatches([]);
        } else {
          let prefix = found[0];
          for (const f of found) while (!f.startsWith(prefix)) prefix = prefix.slice(0, -1);
          if (prefix.length > draft.length) setDraft(prefix);
          setMatches(found.slice(0, 8));
        }
      }
      return;
    }
    if ((event.key === "ArrowUp" || event.key === "ArrowDown") && !draft.includes("\n")) {
      const items = history.current;
      if (!items.length) return;
      event.preventDefault();
      if (event.key === "ArrowUp") historyIndex.current = historyIndex.current < 0 ? items.length - 1 : Math.max(0, historyIndex.current - 1);
      else historyIndex.current = historyIndex.current < 0 ? -1 : historyIndex.current + 1;
      if (historyIndex.current >= items.length || historyIndex.current < 0) {
        historyIndex.current = -1;
        setDraft("");
      } else setDraft(items[historyIndex.current]);
    }
  }

  return (
    <div className="nb" role="dialog" aria-modal="true" aria-label="ritwik.ipynb — interactive notebook version of this portfolio" data-lenis-prevent>
      <header className="nb-bar-top">
        <div className="nb-brand">
          <span className="nb-logo" aria-hidden="true">
            {"{ }"}
          </span>
          <div>
            <p className="nb-file">ritwik.ipynb</p>
            <p className="nb-saved">Last checkpoint: just now (autosaved)</p>
          </div>
        </div>
        <div className="nb-tools">
          <button type="button" className="nb-tool nb-tool-extra" onClick={() => intro.concat(suggestions.slice(2, 5).map((s) => ({ source: s }))).forEach((c, i) => setTimeout(() => execute(c.source, { instant: true }), i * 60))}>
            <Play size={14} aria-hidden="true" /> <span>Run all</span>
          </button>
          <button type="button" className="nb-tool nb-tool-extra" onClick={() => execute("%restart")}>
            <RotateCcw size={14} aria-hidden="true" /> <span>Restart</span>
          </button>
          <button
            type="button"
            className="nb-tool"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to paper theme" : "Switch to lab theme"}
          >
            {theme === "dark" ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
          </button>
          <span className="nb-kernel" aria-live="polite">
            <span className={`nb-kernel-dot ${busy ? "is-busy" : ""}`} aria-hidden="true" />
            <span className="nb-kernel-name">Python 3 (ritwik) · {busy ? "busy" : "idle"}</span>
          </span>
          <button type="button" className="nb-exit" onClick={() => close()}>
            <ArrowLeft size={15} aria-hidden="true" /> <span className="nb-exit-long">Back to site</span><span className="nb-exit-short">Site</span> <kbd>esc</kbd>
          </button>
        </div>
      </header>

      <div className="nb-body">
        <nav className="nb-side" aria-label="Notebook files">
          <p className="nb-side-label">
            <Folder size={14} aria-hidden="true" /> ~/ritwik
          </p>
          <ul>
            {files.map((file) => (
              <li key={file.name}>
                <button type="button" onClick={() => execute(file.run)}>
                  {file.name.endsWith("/") ? <Folder size={14} aria-hidden="true" /> : <FileText size={14} aria-hidden="true" />}
                  {file.name}
                </button>
              </li>
            ))}
          </ul>
          <p className="nb-side-label">Shortcuts</p>
          <dl className="nb-keys">
            <dt>
              <kbd>Enter</kbd>
            </dt>
            <dd>run cell</dd>
            <dt>
              <kbd>Tab</kbd>
            </dt>
            <dd>complete</dd>
            <dt>
              <kbd>↑</kbd> <kbd>↓</kbd>
            </dt>
            <dd>history</dd>
            <dt>
              <kbd>Esc</kbd>
            </dt>
            <dd>back to site</dd>
          </dl>
        </nav>

        <div className="nb-main" ref={scroller}>
          <div className="nb-cells">
            <section className="nb-cell nb-cell-md">
              <h2>
                ritwik.ipynb
              </h2>
              <p>
                The same portfolio, as a Jupyter notebook. Type <code>help()</code> to see the commands, or click one of the suggestions below.
              </p>
            </section>

            {cells.map((cell) => (
              <motion.section
                key={cell.id}
                className={`nb-cell ${cell.status === "running" ? "is-running" : ""}`}
                initial={cell.id >= animateFrom ? { opacity: 0, y: 6 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="nb-in">
                  <span className="nb-prompt">In [{cell.status === "running" ? "*" : cell.count}]:</span>
                  <code className="nb-src">{highlight(cell.source)}</code>
                </div>
                {cell.outputs.length > 0 && (
                  <div className="nb-out">
                    <span className="nb-prompt nb-prompt-out">{cell.outputs.some((o) => o.kind === "error") ? "" : `Out[${cell.count}]:`}</span>
                    <div className="nb-out-body">
                      {cell.outputs.map((out, i) => (
                        <OutputView key={i} out={out} count={cell.count} source={cell.source} animate={cell.id >= animateFrom && !reduced} />
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            ))}

            <section className="nb-cell nb-cell-active">
              <div className="nb-in">
                <label htmlFor="nb-input" className="nb-prompt">
                  In [ ]:
                </label>
                <textarea
                  id="nb-input"
                  ref={input}
                  className="nb-input"
                  rows={1}
                  value={draft}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="ritwik.  ← press Tab"
                  aria-describedby="nb-help"
                  onChange={(e) => {
                    setDraft(e.target.value);
                    if (matches.length) setMatches([]);
                  }}
                  onKeyDown={onKeyDown}
                />
                <button type="button" className="nb-run" onClick={() => submit()} aria-label="Run cell" disabled={busy || !draft.trim()}>
                  <Play size={14} aria-hidden="true" />
                </button>
              </div>
              {matches.length > 0 && (
                <ul className="nb-complete" aria-label="Completions">
                  {matches.map((m) => (
                    <li key={m}>
                      <button
                        type="button"
                        onClick={() => {
                          setDraft(m);
                          setMatches([]);
                          input.current?.focus();
                        }}
                      >
                        {m}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p id="nb-help" className="nb-help">
                Enter to run · Tab to complete · ↑ history · Esc to leave
              </p>
              <div className="nb-suggest" aria-label="Suggested cells">
                {suggestions.map((s) => (
                  <button type="button" key={s} onClick={() => submit(s)} disabled={busy}>
                    {s}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
