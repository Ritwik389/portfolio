import { assetPath } from "@/lib/paths";

export const profile = {
  name: "Ritwik Jain",
  title: "AI/ML & Full-Stack Developer",
  tagline: "I build intelligent applications, from machine learning pipelines to thoughtful web experiences. Currently seeking internships in AI/ML and full-stack development.",
  email: "ritwik8march@gmail.com",
  resumeUrl: assetPath("/Ritwik_Jain_Resume.pdf"),
};

export const about = {
  bio: "I'm Ritwik, an Information Technology undergraduate at Delhi Technological University, graduating in 2029. At Deloitte, I built cloud-based ML pipelines and worked with PySpark for big data analytics. I enjoy turning ideas into useful applications, exploring knowledge graphs and generative AI, and contributing to open source through GSSoC 2026.",
  skillGroups: [
    { title: "AI & machine learning", skills: ["Python", "PyTorch", "TensorFlow / Keras", "Transformers", "RAG", "OpenCV", "MediaPipe"] },
    { title: "Full-stack development", skills: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Node.js", "Express", "FastAPI"] },
    { title: "Data & cloud", skills: ["PySpark", "AWS Glue", "SageMaker", "S3", "Athena", "MongoDB", "SQLite", "Redis"] },
    { title: "Tools & foundations", skills: ["Git / GitHub", "Linux", "Jupyter", "Google Colab", "C", "C++", "Vercel", "REST APIs"] },
  ],
};

export const experience = {
  company: "Deloitte Touche Tohmatsu India LLP",
  role: "AI/ML Intern",
  period: "April – July 2026",
  location: "Noida, India",
  points: [
    "Engineered multiclass classification ML pipelines on AWS SageMaker, Glue, S3, and Athena.",
    "Migrated 10+ notebook-based ML workflows into production-ready AWS Glue jobs, automating previously manual workflows.",
    "Used PySpark for big data analytics and maintained inference logic, configuration, and data processing components for production ML models.",
  ],
  tech: ["Python", "PySpark", "AWS Glue", "SageMaker", "S3", "Athena"],
};

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  tech: string[];
  github: string;
  demo?: string;
  metric: string;
}

export const projects: Project[] = [
  {
    id: "digital-twin", title: "Digital Twin",
    summary: "A scientist-inspired AI agent with contextual memory and a cloned voice.",
    description: "Designed an AI agent that emulates a scientist's knowledge, reasoning style, and communication patterns. Its memory-augmented, time-aware RAG pipeline uses cross-encoder reranking to retrieve relevant context. Integrated zero-shot voice cloning with Pocket TTS, generating speech from a 30-second reference sample with a measured 5-second response latency.",
    tech: ["Python", "Gemini", "RAG", "SQL", "Pocket TTS"],
    github: "https://github.com/Ritwik389/digital-twin", demo: "https://rj8307-digital-twin-2.hf.space", metric: "5-second response latency",
  },
  {
    id: "autoencoders", title: "Analyzing Autoencoders",
    summary: "An exploration of how architecture shapes image reconstruction quality.",
    description: "Trained ANN- and CNN-based autoencoders from scratch in PyTorch across eight architectural configurations, varying depth, bottleneck size, and skip connections. The best deep CNN autoencoder achieved a validation mean squared error of 0.000023, a 99.86% improvement over the baseline ANN autoencoder.",
    tech: ["PyTorch", "Deep Learning", "Computer Vision"],
    github: "https://github.com/Ritwik389/Analyzing-Autoencoders", metric: "8 architectures compared",
  },
  {
    id: "snowball", title: "Snowball",
    summary: "An AI-powered planner that turns ambitious goals into manageable micro-tasks.",
    description: "Built a full-stack Next.js application with authentication through NextAuth and a MongoDB adapter, alongside Redis-based caching. Integrated Google Generative AI to break down user goals into micro-tasks, prioritized with a custom urgency × importance scoring system.",
    tech: ["Next.js", "React", "NextAuth", "MongoDB", "Redis", "Generative AI"],
    github: "https://github.com/Ritwik389/Snowball", demo: "https://snowball-peach.vercel.app", metric: "Goals → prioritized micro-tasks",
  },
  {
    id: "gesture-control", title: "Desktop Gesture Control",
    summary: "Personalized hand gestures for controlling a desktop in real time.",
    description: "Built a real-time desktop control system with MediaPipe landmark tracking, KNN classification, and WebSocket video. Users can teach it personalized gestures with just 50 frames, around 30 seconds of input. Automatic retraining completed in 45 seconds, with 90% recognition accuracy in testing.",
    tech: ["Python", "FastAPI", "React", "MediaPipe", "OpenCV", "KNN"],
    github: "https://github.com/Ritwik389/Gesture-based-desktop-control-system", metric: "90% recognition accuracy",
  },
];

export const education = [
  { id: "edu-1", period: "2025–2029", degree: "Delhi Technological University", school: "B.Tech · Information Technology", detail: "CGPA · 9.4" },
  { id: "edu-2", period: "2025", degree: "SRDAV Public School", school: "CBSE · Class XII", detail: "96.4%" },
  { id: "edu-3", period: "2023", degree: "Fr. Agnel School", school: "CBSE · Class X", detail: "94.6%" },
];

export const certifications = [
  { id: "cert-1", name: "Deep Learning Specialization", issuer: "DeepLearning.AI", date: "September 2025", href: "https://coursera.org/share/4c389b5489d7e9b6b1ee7178dbd23f58" },
  { id: "cert-2", name: "Machine Learning Specialization", issuer: "DeepLearning.AI · Stanford", date: "January 2026", href: "https://coursera.org/share/633ab9579ce496cc1c40bf4433aa214c" },
  { id: "cert-3", name: "Google AI Intensive Course", issuer: "Google · Kaggle", date: "October 2025", href: "https://www.kaggle.com/certification/badges/ritwik8307/105" },
  { id: "cert-4", name: "Data Science Job Simulation", issuer: "British Airways · Forage", date: "October 2025", href: "https://www.theforage.com/completion-certificates/tMjbs76F526fF5v3G/NjynCWzGSaWXQCxSX_tMjbs76F526fF5v3G_68c8f59286ef0f15d1cb5115_1761026606175_completion_certificate.pdf" },
  { id: "cert-5", name: "McKinsey Forward Program", issuer: "McKinsey & Company", date: "October 2025", href: "https://www.credly.com/badges/1d176954-565d-41dd-ab4b-90d3e6f9796c/linked_in_profile" },
];

export const achievements = [
  { id: "ach-1", stat: "900+", label: "Codeforces · peak rating", href: "https://codeforces.com/profile/Ritwik_08" },
  { id: "ach-2", stat: "1366", label: "CodeChef · peak rating", href: "https://www.codechef.com/users/eager_beam_07" },
  { id: "ach-3", stat: "1591", label: "LeetCode · peak rating", href: "https://leetcode.com/u/KYfpafaSHy/" },
  { id: "ach-4", stat: "90+", label: "LeetCode problems solved", href: "https://leetcode.com/u/KYfpafaSHy/" },
];

export const socials = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/ritwikjain0803/" },
  { id: "github", label: "GitHub", href: "https://github.com/Ritwik389" },
  { id: "email", label: "Email", href: "mailto:ritwik8march@gmail.com" },
];

export interface Hackathon {
  id: string;
  name: string;
  role: string;
  result: string;
  points: string[];
  github?: string;
  demo?: string;
}

export const hackathons: Hackathon[] = [
  {
    id: "sih-2025", name: "Smart India Hackathon · 2025", role: "Team Member", result: "Top 100 · College internal round",
    points: ["Built EcoShala, a gamified sustainability platform with image-based AI for plant health detection and waste-reuse recommendations.", "Reached 20+ active users during the trial period."],
    github: "https://github.com/Err-rr/EcoShala", demo: "https://ecoshala.netlify.app/",
  },
  {
    id: "greentag-2026", name: "GreenTag · APOGEE ’26", role: "Team Leader", result: "2nd prize · 20+ teams",
    points: ["Led a five-member team building an AI civic issue reporting platform for voice and text complaints.", "Automated categorization, geotagging, and ticket generation.", "Integrated a Telegram bot for registration and status updates, onboarding 15+ users during the demo phase."],
  },
  {
    id: "fino-2025", name: "Fin’O Hack · DTU · 2025", role: "Participant", result: "DrishtiPay · Completed",
    points: ["Built a Flutter-based UPI payment app for visually impaired users, tested with 10 users.", "Implemented voice-guided payments, AI-assisted QR scanning, and biometric authentication."],
  },
];
