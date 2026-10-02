"use client";

import type { OnboardingStep, StepId } from "../../lib/onboarding";

function StepIcon({ state }: { state: "done" | "current" | "locked" }) {
  if (state === "done") {
    return (
      <span className="toast-check flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
        ✓
      </span>
    );
  }
  if (state === "current") {
    return (
      <span className="glow-pulse relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
        <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
        <span className="relative h-2.5 w-2.5 rounded-full bg-white" />
      </span>
    );
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs text-white/30">
      🔒
    </span>
  );
}

export function OnboardingRoadmap({
  steps,
  currentStepId,
  furthestIndex,
  onJump,
}: {
  steps: OnboardingStep[];
  currentStepId: StepId;
  /** Index of the furthest step the user has reached — everything at or before this is unlocked. */
  furthestIndex: number;
  onJump: (stepId: StepId) => void;
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <nav aria-label="Onboarding progress" className="flex flex-col gap-1">
      {steps.map((step, i) => {
        const state: "done" | "current" | "locked" = i < currentIndex ? "done" : i === currentIndex ? "current" : i <= furthestIndex ? "done" : "locked";
        const unlocked = i <= furthestIndex;
        const isCurrent = step.id === currentStepId;

        return (
          <button
            key={step.id}
            type="button"
            disabled={!unlocked || isCurrent}
            onClick={() => onJump(step.id)}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
              isCurrent ? "bg-white/10" : unlocked ? "hover:bg-white/5" : "cursor-not-allowed opacity-50"
            }`}
          >
            <StepIcon state={state} />
            <span className="flex flex-col">
              <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${isCurrent ? "text-white" : "text-white/50"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-sm font-medium ${isCurrent ? "text-white" : unlocked ? "text-white/70" : "text-white/40"}`}>
                {step.short}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
