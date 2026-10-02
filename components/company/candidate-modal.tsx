"use client";

import { useState } from "react";
import type { Candidate } from "../../lib/mock-candidates";
import type { HiringStage } from "../../lib/mock-jobs";
import type { MatchResult } from "../../lib/match";
import { useDialog } from "../../lib/use-dialog";
import { MatchRing } from "../animated/match-ring";
import { FadeIn } from "../animated/fade-in";

export function CandidateModal({
  candidate,
  match,
  note,
  isShortlisted,
  onClose,
  onShortlist,
  onRemoveShortlist,
  onSaveNote,
  onContact,
}: {
  candidate: Candidate;
  match?: MatchResult;
  note?: string;
  isShortlisted: boolean;
  onClose: () => void;
  onShortlist: () => void;
  onRemoveShortlist: () => void;
  onSaveNote: (note: string) => void;
  onContact: () => void;
}) {
  const [noteDraft, setNoteDraft] = useState(note ?? "");
  const { panelRef, onKeyDown } = useDialog(onClose);

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="candidate-modal-name"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="modal-panel max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-black/10 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <FadeIn>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black text-lg font-bold text-white">
                {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h2 id="candidate-modal-name" className="text-2xl font-bold tracking-[-0.03em]">{candidate.name}</h2>
                <p className="text-sm text-zinc-500">{candidate.title}</p>
              </div>
            </div>
            {match ? (
              <div className="shrink-0 rounded-2xl border border-black/10 bg-zinc-950 p-2">
                <MatchRing score={match.score} size={60} strokeWidth={5} />
              </div>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={60}>
          <div className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-600">
            <span className="skill-badge badge-light rounded-full border border-black/10 px-3 py-1">{candidate.location}</span>
            <span className="skill-badge badge-light rounded-full border border-black/10 px-3 py-1">{candidate.yearsExperience} yrs experience</span>
            <span className="skill-badge badge-light rounded-full border border-black/10 px-3 py-1">{candidate.availability}</span>
            {candidate.remoteOnly ? <span className="skill-badge badge-light rounded-full border border-black/10 px-3 py-1">Open to remote</span> : null}
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <p className="mt-5 text-sm leading-7 text-zinc-700">{candidate.resumeSummary}</p>
        </FadeIn>

        {match ? (
          <FadeIn delay={140}>
            <div className="mt-6 rounded-2xl border border-black/10 bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Why Nia matched this candidate</p>
              <ul className="mt-3 space-y-1.5">
                {match.reasons.map((reason, i) => (
                  <li key={reason.label} className="step-fade flex items-center gap-2 text-sm" style={{ animationDelay: `${180 + i * 45}ms` }}>
                    <span className={reason.met ? "text-black" : "text-zinc-300"}>{reason.met ? "✓" : "✗"}</span>
                    <span className={reason.met ? "text-zinc-800" : "text-zinc-400 line-through"}>{reason.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ) : null}

        <FadeIn delay={180}>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {candidate.skills.map((skill) => (
                <span key={skill} className="skill-badge rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-zinc-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={220}>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Projects</p>
            <div className="mt-2 space-y-3">
              {candidate.projects.map((project) => (
                <div key={project.name} className="card-interactive rounded-xl border border-black/10 bg-zinc-50 p-3">
                  <p className="text-sm font-semibold">{project.name}</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-600">{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={260}>
          <div className="mt-6 grid gap-4 text-sm text-zinc-600 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Education</p>
              <p className="mt-1">{candidate.education}</p>
            </div>
            {candidate.portfolioUrl ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Portfolio</p>
                <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block underline">
                  {candidate.portfolioUrl.replace(/^https?:\/\//, "")}
                </a>
              </div>
            ) : null}
          </div>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Recruiter notes</p>
            <textarea
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onBlur={() => onSaveNote(noteDraft)}
              rows={3}
              placeholder="Private notes about this candidate — visible only to your team."
              className="mt-2 w-full rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm outline-none transition focus:border-black/30"
            />
          </div>
        </FadeIn>

        <FadeIn delay={340}>
          <div className="mt-8 flex flex-wrap gap-3">
            {isShortlisted ? (
              <button onClick={onRemoveShortlist} className="btn-secondary">Remove from shortlist</button>
            ) : (
              <button onClick={onShortlist} className="btn-primary">Shortlist candidate</button>
            )}
            <button onClick={onContact} className="btn-secondary">Contact</button>
            <button onClick={onClose} className="ml-auto text-sm text-zinc-500 transition hover:text-black">Close</button>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export const STAGES: HiringStage[] = ["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"];
