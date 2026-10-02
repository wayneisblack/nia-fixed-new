"use client";

import { useRef, useState } from "react";

const COMMIT_THRESHOLD = 82;

export function DragToContinue({
  onContinue,
  label = "Continue",
  loading = false,
  disabled = false,
}: {
  onContinue: () => void;
  label?: string;
  loading?: boolean;
  disabled?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [popping, setPopping] = useState(false);
  const committedRef = useRef(false);

  const inert = disabled || loading;

  function progressFromClientX(clientX: number) {
    const track = trackRef.current;
    if (!track) return 0;
    const rect = track.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(100, ratio * 100));
  }

  function commit() {
    if (committedRef.current) return;
    committedRef.current = true;
    setProgress(100);
    setPopping(true);
    setDragging(false);
    window.setTimeout(() => onContinue(), 260);
  }

  function release(finalProgress: number) {
    if (committedRef.current) return;
    if (finalProgress >= COMMIT_THRESHOLD) {
      commit();
    } else {
      setDragging(false);
      setProgress(0);
    }
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (inert) return;
    committedRef.current = false;
    setPopping(false);
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    setProgress(progressFromClientX(e.clientX));
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (inert || !dragging) return;
    setProgress(progressFromClientX(e.clientX));
  }

  function handlePointerUp(e: React.PointerEvent) {
    if (inert || !dragging) return;
    release(progressFromClientX(e.clientX));
  }

  function cancel() {
    if (committedRef.current) return;
    setDragging(false);
    setProgress(0);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (inert) return;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(100, progress + 20);
      setProgress(next);
      if (next >= 100) commit();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setProgress((p) => Math.max(0, p - 20));
    } else if (e.key === "Home") {
      e.preventDefault();
      setProgress(0);
    } else if (e.key === "End" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      commit();
    }
  }

  const showHint = !inert && !dragging && progress === 0;
  const nearCommit = progress >= COMMIT_THRESHOLD;

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={inert ? -1 : 0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-disabled={inert}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={cancel}
      onKeyDown={handleKeyDown}
      className={`relative h-14 w-full touch-none select-none overflow-hidden rounded-full border transition-colors ${
        inert ? "cursor-not-allowed border-white/10 bg-white/[0.03]" : "cursor-grab border-white/20 bg-white/5 active:cursor-grabbing"
      } ${nearCommit ? "border-white/60" : ""}`}
    >
      {/* Fill */}
      <div
        className={`absolute inset-y-0 left-0 rounded-full bg-white ${dragging ? "" : "transition-[width] duration-300 ease-out"}`}
        style={{ width: `${progress}%`, opacity: inert ? 0.25 : 1 }}
      />

      {/* Center label */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-1.5 text-sm font-semibold">
        <span className={progress > 50 ? "text-black" : "text-white"}>
          {loading ? "Saving..." : nearCommit ? "Release to continue" : label}
        </span>
      </div>

      {/* Hint chevrons, shown only at rest to teach the gesture */}
      {showHint ? (
        <div className="pointer-events-none absolute inset-y-0 right-5 flex items-center gap-0.5 text-white/50">
          {[0, 1, 2].map((i) => (
            <svg key={i} className="drag-hint-chevron" style={{ animationDelay: `${i * 160}ms` }} viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m7.5 4 6 6-6 6" />
            </svg>
          ))}
        </div>
      ) : null}

      {/* Thumb */}
      <div
        className={`absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black shadow-lg ${popping ? "drag-thumb-pop" : ""}`}
        style={{ left: `calc(${progress}% - ${(progress / 100) * 44}px + 1.5px)` }}
      >
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m7.5 4 6 6-6 6" />
        </svg>
      </div>
    </div>
  );
}
