"use client";

import { useState } from "react";
import type { Candidate } from "../../../lib/mock-candidates";
import type { HiringStage } from "../../../lib/mock-jobs";
import type { ShortlistEntry } from "../dashboard-state";
import { STAGES } from "../candidate-modal";
import { FadeIn } from "../../animated/fade-in";

export function ShortlistSection({
  shortlist,
  candidates,
  compareIds,
  onStageChange,
  onRemove,
  onOpenCandidate,
  onToggleCompare,
}: {
  shortlist: ShortlistEntry[];
  candidates: Candidate[];
  compareIds: string[];
  onStageChange: (candidateId: string, stage: HiringStage) => void;
  onRemove: (candidateId: string) => void;
  onOpenCandidate: (candidateId: string) => void;
  onToggleCompare: (candidateId: string) => void;
}) {
  const candidateById = (id: string) => candidates.find((c) => c.id === id);
  const compareCandidates = compareIds.map(candidateById).filter(Boolean) as Candidate[];

  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [flashIds, setFlashIds] = useState<Set<string>>(new Set());

  function handleRemove(candidateId: string) {
    setRemovingIds((prev) => new Set(prev).add(candidateId));
    setTimeout(() => {
      onRemove(candidateId);
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(candidateId);
        return next;
      });
    }, 300);
  }

  function handleStageChange(candidateId: string, stage: HiringStage) {
    onStageChange(candidateId, stage);
    setFlashIds((prev) => new Set(prev).add(candidateId));
    setTimeout(() => {
      setFlashIds((prev) => {
        const next = new Set(prev);
        next.delete(candidateId);
        return next;
      });
    }, 900);
  }

  return (
    <div>
      <FadeIn>
        <div className="mb-6">
          <p className="eyebrow">Shortlist</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Candidates you&apos;re tracking</h1>
        </div>
      </FadeIn>

      {shortlist.length === 0 ? (
        <FadeIn>
          <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-zinc-50 p-10 text-center text-sm text-zinc-500">
            Nothing shortlisted yet. Shortlist candidates from Find Talent or Candidates to track them here.
          </div>
        </FadeIn>
      ) : (
        <div className="space-y-3">
          {shortlist.map((entry, i) => {
            const candidate = candidateById(entry.candidateId);
            if (!candidate) return null;
            const isRemoving = removingIds.has(entry.candidateId);
            const isFlashing = flashIds.has(entry.candidateId);
            return (
              <FadeIn key={entry.candidateId} delay={i * 60}>
                <div
                  className={`card-interactive flex flex-col gap-4 rounded-[1.5rem] border border-black/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between ${
                    isRemoving ? "row-removing" : ""
                  } ${isFlashing ? "flash-highlight" : ""}`}
                >
                  <button onClick={() => onOpenCandidate(candidate.id)} className="flex items-center gap-3 text-left">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                      {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold hover:underline">{candidate.name}</p>
                      <p className="text-xs text-zinc-500">{candidate.title}</p>
                    </div>
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={entry.stage}
                      onChange={(e) => handleStageChange(candidate.id, e.target.value as HiringStage)}
                      className="rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm transition"
                    >
                      {STAGES.map((stage) => (
                        <option key={stage} value={stage}>{stage}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => onToggleCompare(candidate.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs transition active:scale-95 ${compareIds.includes(candidate.id) ? "border-black bg-black text-white" : "border-black/10 text-zinc-600"}`}
                    >
                      {compareIds.includes(candidate.id) ? "Comparing" : "Compare"}
                    </button>
                    <button onClick={() => handleRemove(candidate.id)} className="text-xs text-zinc-400 transition hover:text-red-500">
                      Remove
                    </button>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      )}

      {compareCandidates.length > 0 ? (
        <FadeIn>
          <div className="mt-10">
            <h2 className="mb-4 text-xl font-bold tracking-[-0.03em]">Comparing {compareCandidates.length} candidate{compareCandidates.length === 1 ? "" : "s"}</h2>
            <div className="overflow-x-auto rounded-[1.5rem] border border-black/10 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-zinc-50">
                    <th className="p-4 text-xs uppercase tracking-[0.1em] text-zinc-500">Attribute</th>
                    {compareCandidates.map((c) => (
                      <th key={c.id} className="p-4 font-semibold">{c.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Title", get: (c: Candidate) => c.title },
                    { label: "Location", get: (c: Candidate) => c.location },
                    { label: "Experience", get: (c: Candidate) => `${c.yearsExperience} years` },
                    { label: "Skills", get: (c: Candidate) => c.skills.join(", ") },
                    { label: "Availability", get: (c: Candidate) => c.availability },
                    { label: "Education", get: (c: Candidate) => c.education },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-black/5 last:border-0">
                      <td className="p-4 text-xs uppercase tracking-[0.1em] text-zinc-500">{row.label}</td>
                      {compareCandidates.map((c) => (
                        <td key={c.id} className="p-4 text-zinc-700">{row.get(c)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      ) : null}
    </div>
  );
}
