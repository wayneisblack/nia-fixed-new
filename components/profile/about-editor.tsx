"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../lib/api";

export function AboutEditor({ initialAbout, isCompany }: { initialAbout: string; isCompany: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(initialAbout.trim().length === 0);
  const [about, setAbout] = useState(initialAbout);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!about.trim()) {
      setError(isCompany ? "A short description of your company is required." : "A short bio is required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const response = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ about }),
      });
      if (!response.ok) throw new Error("Couldn't save your bio.");
      router.refresh();
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-zinc-600">{initialAbout || <span className="text-zinc-400">Nothing set yet</span>}</p>
        <button onClick={() => setEditing(true)} className="shrink-0 text-xs font-medium text-black underline underline-offset-2">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div>
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        rows={4}
        maxLength={2000}
        className="w-full resize-none rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30"
      />
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      <div className="mt-3 flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        {initialAbout ? (
          <button
            onClick={() => {
              setAbout(initialAbout);
              setEditing(false);
              setError("");
            }}
            className="btn-secondary px-4 py-2 text-xs"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
