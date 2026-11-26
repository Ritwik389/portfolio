"use client";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MoveHorizontal,
  Play,
  Pause,
} from "lucide-react";
import { useMediaQuery } from "@/components/Scene";
import { assetPath } from "@/lib/paths";
import { useUrlChoice } from "@/lib/use-url-choice";
import SectionHead from "@/components/sections/SectionHead";
const nodes = [
  {
    id: "sources",
    label: "Sources",
    sub: "Chroma + Neo4j",
    x: 17,
    y: 24,
    tech: "Vector store + knowledge graph",
    text: "Jensen Huang’s public talks and interviews, chunked into a Chroma vector store and a Neo4j graph of topics and extracted relationships.",
  },
  {
    id: "retrieval",
    label: "Retrieval",
    sub: "Vector + graph paths",
    x: 50,
    y: 24,
    tech: "Semantic search · bounded graph paths",
    text: "Semantic search finds candidate passages; bounded Neo4j paths pull in related concepts the question did not name directly.",
  },
  {
    id: "reranking",
    label: "Reranking",
    sub: "Cross-encoder, era-aware",
    x: 83,
    y: 24,
    tech: "Recall@5 33.3% → 47.2%",
    text: "A cross-encoder reorders candidates with era-aware filtering. On a 50-question labelled set, Recall@5 rose from 33.3% to 47.2% and MRR@5 from 0.248 to 0.394, for a 1.35 s median latency cost.",
  },
  {
    id: "memory",
    label: "Memory",
    sub: "About the visitor",
    x: 17,
    y: 76,
    tech: "Editable conversation memory",
    text: "Facts about the visitor are kept in a separate conversation memory, never mixed into the public source graph, and can be inspected or forgotten.",
  },
  {
    id: "response",
    label: "Response",
    sub: "Gemini, with fallback",
    x: 50,
    y: 76,
    tech: "Cited, era-limited answers",
    text: "Gemini answers from the reranked evidence with numbered citations, falling back to a second model when needed. Unanswerable and misleading-premise questions are part of the evaluation.",
  },
  {
    id: "voice",
    label: "Voice",
    sub: "Pocket TTS, streamed",
    x: 83,
    y: 76,
    tech: "Zero-shot voice cloning",
    text: "Replies are spoken sentence by sentence with Pocket TTS zero-shot voice cloning, so audio starts before the full answer is written.",
  },
];
const edges = [
  ["sources", "retrieval"],
  ["memory", "retrieval"],
  ["retrieval", "reranking"],
  ["reranking", "response"],
  ["response", "voice"],
];
const requestPath = ["sources", "retrieval", "reranking", "response", "voice"];
function TwinGraph({ enabled }: { enabled: boolean }) {
  const [selected, setSelected] = useUrlChoice(
    "node",
    nodes.map((n) => n.id),
    "retrieval",
  );
  const [step, setStep] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const effective = step === null ? selected : requestPath[step];
  const current = nodes.find((n) => n.id === effective)!;
  const next =
    enabled && playing && !reduced && step !== null
      ? nodes.find((node) => node.id === requestPath[step + 1])
      : undefined;
  useEffect(() => {
    if (!playing || step === null || reduced || !enabled) return;
    const timer = setTimeout(() => {
      if (step < requestPath.length - 1) setStep(step + 1);
      else {
        setPlaying(false);
        setStep(null);
        setSelected("voice");
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [playing, step, reduced, enabled, setSelected]);
  function choose(id: string) {
    setPlaying(false);
    setStep(null);
    setSelected(id);
  }
  return (
    <div className="graph-layout" data-ui>
      <div>
        <div
          className="architecture-graph"
          aria-label="Explore Digital Twin architecture"
        >
          <svg
            className="graph-connections"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {edges.map(([from, to]) => {
              const a = nodes.find((n) => n.id === from)!,
                b = nodes.find((n) => n.id === to)!;
              return (
                <path
                  key={from + to}
                  d={`M${a.x} ${a.y} L${b.x} ${b.y}`}
                  className={
                    from === effective || to === effective ? "connected" : ""
                  }
                />
              );
            })}
            {next && (
              <motion.circle
                key={current.id}
                className="graph-signal"
                r={0.45}
                vectorEffect="non-scaling-stroke"
                initial={{ cx: current.x, cy: current.y }}
                animate={{ cx: next.x, cy: next.y }}
                transition={{ duration: 1.3, delay: 0.1, ease: "linear" }}
              />
            )}
          </svg>
          {nodes.map((node) => (
            <button
              className={`graph-node ${effective === node.id ? "active" : ""}`}
              key={node.id}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              onClick={() => choose(node.id)}
              aria-pressed={effective === node.id}
              aria-controls="graph-explanation"
            >
              {effective === node.id && (
                <motion.span
                  className="graph-node-highlight"
                  layoutId="graph-current-node"
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  aria-hidden="true"
                />
              )}
              <strong>{node.label}</strong>
              <span>{node.sub}</span>
            </button>
          ))}
        </div>
        <p className="lab-instruction">Select a node to explore its role.</p>
        <div className="trace-controls">
          <button
            className="lab-btn lab-btn-primary"
            onClick={() => {
              if (playing) choose(current.id);
              else {
                setStep(0);
                setPlaying(!reduced);
              }
            }}
          >
            {playing ? (
              <Pause size={18} aria-hidden="true" />
            ) : (
              <Play size={18} aria-hidden="true" />
            )}
            {playing ? "Stop walkthrough" : "Trace a request"}
          </button>
          <button
            className="lab-btn"
            onClick={() => {
              setPlaying(false);
              if (step === requestPath.length - 1) choose("voice");
              else setStep(step === null ? 0 : step + 1);
            }}
          >
            Next step
            <ArrowRight size={18} aria-hidden="true" />
          </button>
          <p>
            {step === null
              ? "Architecture walkthrough"
              : `Step ${step + 1} of ${requestPath.length}`}
          </p>
        </div>
      </div>
      <div
        id="graph-explanation"
        className="graph-explanation"
        aria-live="polite"
        aria-atomic="true"
      >
        <h3>{current.label}</h3>
        <p>{current.text}</p>
        <p className="graph-technology">{current.tech}</p>
        <a
          className="text-link"
          href="https://github.com/Ritwik389/digital-twin"
          target="_blank"
          rel="noopener noreferrer"
        >
          Explore the source
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </div>
      <noscript>
        <ul>
          {nodes.map((n) => (
            <li key={n.id}>
              <strong>{n.label}:</strong> {n.text}
            </li>
          ))}
        </ul>
      </noscript>
    </div>
  );
}
const models = [
  { id: "ann-shallow", label: "ANN · Shallow", y: 469 },
  { id: "ann-deep", label: "ANN · Deep", y: 762 },
  { id: "cnn-light", label: "CNN · Light", y: 1055 },
  { id: "cnn-deep", label: "CNN · Deep", y: 1348 },
];
const sampleX = [37, 303, 570, 837, 1104, 1370, 1637, 1904];
function Sample({ sample, row }: { sample: number; row: number }) {
  return (
    <svg
      className="output-sample"
      viewBox={`${sampleX[sample]} ${row} 228 228`}
      role="img"
      aria-label={`${row === 175 ? "Original" : "Reconstructed"} EMNIST character, sample ${sample + 1}`}
    >
      <image
        href={assetPath("/projects/autoencoders.webp")}
        width="2148"
        height="1616"
      />
    </svg>
  );
}
function Reconstruction() {
  const [model, setModel] = useUrlChoice(
    "model",
    models.map((m) => m.id),
    "cnn-deep",
  );
  const [rawSample, setRawSample] = useUrlChoice(
    "sample",
    sampleX.map((_, i) => String(i + 1)),
    "1",
  );
  const [reveal, setReveal] = useState(50);
  const sample = Number(rawSample) - 1,
    current = models.find((m) => m.id === model)!;
  return (
    <div className="reconstruction-layout" data-ui>
      <div className="reconstruction-controls">
        <h3>Original. Reconstructed.</h3>
        <p>
          Compare recorded EMNIST outputs across four of the study’s
          architectures.
        </p>
        <label htmlFor="reconstruction-model">Architecture</label>
        <select
          id="reconstruction-model"
          className="lab-select"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {models.map((m) => (
            <option value={m.id} key={m.id}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="sample-navigation">
          <button
            className="lab-btn lab-btn-icon"
            aria-label="Previous sample"
            onClick={() => setRawSample(String(((sample + 7) % 8) + 1))}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <span>Sample {sample + 1} of 8</span>
          <button
            className="lab-btn lab-btn-icon"
            aria-label="Next sample"
            onClick={() => setRawSample(String(((sample + 1) % 8) + 1))}
          >
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="comparison-area">
        <div className="comparison-labels">
          <button onClick={() => setReveal(100)}>Original</button>
          <button onClick={() => setReveal(0)}>{current.label}</button>
        </div>
        <div className="comparison-image">
          <Sample sample={sample} row={current.y} />
          <div
            className="comparison-original"
            style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
          >
            <Sample sample={sample} row={175} />
          </div>
          <div
            className="comparison-divider"
            style={{ left: `${reveal}%` }}
            aria-hidden="true"
          >
            <MoveHorizontal size={24} />
          </div>
          {/* Mirror the accessible range below across the image for pointer dragging. */}
          <input
            className="comparison-overlay"
            type="range"
            min={0}
            max={100}
            step={1}
            value={reveal}
            onChange={(e) => setReveal(Number(e.target.value))}
            aria-label="Compare original and reconstructed image"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <label className="range-label" htmlFor="reconstruction-reveal">
          Drag to compare
          <output htmlFor="reconstruction-reveal">{reveal}% original</output>
        </label>
        <input
          className="comparison-range"
          id="reconstruction-reveal"
          type="range"
          min={0}
          max={100}
          step={1}
          value={reveal}
          onChange={(e) => setReveal(Number(e.target.value))}
          aria-valuetext={`${reveal}% original visible`}
        />
        <p className="lab-instruction">
          Use the slider or arrow keys to compare the same character.
        </p>
      </div>
      <div className="reconstruction-details">
        <dl className="lab-study-stat">
          <dt>Study’s best validation MSE</dt>
          <dd>0.000023</dd>
        </dl>
        <a
          className="text-link"
          href="https://github.com/Ritwik389/Analyzing-Autoencoders"
          target="_blank"
          rel="noopener noreferrer"
        >
          View the experiment
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
export default function ExperimentLab() {
  const [lab, setLab] = useUrlChoice("lab", ["graph", "vision"], "graph");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(e: KeyboardEvent, i: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    const next = e.key === "Home" ? 0 : e.key === "End" ? 1 : 1 - i;
    setLab(next ? "vision" : "graph");
    tabs.current[next]?.focus();
  }
  return (
    <section id="lab" className="section" aria-labelledby="lab-title">
      <div className="wrap">
        <SectionHead
          num="03"
          kicker="Lab"
          id="lab-title"
          title={
            <>
              Try a couple of them
            </>
          }
          intro="Two small demos from real projects. Click through how the Digital Twin answers a question, or compare autoencoder outputs with the original images."
        />
        <div className="lab-panel reveal">
          <div
            className="lab-tabs"
            role="tablist"
            aria-label="Interactive project experiments"
          >
            {["Digital Twin graph", "Reconstruction lab"].map((label, i) => (
              <button
                key={label}
                role="tab"
                id={`lab-tab-${i}`}
                aria-controls={`lab-panel-${i}`}
                aria-selected={lab === (i ? "vision" : "graph")}
                tabIndex={lab === (i ? "vision" : "graph") ? 0 : -1}
                className={`lab-tab ${lab === (i ? "vision" : "graph") ? "is-on" : ""}`}
                onClick={() => setLab(i ? "vision" : "graph")}
                onKeyDown={(e) => navigate(e, i)}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div
            role="tabpanel"
            id="lab-panel-0"
            aria-labelledby="lab-tab-0"
            hidden={lab !== "graph"}
            tabIndex={0}
          >
            <TwinGraph enabled={lab === "graph"} />
          </div>
          <div
            role="tabpanel"
            id="lab-panel-1"
            aria-labelledby="lab-tab-1"
            hidden={lab !== "vision"}
            tabIndex={0}
          >
            <Reconstruction />
          </div>
        </div>
      </div>
    </section>
  );
}
