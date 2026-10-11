import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import MotionProvider from "@/components/MotionProvider";
import { assetPath, siteUrl } from "@/lib/paths";

const fraunces = localFont({
  src: [
    { path: "../public/fonts/fraunces-normal.woff2", style: "normal", weight: "400 700" },
    { path: "../public/fonts/fraunces-italic.woff2", style: "italic", weight: "400 700" },
  ],
  variable: "--font-display",
  display: "swap",
});

const manrope = localFont({
  src: "../public/fonts/manrope-normal.woff2",
  weight: "400 800",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ritwik Jain - Portfolio",
  description: "AI/ML and full-stack developer at DTU. Former Deloitte AI/ML intern building intelligent applications and cloud ML pipelines. Seeking internship opportunities.",
  metadataBase: new URL(`${siteUrl}/`),
  alternates: { canonical: `${siteUrl}/` },
  authors: [{ name: "Ritwik Jain" }],
  icons: { icon: assetPath("/favicon.svg") },
  openGraph: { type: "website", url: `${siteUrl}/`, title: "Ritwik Jain | AI/ML & Full-Stack Developer", description: "DTU · Deloitte AI/ML internship · Intelligent applications and cloud ML pipelines", siteName: "Ritwik Jain Portfolio", images: [{ url: `${siteUrl}/social-preview.png`, width: 1200, height: 630, alt: "Ritwik Jain — AI/ML & Full-Stack Developer" }] },
  twitter: { card: "summary_large_image", title: "Ritwik Jain | AI/ML & Full-Stack Developer", description: "Building intelligent applications. Currently seeking internships.", images: [`${siteUrl}/social-preview.png`] },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <body>
        <a href="#main-content" className="skip-link glass-panel-strong rounded-full px-5 py-3 font-body text-sm font-semibold text-oxblood">Skip to content</a>
        <MotionProvider>
        <CustomCursor />
        {children}
        </MotionProvider>
      </body>
    </html>
  );
}
