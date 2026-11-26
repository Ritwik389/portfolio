import { assetPath } from "@/lib/paths";

export const profile = {
  name: "Ritwik Jain",
  shortName: "Ritwik",
  initials: "RJ",
  role: "Undergraduate researcher · multimodal AI",
  headline: "IT student at DTU working on machine learning research.",
  summary:
    "IT undergraduate at Delhi Technological University working on vision-language reasoning for remote sensing and on speech separation, interested in multimodal models and interpretability. I build ML systems end to end and evaluate them with reproducible experiments.",
  location: "New Delhi, India",
  email: "ritwik8march@gmail.com",
  status: "Open to research internships & collaborations",
  resumeUrl: assetPath("/Ritwik_Jain_Resume.pdf"),
  portrait: assetPath("/portrait.webp"),
};

export const heroStats = [
  { value: "9.40", label: "GPA at DTU", detail: "B.Tech IT, Class of 2029" },
  { value: "7", label: "VLMs benchmarked", detail: "SAR sea-ice reasoning segmentation" },
  { value: "Deloitte", label: "AI/ML intern", detail: "Production ML on AWS" },
  { value: "2nd", label: "APOGEE ’26, BITS Pilani", detail: "Team lead, 20+ teams" },
];

export const interests = [
  "Vision-language models",
  "RL fine-tuning (GRPO)",
  "Reasoning segmentation",
  "Speech separation",
  "Mechanistic interpretability",
  "Evidence-grounded LLMs",
];

export interface ResearchItem {
  id: string;
  title: string;
  status: string;
  area: string;
  summary: string;
  points: string[];
  methods: string[];
  link?: { label: string; href: string };
}

export const research: ResearchItem[] = [
  {
    id: "sar-sea-ice",
    title: "Reasoning segmentation for SAR sea-ice imagery",
    status: "Paper in preparation",
    area: "Remote sensing · Vision-language reasoning",
    summary:
      "Can a vision-language model take a text prompt and segment the right ice in a satellite radar image, including small, scattered floes?",
    points: [
      "Benchmarked 7 open-source language-guided segmentation models on SAR sea-ice imagery and fine-tuned 3B-parameter vision-language models with reinforcement learning (GRPO).",
      "Built an evaluation protocol with per-class metrics, bootstrap confidence intervals and trivial baselines.",
      "Ran a failure analysis that exposed a key weakness on dispersed targets, and audited the dataset to find and fix a mismatch between text queries and the model’s input images.",
      "Now designing a new reasoning segmentation model with a custom RL reward function to segment the scattered targets existing models miss.",
    ],
    methods: ["GRPO", "3B VLMs", "Bootstrap CIs", "Failure analysis", "Dataset audit"],
  },
  {
    id: "sae-drift",
    title: "Feature drift under domain fine-tuning",
    status: "Independent study",
    area: "Mechanistic interpretability",
    summary:
      "How does fine-tuning a language model on code change what it represents internally? I trained sparse autoencoders before and after, and compared the features.",
    points: [
      "Trained TopK sparse autoencoders (k = 32, 3,072 features) on layer-8 residual-stream activations of Pythia-160M from 50M OpenWebText tokens.",
      "Fine-tuned the base model on Python code, trained a second SAE under identical conditions, and matched features with cosine similarity and the Hungarian algorithm to separate expected from collateral drift.",
    ],
    methods: ["TopK SAE", "TransformerLens", "SAELens", "Hungarian matching"],
    link: { label: "Study repository", href: "https://github.com/Ritwik389/Mechanistic-Interpretability" },
  },
];

export interface Metric {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  period: string;
  kind: "featured" | "selected";
  category: "Speech" | "LLM systems" | "Vision" | "Multimodal";
  summary: string;
  points: string[];
  metrics: Metric[];
  tech: string[];
  github: string;
  demo?: string;
  badge?: string;
  team?: string;
  image?: { src: string; alt: string; width: number; height: number };
  visual?: "voicesep";
}

export const projects: Project[] = [
  {
    id: "voicesep",
    title: "VoiceSep",
    tagline: "Separates up to five overlapping speakers in English and Hindi.",
    period: "Nov 2026",
    kind: "featured",
    category: "Speech",
    summary:
      "Extended MERL’s two-speaker TF-Locoformer into a five-output English/Hindi speech-separation model, wrapped in a local workspace with transcription and per-speaker analysis.",
    points: [
      "Trained with a Hungarian-matched SI-SDR objective on 50 h of speaker-disjoint LibriSpeech and IndicVoices-R mixtures on a single Kaggle T4.",
      "Evaluated on 1,200 held-out mixtures: 8.84–12.41 dB SI-SDRi with 4 and 5 speakers, at 71–95% exact-count accuracy. The 4–5 speaker model is still research-stage.",
      "Built a local FastAPI + React workspace with Whisper transcription and per-speaker age, gender and emotion analysis.",
    ],
    metrics: [
      { value: "8.84–12.41 dB", label: "SI-SDRi, 4–5 speakers" },
      { value: "1,200", label: "Held-out mixtures" },
      { value: "50 h", label: "Bilingual training audio" },
    ],
    tech: ["PyTorch", "TF-Locoformer", "FastAPI", "React", "Whisper"],
    github: "https://github.com/Ritwik389/VoiceSep",
    visual: "voicesep",
  },
  {
    id: "pramana",
    title: "PRAMANA",
    tagline: "A legal research assistant that cites and checks its sources.",
    period: "Sep – Oct 2026",
    kind: "featured",
    category: "LLM systems",
    badge: "SIH 2026 · cleared DTU internal round",
    team: "Smart India Hackathon team project",
    summary:
      "An evidence-grounded RAG assistant for Ayurveda intellectual-property and regulatory law, where every claim must point at the provision that supports it.",
    points: [
      "Hybrid retrieval with BM25 + Qwen3 embeddings fused by reciprocal rank fusion, with jurisdiction and as-of-date filtering.",
      "Proof-carrying generation: Qwen3-4B emits schema-constrained claims tied to evidence IDs; the server checks each claim with mDeBERTa NLI and deterministic number, date and negation guards, and abstains when support is low.",
    ],
    metrics: [
      { value: "BM25 + dense", label: "Hybrid retrieval, RRF" },
      { value: "NLI-checked", label: "Every claim verified" },
      { value: "Abstains", label: "When support is low" },
    ],
    tech: ["Qwen3", "mDeBERTa", "FastAPI", "React"],
    github: "https://github.com/sarthakv162/PRAMANA-SIH",
    demo: "https://huggingface.co/spaces/RJ8307/pramana-sih",
    image: {
      src: assetPath("/projects/pramana.webp"),
      alt: "PRAMANA evidence panel showing Section 3 of the Patents Act, 1970, highlighted in the source PDF beside the answer.",
      width: 1280,
      height: 720,
    },
  },
  {
    id: "digital-twin",
    title: "Digital Twin",
    tagline: "A Jensen Huang chatbot that answers in his voice, with sources.",
    period: "Jun – Oct 2026",
    kind: "featured",
    category: "LLM systems",
    summary:
      "A voice-enabled digital twin of Jensen Huang combining vector search, cross-encoder reranking with era-aware filtering, graph retrieval, LLM fallback and streamed zero-shot voice cloning.",
    points: [
      "Chroma semantic search and bounded Neo4j graph paths feed a cross-encoder reranker with era-aware filtering; Gemini generates with a fallback model.",
      "Created a 50-question labelled evaluation with era limits, unanswerable and misleading-premise cases: reranking raised Recall@5 from 33.3% to 47.2% and MRR@5 from 0.248 to 0.394, at a 1.35 s median latency cost.",
      "Streams sentence-by-sentence speech with Pocket TTS zero-shot voice cloning.",
    ],
    metrics: [
      { value: "33.3 → 47.2%", label: "Recall@5 with reranking" },
      { value: "0.248 → 0.394", label: "MRR@5" },
      { value: "+1.35 s", label: "Median latency cost" },
    ],
    tech: ["ChromaDB", "Neo4j", "Gemini", "Pocket-TTS", "Docker"],
    github: "https://github.com/Ritwik389/digital-twin",
    demo: "https://rj8307-digital-twin-2.hf.space",
    image: {
      src: assetPath("/projects/digital-twin-map.webp"),
      alt: "Jensen’s World: an interactive topic map with a selected CUDA relationship and its original source excerpt.",
      width: 1280,
      height: 720,
    },
  },
  {
    id: "cipher",
    title: "CIPHER",
    tagline: "A multimodal intelligence tool that runs fully offline.",
    period: "Sep 2026",
    kind: "selected",
    category: "Multimodal",
    badge: "SIH 2026 · cleared DTU internal round",
    team: "Smart India Hackathon team project",
    summary:
      "An offline system that turns text, documents, images, audio and video into verified intelligence products, with no cloud dependency.",
    points: [
      "Chose which quantised model handles each modality (Qwen3-4B, Qwen2.5-VL-3B, faster-whisper, Piper) under a one-model-at-a-time memory budget.",
      "Built the React + TypeScript console and containerised the system with Docker Compose.",
    ],
    metrics: [
      { value: "4 models", label: "One memory budget" },
      { value: "100%", label: "Offline" },
    ],
    tech: ["llama.cpp", "Qwen2.5-VL", "faster-whisper", "React", "Docker"],
    github: "https://github.com/sarthakv162/CIPHER-SIH",
    image: {
      src: assetPath("/projects/cipher.webp"),
      alt: "CIPHER creative studio: a source input and a grid of output formats such as executive summary, presentation and infographic.",
      width: 1024,
      height: 605,
    },
  },
  {
    id: "morphlab",
    title: "MorphLab",
    tagline: "Real-time face swapping on live video.",
    period: "2026",
    kind: "selected",
    category: "Vision",
    summary:
      "A real-time, identity-consistent video face-swapping pipeline with reproducible ablations.",
    points: [
      "Ablations evaluated by independent AdaFace identity similarity and temporal-consistency diagnostics.",
      "Measured 19.6–21.3 FPS and 76.5–115 ms p95 latency in live trials on Apple Silicon.",
    ],
    metrics: [
      { value: "19.6–21.3", label: "FPS live" },
      { value: "76.5–115 ms", label: "p95 latency" },
    ],
    tech: ["Python", "InsightFace", "ONNX Runtime", "OpenCV"],
    github: "https://github.com/Ritwik389/MorphLab",
    image: {
      src: assetPath("/projects/morphlab.webp"),
      alt: "MorphLab overview page with a before-and-after face swap comparison slider on a public-domain portrait.",
      width: 1280,
      height: 889,
    },
  },
];

export interface ArchiveItem {
  title: string;
  year: string;
  note: string;
  tech: string;
  href: string;
}

export const archive: ArchiveItem[] = [
  { title: "Analyzing Autoencoders", year: "2026", note: "8 architectures; best CNN val. MSE 0.000023, 99.86% below the ANN baseline", tech: "PyTorch", href: "https://github.com/Ritwik389/Analyzing-Autoencoders" },
  { title: "Anomaly Detection Pipeline", year: "2026", note: "VideoMAE scoring → Gemma multimodal review → Telegram alerts", tech: "FastAPI · React", href: "https://github.com/Ritwik389/anomaly-detection-pipeline" },
  { title: "SEOAuditor", year: "2026", note: "Evidence-first AI search visibility auditor, TinyFish × AIMS-DTU", tech: "Next.js · Gemini", href: "https://github.com/Ritwik389/SEOAuditor_TinyFish" },
  { title: "Desktop Gesture Control", year: "2026", note: "Personalised gestures from 50 frames, 90% recognition accuracy", tech: "MediaPipe · KNN", href: "https://github.com/Ritwik389/Gesture-based-desktop-control-system" },
  { title: "AI Stadium Command Centre", year: "2026", note: "YOLOv8 crowd analytics from CCTV with a zone-drawing GUI", tech: "YOLOv8 · React", href: "https://github.com/Ritwik389/AI-Stadium-Command-Centre" },
  { title: "Snowball", year: "2026", note: "Goals → AI micro-tasks ranked by urgency × importance", tech: "Next.js · MongoDB · Redis", href: "https://github.com/Ritwik389/Snowball" },
  { title: "Drone Gesture Classification", year: "2026", note: "Webcam hand gestures → drone commands", tech: "TensorFlow · MediaPipe", href: "https://github.com/Ritwik389/drone-gesture-classfication" },
];

export const experience = [
  {
    id: "deloitte",
    org: "Deloitte Touche Tohmatsu India LLP",
    role: "AI/ML Intern",
    period: "Apr – Jul 2026",
    location: "Noida, India",
    points: [
      "Built multiclass classification ML pipelines on AWS SageMaker, Glue, S3 and Athena, covering data processing, training and inference for production models.",
      "Migrated 10+ notebook-based ML workflows into automated, production-ready AWS Glue jobs, replacing manual notebook runs.",
    ],
    tech: ["SageMaker", "AWS Glue", "S3", "Athena", "PySpark"],
  },
  {
    id: "aims",
    org: "AIMS-DTU",
    role: "Senior Member",
    period: "Sep 2025 – Present",
    location: "Delhi Technological University",
    points: [
      "Co-leading a 20+ session ML curriculum for first-year students, with 100+ attendees per session.",
      "Emceed the society’s orientation for 500+ attendees; ran operations for AWS Build with Bharat and the AIMS × TinyFish Buildathon.",
    ],
    tech: ["Teaching", "Events", "Community"],
  },
  {
    id: "mentoring",
    org: "Community engagement, DTU",
    role: "Mentor, Class XI Science",
    period: "Sep – Nov 2026",
    location: "Government school, Delhi",
    points: [
      "Mentored 30+ Class XI students across 8 sessions (about 22 contact hours) on study planning, backlogs and exam preparation, and set up six peer study circles.",
    ],
    tech: ["Mentoring"],
  },
];

export interface Award {
  id: string;
  title: string;
  event: string;
  result: string;
  detail: string;
  href?: string;
}

export const awards: Award[] = [
  {
    id: "greentag",
    title: "GreenTag",
    event: "APOGEE ’26, BITS Pilani",
    result: "2nd prize",
    detail: "Led a 5-member team building an AI civic-issue reporting platform with voice/text complaints and a Telegram bot; 2nd of 20+ teams, 15+ demo users onboarded.",
  },
  {
    id: "sih-2026",
    title: "PRAMANA & CIPHER",
    event: "Smart India Hackathon 2026",
    result: "Cleared DTU internal round",
    detail: "Both of my SIH teams got through the internal round: PRAMANA (a legal research assistant) and CIPHER (an offline multimodal system).",
  },
  {
    id: "sih-2025",
    title: "EcoShala",
    event: "Smart India Hackathon 2025",
    result: "Top 100, internal round",
    detail: "Gamified sustainability platform with image-based plant-health detection; 20+ active users in trial.",
    href: "https://ecoshala.netlify.app/",
  },
  {
    id: "fino",
    title: "DrishtiPay",
    event: "Fin’O Hack, DTU 2025",
    result: "Built & tested",
    detail: "Voice-guided UPI payments for visually impaired users, with AI-assisted QR scanning; tested with 10 users.",
  },
];

export const openSource = [
  {
    repo: "pgmpy/pgmpy",
    title: "Fix equivalent_sample_size validation in BDeu and BDs",
    href: "https://github.com/pgmpy/pgmpy/pull/3739",
    number: 3739,
    status: "Open PR",
  },
  {
    repo: "mllam/neural-lam",
    title: "Fix CLI usage of datastore commands in datastores guide",
    href: "https://github.com/mllam/neural-lam/pull/893",
    number: 893,
    status: "Open PR",
  },
];

export const skillGroups = [
  { title: "Languages", skills: ["Python", "C", "C++", "SQL", "JavaScript", "TypeScript", "HTML/CSS"] },
  { title: "ML & data", skills: ["PyTorch", "TensorFlow/Keras", "Hugging Face Transformers", "scikit-learn", "OpenCV", "MediaPipe", "ONNX Runtime"] },
  { title: "Research", skills: ["GRPO", "Sparse autoencoders", "RAG evaluation", "Bootstrap CIs", "Ablations"] },
  { title: "Cloud & tools", skills: ["AWS SageMaker", "Glue", "S3", "Athena", "Docker", "FastAPI", "React", "Neo4j", "Git", "Linux"] },
];

export const education = [
  { id: "dtu", school: "Delhi Technological University", degree: "B.Tech, Information Technology", period: "2025 – 2029", detail: "GPA 9.40 / 10" },
  { id: "xii", school: "Shaheed Rajpal DAV Public School", degree: "CBSE Class XII", period: "2023 – 2025", detail: "94.6%" },
  { id: "x", school: "Fr. Agnel School", degree: "CBSE Class X", period: "2022 – 2023", detail: "96.4%" },
];

export const certifications = [
  { id: "dl", name: "Deep Learning Specialization", issuer: "DeepLearning.AI", date: "Sep 2025", href: "https://coursera.org/share/4c389b5489d7e9b6b1ee7178dbd23f58" },
  { id: "ml", name: "Machine Learning Specialization", issuer: "DeepLearning.AI · Stanford", date: "Jan 2026", href: "https://coursera.org/share/633ab9579ce496cc1c40bf4433aa214c" },
  { id: "gai", name: "Google AI Intensive Course", issuer: "Google · Kaggle", date: "Oct 2025", href: "https://www.kaggle.com/certification/badges/ritwik8307/105" },
  { id: "mck", name: "McKinsey Forward Program", issuer: "McKinsey & Company", date: "Oct 2025", href: "https://www.credly.com/badges/1d176954-565d-41dd-ab4b-90d3e6f9796c/linked_in_profile" },
];

export const now = [
  "Designing an RL reward for scattered sea-ice targets",
  "Co-leading the AIMS-DTU first-year ML curriculum",
  "Contributing fixes to pgmpy and neural-lam",
];

export const socials = [
  { id: "github", label: "GitHub", handle: "Ritwik389", href: "https://github.com/Ritwik389" },
  { id: "linkedin", label: "LinkedIn", handle: "ritwikjain0803", href: "https://www.linkedin.com/in/ritwikjain0803/" },
  { id: "huggingface", label: "Hugging Face", handle: "RJ8307", href: "https://huggingface.co/RJ8307" },
  { id: "email", label: "Email", handle: "ritwik8march@gmail.com", href: "mailto:ritwik8march@gmail.com" },
];
