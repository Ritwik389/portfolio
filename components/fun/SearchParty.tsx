"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { profile } from "@/lib/data";

const places = [
  "Under the sofa.",
  "Behind the fridge, next to a 2019 Diwali sweet.",
  "All 47 open browser tabs.",
  "The group chat. Someone asked about the assignment again.",
  "My Downloads folder. Found three copies of my résumé, none of this page.",
  "The back of the hostel mess menu.",
  "git log --all. Nothing. Not even a commit message that says “oops”.",
];

export default function SearchParty() {
  const [checked, setChecked] = useState(0);
  const done = checked >= places.length;
  return (
    <>
      <ol className="lost-log" aria-live="polite">
        {checked === 0 ? (
          <li className="is-empty">Search party standing by.</li>
        ) : (
          places.slice(0, checked).map((place) => <li key={place}>{place}</li>)
        )}
      </ol>
      <div className="lost-actions">
        {!done ? (
          <button type="button" className="btn btn-ghost" onClick={() => setChecked((n) => n + 1)}>
            <Search size={16} aria-hidden="true" />
            {checked === 0 ? "Send a search party" : "Keep looking"}
          </button>
        ) : (
          <p>Okay. It’s gone. We had a good run.</p>
        )}
        <Link className="btn btn-primary" href="/">
          <ArrowLeft size={16} aria-hidden="true" /> Take me home
        </Link>
        <a
          className="btn btn-ghost"
          href={`mailto:${profile.email}?subject=${encodeURIComponent("A broken link on your site")}`}
        >
          Tell Ritwik
        </a>
      </div>
    </>
  );
}
