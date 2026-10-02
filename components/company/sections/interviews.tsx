"use client";

import { useState } from "react";
import type { Candidate } from "../../../lib/mock-candidates";
import type { Job } from "../../../lib/mock-jobs";
import type { Interview } from "../dashboard-state";
import { useDialog } from "../../../lib/use-dialog";
import { FadeIn } from "../../animated/fade-in";

export function InterviewsSection({
  interviews,
  candidates,
  jobs,
  onSchedule,
  onSetFeedback,
}: {
  interviews: Interview[];
  candidates: Candidate[];
  jobs: Job[];
  onSchedule: (interview: Omit<Interview, "id" | "status">) => void;
  onSetFeedback: (id: string, feedback: string) => void;
}) {
  const [scheduling, setScheduling] = useState(false);
  const candidateById = (id: string) => candidates.find((c) => c.id === id);
  const jobById = (id?: string) => jobs.find((j) => j.id === id);

  const upcoming = interviews.filter((i) => i.status === "Scheduled").sort((a, b) => a.date.localeCompare(b.date));
  const past = interviews.filter((i) => i.status !== "Scheduled");

  return (
    <div>
      <FadeIn>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="eyebrow">Interviews</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Interview schedule</h1>
          </div>
          <button onClick={() => setScheduling(true)} className="btn-primary">+ Schedule</button>
        </div>
      </FadeIn>

      <FadeIn delay={40}>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">Upcoming</h2>
      </FadeIn>
      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <FadeIn><p className="rounded-[1.5rem] border border-dashed border-black/15 bg-zinc-50 p-8 text-center text-sm text-zinc-500">No interviews scheduled.</p></FadeIn>
        ) : (
          upcoming.map((interview, i) => {
            const candidate = candidateById(interview.candidateId);
            const job = jobById(interview.jobId);
            if (!candidate) return null;
            return (
              <FadeIn key={interview.id} delay={80 + i * 70}>
                <div className="card-interactive rounded-[1.5rem] border border-black/10 bg-white p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold">{candidate.name} {job ? <span className="font-normal text-zinc-500">· {job.title}</span> : null}</p>
                      <p className="mt-1 text-sm text-zinc-500">{new Date(`${interview.date}T${interview.time}`).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
                    </div>
                    <span className="rounded-full bg-black px-3 py-1 text-xs text-white">Scheduled</span>
                  </div>
                  {interview.notes ? <p className="mt-3 text-sm text-zinc-600">{interview.notes}</p> : null}
                  <FeedbackField onSave={(fb) => onSetFeedback(interview.id, fb)} />
                </div>
              </FadeIn>
            );
          })
        )}
      </div>

      {past.length > 0 ? (
        <>
          <FadeIn><h2 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">Completed</h2></FadeIn>
          <div className="space-y-3">
            {past.map((interview, i) => {
              const candidate = candidateById(interview.candidateId);
              if (!candidate) return null;
              return (
                <FadeIn key={interview.id} delay={i * 60}>
                  <div className="rounded-[1.5rem] border border-black/10 bg-zinc-50 p-5">
                    <p className="font-semibold">{candidate.name}</p>
                    <p className="mt-1 text-sm text-zinc-600">{interview.feedback}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </>
      ) : null}

      {scheduling ? (
        <ScheduleModal
          candidates={candidates}
          jobs={jobs}
          onClose={() => setScheduling(false)}
          onSchedule={(interview) => {
            onSchedule(interview);
          }}
        />
      ) : null}
    </div>
  );
}

function FeedbackField({ onSave }: { onSave: (feedback: string) => void }) {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <p className="step-fade mt-3 flex items-center gap-2 text-xs text-zinc-500">
        <span className="toast-check">✓</span> Feedback saved
      </p>
    );
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="mt-3 text-xs text-zinc-500 underline transition hover:text-black">
        Add feedback / mark completed
      </button>
    );
  }

  return (
    <div className="step-fade mt-3 flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Quick feedback..."
        className="flex-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-black/30"
      />
      <button
        onClick={() => {
          if (!value.trim()) return;
          onSave(value.trim());
          setSaved(true);
        }}
        className="rounded-lg bg-black px-3 py-2 text-xs text-white transition active:scale-95"
      >
        Save
      </button>
    </div>
  );
}

function ScheduleModal({
  candidates,
  jobs,
  onClose,
  onSchedule,
}: {
  candidates: Candidate[];
  jobs: Job[];
  onClose: () => void;
  onSchedule: (interview: Omit<Interview, "id" | "status">) => void;
}) {
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? "");
  const [jobId, setJobId] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const { panelRef, onKeyDown } = useDialog(onClose);

  function handleSubmit() {
    if (!candidateId || !date) return;
    onSchedule({ candidateId, jobId: jobId || undefined, date, time, notes });
    setConfirmed(true);
    setTimeout(onClose, 1100);
  }

  const candidateName = candidates.find((c) => c.id === candidateId)?.name;

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={confirmed ? undefined : onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="schedule-interview-title"
        tabIndex={-1}
        onKeyDown={confirmed ? undefined : onKeyDown}
        className="modal-panel w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {confirmed ? (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="toast-check flex h-12 w-12 items-center justify-center rounded-full bg-black text-xl text-white">✓</span>
            <p className="step-fade mt-5 text-lg font-semibold" style={{ animationDelay: "120ms" }}>Interview scheduled</p>
            <p className="step-fade mt-1 text-sm text-zinc-500" style={{ animationDelay: "180ms" }}>{candidateName} will appear under Upcoming.</p>
          </div>
        ) : (
          <>
            <h2 id="schedule-interview-title" className="text-2xl font-bold tracking-[-0.03em]">Schedule interview</h2>
            <div className="mt-6 space-y-4">
              <select value={candidateId} onChange={(e) => setCandidateId(e.target.value)} className="w-full rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm">
                {candidates.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={jobId} onChange={(e) => setJobId(e.target.value)} className="w-full rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm">
                <option value="">No specific job</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
              </select>
              <div className="flex gap-3">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm transition focus:border-black/30" />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm transition focus:border-black/30" />
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Interview notes or agenda..."
                rows={3}
                className="w-full rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm outline-none transition focus:border-black/30"
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleSubmit} className="btn-primary flex-1">Schedule</button>
              <button onClick={onClose} className="btn-secondary">Cancel</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
