"use client";

import { useState, type MouseEvent } from "react";
import { apiFetch } from "../lib/api";

export function BookmarkButton({
  opportunityId,
  initialSaved = false,
  size = "md",
}: {
  opportunityId: string;
  initialSaved?: boolean;
  size?: "sm" | "md";
}) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function handleClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (pending) return;

    setPending(true);
    const next = !saved;
    setSaved(next); // optimistic

    try {
      const response = await apiFetch("/api/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId }),
      });
      if (!response.ok) throw new Error("Request failed");
      const payload = await response.json();
      setSaved(Boolean(payload?.data?.saved));
    } catch {
      setSaved(!next); // revert on failure
    } finally {
      setPending(false);
    }
  }

  const dimension = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from favourites" : "Save to favourites"}
      title={saved ? "Remove from favourites" : "Save to favourites"}
      className={`flex ${dimension} shrink-0 items-center justify-center rounded-full border transition active:scale-90 ${
        saved ? "border-black bg-black text-white" : "border-black/15 bg-white text-zinc-500 hover:border-black/30 hover:text-black"
      }`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
        <path d="M6 3h12a1 1 0 0 1 1 1v16.5a.5.5 0 0 1-.77.42L12 17l-6.23 3.92a.5.5 0 0 1-.77-.42V4a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
