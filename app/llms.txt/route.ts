import { awards, education, experience, openSource, profile, projects, research, socials } from "@/lib/data";
import { siteUrl } from "@/lib/paths";

export const dynamic = "force-static";

/* A plain-text summary for LLM-based search and answer engines, generated
   from the same data as the site so it never drifts. */
export function GET() {
  const lines = [
    `# ${profile.name}`,
    "",
    `> ${profile.summary}`,
    "",
    `- Role: ${profile.role}`,
    `- Location: ${profile.location}`,
    `- Status: ${profile.status}`,
    `- Website: ${siteUrl}/`,
    `- Résumé (PDF): ${siteUrl}/Ritwik_Jain_Resume.pdf`,
    ...socials.map((s) => `- ${s.label}: ${s.href}`),
    "",
    "## Research",
    ...research.flatMap((r) => [`### ${r.title} (${r.status})`, r.summary, ...r.points.map((p) => `- ${p}`), ""]),
    "## Projects",
    ...projects.flatMap((p) => [
      `### ${p.title} — ${p.tagline}`,
      p.summary,
      ...p.points.map((x) => `- ${x}`),
      `- Stack: ${p.tech.join(", ")}`,
      `- Source: ${p.github}${p.demo ? `\n- Demo: ${p.demo}` : ""}`,
      "",
    ]),
    "## Experience",
    ...experience.flatMap((e) => [`### ${e.role}, ${e.org} (${e.period})`, ...e.points.map((x) => `- ${x}`), ""]),
    "## Awards",
    ...awards.map((a) => `- ${a.title}: ${a.result}, ${a.event}. ${a.detail}`),
    "",
    "## Open source",
    ...openSource.map((o) => `- ${o.repo}#${o.number}: ${o.title} (${o.status}) ${o.href}`),
    "",
    "## Education",
    ...education.map((e) => `- ${e.school}, ${e.degree}, ${e.period}: ${e.detail}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
