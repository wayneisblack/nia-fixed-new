"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../lib/api";

export function CancelApplicationButton({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    setCancelling(true);
    setError("");
    try {
      const response = await apiFetch(`/api/applications/${applicationId}/cancel`, { method: "POST" });
      if (!response.ok) throw new Error("Couldn't cancel this application.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setCancelling(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-600">Cancel this application? You can&apos;t undo this, but you&apos;ll be able to reapply.</span>
        <button onClick={handleCancel} disabled={cancelling} className="rounded-full bg-red-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-red-700">
          {cancelling ? "Cancelling..." : "Yes, cancel"}
        </button>
        <button onClick={() => setConfirming(false)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium text-black transition hover:border-black/20">
          Never mind
        </button>
        {error ? <span className="w-full text-xs text-red-600">{error}</span> : null}
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="btn-secondary text-sm">
      Cancel application
    </button>
  );
}
