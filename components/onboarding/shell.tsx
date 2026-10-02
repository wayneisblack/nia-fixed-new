"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { OnboardingStep, StepId } from "../../lib/onboarding";
import { OnboardingRoadmap } from "./roadmap";

export function OnboardingShell({
  steps,
  currentStepId,
  furthestIndex,
  onJump,
  children,
}: {
  steps: OnboardingStep[];
  currentStepId: StepId;
  furthestIndex: number;
  onJump: (stepId: StepId) => void;
  children: ReactNode;
}) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);
  const percentThroughRoadmap = Math.round((currentIndex / Math.max(steps.length - 1, 1)) * 100);

  return (
    <main className="grain relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      <div className="aurora-layer" />
      <div className="orb-float-a pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-white/[0.07] blur-3xl" />
      <div className="orb-float-b pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="orb-float-a pointer-events-none absolute right-1/3 top-1/2 h-56 w-56 rounded-full bg-white/[0.05] blur-3xl" style={{ animationDelay: "-6s" }} />
      <div className="sheen-sweep" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl">
        {/* Desktop roadmap sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 px-6 py-10 lg:block">
          <Link href="/" className="text-xl font-black tracking-tight">
            nia.
          </Link>
          <div className="mt-10">
            <OnboardingRoadmap steps={steps} currentStepId={currentStepId} furthestIndex={furthestIndex} onJump={onJump} />
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          {/* Mobile progress bar */}
          <div className="border-b border-white/10 px-6 py-5 lg:hidden">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-black tracking-tight">
                nia.
              </Link>
              <p className="text-xs text-white/50">
                Step {currentIndex + 1} of {steps.length}
              </p>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div className="bar-shimmer h-full rounded-full bg-white transition-all duration-700" style={{ width: `${percentThroughRoadmap}%` }} />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-14 sm:px-10">{children}</div>
        </div>
      </div>
    </main>
  );
}
