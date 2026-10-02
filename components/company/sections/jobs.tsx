"use client";

import { useEffect, useState } from "react";
import type { Job } from "../../../lib/mock-jobs";
import { useDialog } from "../../../lib/use-dialog";
import { CountUp } from "../../animated/count-up";
import { FadeIn } from "../../animated/fade-in";

export function JobsSection({
  jobs,
  onAddJob,
  onFindCandidatesFor,
  autoOpenCreate = false,
  onAutoOpenHandled,
}: {
  jobs: Job[];
  onAddJob: (job: Job) => void;
  onFindCandidatesFor: (job: Job) => void;
  autoOpenCreate?: boolean;
  onAutoOpenHandled?: () => void;
}) {
  const [creating, setCreating] = useState(autoOpenCreate);

  useEffect(() => {
    if (autoOpenCreate) {
      onAutoOpenHandled?.();
    }
  }, [autoOpenCreate, onAutoOpenHandled]);

  return (
    <div>
      <FadeIn>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="eyebrow">Jobs</p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Open roles</h1>
          </div>
          <button onClick={() => setCreating(true)} className="btn-primary">+ New job</button>
        </div>
      </FadeIn>

      <div className="space-y-4">
        {jobs.map((job, i) => (
          <FadeIn key={job.id} delay={i * 70}>
            <div className="card-interactive rounded-[1.5rem] border border-black/10 bg-white p-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold">{job.title}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] transition-colors duration-500 ${
                        job.status === "Open" ? "bg-black text-white" : job.status === "Paused" ? "bg-zinc-200 text-zinc-600" : "bg-zinc-100 text-zinc-400"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-500">
                    {job.department} · {job.location}{job.remote ? " · Remote" : ""} · {job.employmentType}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {job.skillsWanted.map((skill) => (
                      <span key={skill} className="skill-badge rounded-full border border-black/10 bg-zinc-50 px-2 py-0.5 text-[11px] text-zinc-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <div className="text-center">
                    <p className="text-xl font-black"><CountUp value={job.applicantIds.length} duration={700} /></p>
                    <p className="text-[10px] uppercase tracking-[0.1em] text-zinc-500">Applicants</p>
                  </div>
                  <button onClick={() => onFindCandidatesFor(job)} className="btn-secondary text-xs">
                    AI-recommended candidates
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

      {creating ? (
        <NewJobModal
          onClose={() => setCreating(false)}
          onCreate={(job) => {
            onAddJob(job);
            setCreating(false);
          }}
        />
      ) : null}
    </div>
  );
}

function NewJobModal({ onClose, onCreate }: { onClose: () => void; onCreate: (job: Job) => void }) {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState(false);
  const [skills, setSkills] = useState("");
  const [employmentType, setEmploymentType] = useState<Job["employmentType"]>("Full-time");
  const { panelRef, onKeyDown } = useDialog(onClose);

  function handleSubmit() {
    if (!title.trim()) return;
    onCreate({
      id: `${title.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      title: title.trim(),
      department: "Engineering",
      location: location.trim() || "Remote",
      remote,
      employmentType,
      status: "Open",
      skillsWanted: skills.split(",").map((s) => s.trim()).filter(Boolean),
      minYearsExperience: 0,
      applicantIds: [],
      postedAt: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-job-title"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        className="modal-panel w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="new-job-title" className="text-2xl font-bold tracking-[-0.03em]">New job posting</h2>
        <div className="mt-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Job title"
            className="w-full rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm outline-none transition focus:border-black/30"
          />
          <div className="flex gap-3">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="flex-1 rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm outline-none transition focus:border-black/30"
            />
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value as Job["employmentType"])}
              className="rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
            </select>
          </div>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills wanted, comma separated"
            className="w-full rounded-xl border border-black/10 bg-zinc-50 p-3 text-sm outline-none transition focus:border-black/30"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-600">
            <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} className="h-4 w-4 rounded border-black/20" />
            Open to remote candidates
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={handleSubmit} className="btn-primary flex-1">Publish job</button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}
