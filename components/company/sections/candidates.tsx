"use client";

import { useState } from "react";
import type { Candidate } from "../../../lib/mock-candidates";
import { FadeIn } from "../../animated/fade-in";

export function CandidatesSection({
  candidates,
  shortlistIds,
  onOpenCandidate,
}: {
  candidates: Candidate[];
  shortlistIds: string[];
  onOpenCandidate: (candidateId: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = candidates.filter((c) => {
    const q = query.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q));
  });

  return (
    <div>
      <FadeIn>
        <div className="mb-6">
          <p className="eyebrow">Candidates</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Your candidate pool</h1>
        </div>
      </FadeIn>

      <FadeIn delay={60}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, title, or skill..."
          className="mb-6 w-full max-w-md rounded-2xl border border-black/10 bg-white p-3 text-sm outline-none transition focus:border-black/30"
        />
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((candidate, i) => (
          <FadeIn key={candidate.id} delay={i * 60}>
            <button
              onClick={() => onOpenCandidate(candidate.id)}
              className="card-interactive w-full rounded-[1.5rem] border border-black/10 bg-white p-5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold">{candidate.name}</p>
                  <p className="text-xs text-zinc-500">{candidate.title}</p>
                </div>
                {shortlistIds.includes(candidate.id) ? (
                  <span className="ml-auto rounded-full bg-black px-2 py-0.5 text-[10px] text-white">Shortlisted</span>
                ) : null}
              </div>
              <p className="mt-3 text-xs text-zinc-500">{candidate.location} · {candidate.yearsExperience} yrs</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {candidate.skills.slice(0, 4).map((skill) => (
                  <span key={skill} className="skill-badge rounded-full border border-black/10 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-600">
                    {skill}
                  </span>
                ))}
              </div>
            </button>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
