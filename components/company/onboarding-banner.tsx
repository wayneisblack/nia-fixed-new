"use client";

import { FadeIn } from "../animated/fade-in";

export function OnboardingBanner({
  companyName,
  onSetUpJob,
  onSkip,
}: {
  companyName?: string | null;
  onSetUpJob: () => void;
  onSkip: () => void;
}) {
  return (
    <FadeIn>
      <div className="mb-8 flex flex-col gap-5 rounded-[1.75rem] border border-black/10 bg-zinc-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400">Welcome{companyName ? `, ${companyName}` : ""}</p>
          <h2 className="mt-2 text-xl font-bold tracking-[-0.03em] sm:text-2xl">Post your first job to get started.</h2>
          <p className="mt-2 max-w-xl text-sm text-zinc-300">
            The dashboard below is showing sample candidates and roles so you can see how Nia works. Publish a real
            opening and Nia will start surfacing matches for it.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button onClick={onSkip} className="btn-ghost-dark">
            Skip for now
          </button>
          <button onClick={onSetUpJob} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 active:scale-95">
            Set up your first job
          </button>
        </div>
      </div>
    </FadeIn>
  );
}
