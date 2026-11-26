import type { Metadata } from "next";
import SearchParty from "@/components/fun/SearchParty";

export const metadata: Metadata = {
  title: "Page not found · Ritwik Jain",
  description: "This page doesn’t exist. The rest of the site does, and it’s quite nice.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="lost">
      <p className="lost-code" aria-hidden="true">
        404
      </p>
      <h1>
        This page <em>took a gap year.</em>
      </h1>
      <p>
        Either the link is old, or I renamed something at 2 a.m. and told nobody. Sorry about that.
      </p>
      <SearchParty />
    </main>
  );
}
