import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/MotionProvider";
import { assetPath, siteUrl } from "@/lib/paths";
import { initializeTheme, themeColors } from "@/lib/theme";
import { profile, socials } from "@/lib/data";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const title = "Ritwik Jain · Multimodal AI Researcher";
const description =
  "Ritwik Jain is an undergraduate researcher at Delhi Technological University working on vision-language reasoning for SAR remote sensing, speech separation and evidence-grounded LLM systems. Former AI/ML intern at Deloitte.";

export const metadata: Metadata = {
  title,
  description,
  metadataBase: new URL(`${siteUrl}/`),
  alternates: { canonical: `${siteUrl}/` },
  authors: [{ name: profile.name, url: `${siteUrl}/` }],
  keywords: [
    "Ritwik Jain",
    "multimodal AI",
    "vision-language models",
    "SAR sea ice",
    "speech separation",
    "GRPO",
    "RAG",
    "Delhi Technological University",
    "machine learning portfolio",
  ],
  icons: { icon: assetPath("/favicon.svg") },
  openGraph: {
    type: "profile",
    url: `${siteUrl}/`,
    title,
    description:
      "Vision-language reasoning for SAR sea ice, five-speaker speech separation, proof-carrying RAG. DTU · ex-Deloitte.",
    siteName: "Ritwik Jain",
    images: [{ url: `${siteUrl}/social-preview.png`, width: 1200, height: 630, alt: "Ritwik Jain — multimodal AI researcher" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: "Vision-language reasoning, speech separation and evidence-grounded LLMs.",
    images: [`${siteUrl}/social-preview.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: `${siteUrl}/`,
  image: `${siteUrl}/portrait.webp`,
  jobTitle: "Undergraduate Researcher, Multimodal AI",
  email: `mailto:${profile.email}`,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Delhi Technological University" },
  address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
  knowsAbout: ["Vision-language models", "Reinforcement learning", "Speech separation", "Retrieval-augmented generation", "Mechanistic interpretability"],
  sameAs: socials.filter((s) => s.id !== "email").map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${display.variable} ${mono.variable} ${serif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content={themeColors.light} suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: initializeTheme }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}.js-only{display:none!important}`}</style>
        </noscript>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
