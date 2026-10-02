"use client";

import { useMemo, useRef, useState } from "react";
import type { Candidate } from "../../../lib/mock-candidates";
import { rankCandidates, type MatchResult } from "../../../lib/match";
import { MatchRing } from "../../animated/match-ring";
import { FadeIn } from "../../animated/fade-in";

const EXAMPLE_QUERIES = [
  "I need a junior React developer in Lagos with 1-2 years of experience.",
  "Senior backend engineer, remote, strong in Node.js and AWS.",
  "Product designer with design systems experience, open to remote.",
];

const SEARCH_STEPS = ["Reading your request", "Understanding requirements", "Finding matches"];

export function FindTalentSection({
  candidates,
  shortlistIds,
  compareIds,
  initialQuery,
  onOpenCandidate,
  onShortlist,
  onToggleCompare,
}: {
  candidates: Candidate[];
  shortlistIds: string[];
  compareIds: string[];
  initialQuery?: string;
  onOpenCandidate: (candidateId: string, match?: MatchResult) => void;
  onShortlist: (candidateId: string) => void;
  onToggleCompare: (candidateId: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery ?? "");
  const [minExperience, setMinExperience] = useState(0);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [searchStep, setSearchStep] = useState<number | null>(null);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const results = useMemo(() => {
    if (!submittedQuery) return [];
    let ranked = rankCandidates(candidates, submittedQuery);
    if (remoteOnly) ranked = ranked.filter((r) => r.candidate.remoteOnly);
    if (minExperience > 0) ranked = ranked.filter((r) => r.candidate.yearsExperience >= minExperience);
    return ranked;
  }, [candidates, submittedQuery, remoteOnly, minExperience]);

  function handleSearch(text: string) {
    if (!text.trim()) return;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setQuery(text);
    setSearchStep(0);

    // A brief, honest "thinking" sequence — the underlying match is a real
    // synchronous computation (see lib/match.ts), this just paces the reveal
    // so the transition from request to ranked results feels legible rather
    // than an instant, implausible jump.
    SEARCH_STEPS.slice(1).forEach((_, i) => {
      timeoutsRef.current.push(setTimeout(() => setSearchStep(i + 1), (i + 1) * 420));
    });
    timeoutsRef.current.push(
      setTimeout(() => {
        setSubmittedQuery(text);
        setSearchStep(null);
      }, SEARCH_STEPS.length * 420)
    );
  }

  const searching = searchStep !== null;

  return (
    <div>
      <div className="mb-6">
        <p className="eyebrow">Find Talent</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Tell Nia who you need.</h1>
        <p className="mt-2 max-w-xl text-zinc-600">Describe the role in plain language. Nia ranks your candidate pool and explains every match.</p>
      </div>

      <div className="glass-panel-strong rounded-[1.75rem] p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSearch(query);
              }
            }}
            rows={2}
            placeholder="e.g. I need a junior React developer in Lagos with 1-2 years of experience."
            className="flex-1 resize-none rounded-2xl border border-black/10 bg-white p-4 text-sm outline-none transition focus:border-black/30"
          />
          <button onClick={() => handleSearch(query)} disabled={!query.trim() || searching} className="btn-primary shrink-0 sm:self-stretch">
            {searching ? "Matching..." : "Find talent"}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-[0.15em] text-zinc-400">Try:</span>
          {EXAMPLE_QUERIES.map((example) => (
            <button
              key={example}
              onClick={() => handleSearch(example)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-zinc-600 transition hover:border-black/25 hover:text-black active:scale-95"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-black/5 pt-4 text-sm">
          <label className="flex items-center gap-2 text-zinc-600">
            Min. experience
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="rounded-lg border border-black/10 bg-white px-2 py-1 text-sm"
            >
              <option value={0}>Any</option>
              <option value={1}>1+ years</option>
              <option value={3}>3+ years</option>
              <option value={5}>5+ years</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-zinc-600">
            <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} className="h-4 w-4 rounded border-black/20" />
            Remote-open only
          </label>
        </div>
      </div>

      <div className="mt-8">
        {submittedQuery && !searching ? (
          <FadeIn>
            <p className="mb-4 text-sm text-zinc-500">
              {results.length} candidate{results.length === 1 ? "" : "s"} matched for <span className="font-medium text-black">&ldquo;{submittedQuery}&rdquo;</span>
            </p>
          </FadeIn>
        ) : null}

        {searching ? (
          <div className="rounded-[1.5rem] border border-black/10 bg-zinc-50 p-6">
            {SEARCH_STEPS.map((step, i) => {
              const state = searchStep === i ? "active" : searchStep !== null && searchStep > i ? "done" : "pending";
              if (state === "pending") return null;
              return (
                <div key={step} className="step-fade flex items-center gap-3 py-1.5 text-sm">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      state === "done" ? "bg-black text-white" : "border border-black/30 bg-white"
                    }`}
                  >
                    {state === "done" ? "✓" : <span className="ai-dot" />}
                  </span>
                  <span className={state === "done" ? "text-zinc-400 line-through" : "text-zinc-700"}>{step}...</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, i) => (
              <FadeIn key={result.candidate.id} delay={i * 90}>
                <MatchCard
                  result={result}
                  isShortlisted={shortlistIds.includes(result.candidate.id)}
                  isComparing={compareIds.includes(result.candidate.id)}
                  onOpen={() => onOpenCandidate(result.candidate.id, result)}
                  onShortlist={() => onShortlist(result.candidate.id)}
                  onToggleCompare={() => onToggleCompare(result.candidate.id)}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MatchCard({
  result,
  isShortlisted,
  isComparing,
  onOpen,
  onShortlist,
  onToggleCompare,
}: {
  result: MatchResult;
  isShortlisted: boolean;
  isComparing: boolean;
  onOpen: () => void;
  onShortlist: () => void;
  onToggleCompare: () => void;
}) {
  const { candidate, score, reasons } = result;
  return (
    <div className="card-interactive rounded-[1.5rem] border border-black/10 bg-white p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
            {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <button onClick={onOpen} className="text-left text-lg font-semibold hover:underline">
              {candidate.name}
            </button>
            <p className="text-sm text-zinc-500">{candidate.title} · {candidate.location}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {reasons.slice(0, 5).map((reason) => (
                <span
                  key={reason.label}
                  className={`skill-badge rounded-full border px-2 py-0.5 text-[11px] ${
                    reason.met ? "border-black/15 bg-zinc-50 text-zinc-700" : "border-black/5 text-zinc-300 line-through"
                  }`}
                >
                  {reason.met ? "✓" : "✗"} {reason.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
          <div className="rounded-2xl border border-black/10 bg-zinc-950 p-2">
            <MatchRing score={score} size={56} strokeWidth={4} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-4">
        <button onClick={onOpen} className="btn-secondary px-4 py-2 text-xs">View profile</button>
        <button onClick={onShortlist} className="btn-secondary px-4 py-2 text-xs" disabled={isShortlisted}>
          {isShortlisted ? "Shortlisted ✓" : "Shortlist"}
        </button>
        <button onClick={onToggleCompare} className="btn-secondary px-4 py-2 text-xs">
          {isComparing ? "Remove from compare" : "Compare"}
        </button>
      </div>
    </div>
  );
}
