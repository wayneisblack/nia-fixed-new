"use client";

import { useEffect, useState } from "react";
import type { OnboardingStep } from "../../lib/onboarding";

const CONFETTI_COLORS = ["#ffffff", "#d4d4d8", "#a1a1aa", "#fafafa", "#e4e4e7"];

type ConfettiPiece = {
  id: number;
  left: number;
  drift: string;
  duration: number;
  delay: number;
  size: number;
  color: string;
  rounded: boolean;
};

function makeConfettiPieces(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    drift: `${(Math.random() - 0.5) * 40}vw`,
    duration: 2200 + Math.random() * 1800,
    delay: Math.random() * 500,
    size: 6 + Math.random() * 8,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    rounded: Math.random() > 0.5,
  }));
}

function ConfettiBurst() {
  // Randomized per-piece styling is generated once, after mount, inside an
  // effect — not during render — so the render function itself stays pure.
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => setPieces(makeConfettiPieces(90)), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * (p.rounded ? 1 : 0.4),
            backgroundColor: p.color,
            borderRadius: p.rounded ? "9999px" : "2px",
            animationDuration: `${p.duration}ms`,
            animationDelay: `${p.delay}ms`,
            // @ts-expect-error -- custom property consumed by the confetti-fall keyframes
            "--drift": p.drift,
          }}
        />
      ))}
    </div>
  );
}

export function CompletionTransition({ steps, onDone }: { steps: OnboardingStep[]; onDone: () => void }) {
  const mandatorySteps = steps.filter((s) => s.mandatory && s.id !== "complete");
  const [revealed, setRevealed] = useState(0);
  const [flash, setFlash] = useState(true);

  const allRevealed = revealed >= mandatorySteps.length;

  useEffect(() => {
    const flashTimeout = setTimeout(() => setFlash(false), 700);
    return () => clearTimeout(flashTimeout);
  }, []);

  useEffect(() => {
    if (allRevealed) {
      const timeout = setTimeout(onDone, 2200);
      return () => clearTimeout(timeout);
    }
    const timeout = setTimeout(() => setRevealed((r) => r + 1), 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  return (
    <div className="section-in mx-auto flex w-full max-w-md flex-col items-center text-center">
      {flash ? <div className="flash-white" /> : null}
      {allRevealed ? <ConfettiBurst /> : null}

      <p className="hero-pop eyebrow text-zinc-500">Profile complete</p>
      <div className="mt-6 w-full space-y-2.5">
        {mandatorySteps.map((step, i) => (
          <div
            key={step.id}
            className={`flex items-center justify-between rounded-xl border border-black/10 bg-zinc-50/70 px-4 py-3 ${
              i < revealed ? "check-row-pop" : "opacity-0"
            }`}
          >
            <span className="text-sm font-medium text-zinc-700">{step.short}</span>
            <span className="toast-check text-sm font-bold text-black">✓</span>
          </div>
        ))}
      </div>

      <div className={`mt-8 transition-all duration-700 ${allRevealed ? "hero-pop opacity-100" : "scale-90 opacity-0"}`}>
        <p className="text-shimmer text-7xl font-black tracking-[-0.06em]">100%</p>
        <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">You&apos;re ready.</h2>
        <p className="mt-2 text-zinc-500">Taking you to your dashboard...</p>
      </div>
    </div>
  );
}
