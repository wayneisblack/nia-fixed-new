"use client";

import { DragToContinue } from "./drag-to-continue";

export function StepActions({
  onBack,
  onContinue,
  onSkip,
  continueLabel = "Continue",
  loading = false,
  disabled = false,
  showBack = true,
  error,
  requiredReason,
}: {
  onBack?: () => void;
  onContinue: () => void;
  onSkip?: () => void;
  continueLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  showBack?: boolean;
  error?: string;
  /** Shown instead of a skip button when this stage is mandatory. */
  requiredReason?: string;
}) {
  return (
    <div className="mt-8">
      {error ? <p className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}
      {!onSkip && requiredReason ? <p className="mb-4 text-xs text-zinc-500">{requiredReason}</p> : null}
      <div className="flex items-center gap-3">
        {showBack && onBack ? (
          <button type="button" onClick={onBack} className="btn-ghost-dark shrink-0">
            Back
          </button>
        ) : null}
        <div className="flex-1">
          <DragToContinue onContinue={onContinue} label={continueLabel} loading={loading} disabled={disabled} />
        </div>
      </div>
      {onSkip ? (
        <button type="button" onClick={onSkip} className="mt-3 text-sm text-zinc-500 underline underline-offset-2 transition hover:text-white">
          Skip for now
        </button>
      ) : null}
    </div>
  );
}
