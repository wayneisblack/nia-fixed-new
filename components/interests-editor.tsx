"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { OPPORTUNITY_CATEGORIES } from "../lib/categories";

export function InterestsEditor({ initialCategories, isCompany = false }: { initialCategories: string[]; isCompany?: boolean }) {
  const { update } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(initialCategories.length === 0);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [saving, setSaving] = useState(false);

  function toggle(category: string) {
    setCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories }),
      });
      await update({ categories });
      router.refresh();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span>{isCompany ? "Hiring interests:" : "Interested in:"}</span>
        {categories.length === 0 ? (
          <span className="text-zinc-400">Nothing set yet</span>
        ) : (
          categories.map((c) => (
            <span key={c} className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700">
              {c}
            </span>
          ))
        )}
        <button onClick={() => setEditing(true)} className="text-xs font-medium text-black underline underline-offset-2">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[1.25rem] border border-black/10 bg-zinc-50/70 p-4">
      <p className="text-sm font-medium">{isCompany ? "What are you hiring for?" : "What are you interested in?"}</p>
      <p className="mt-1 text-xs text-zinc-500">This drives what shows up under Recommended for you.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {OPPORTUNITY_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={categories.includes(category)}
            onClick={() => toggle(category)}
            className={`rounded-full border px-3.5 py-2 text-xs font-medium transition ${
              categories.includes(category) ? "border-black bg-black text-white" : "border-black/15 bg-white text-zinc-600 hover:border-black/30"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        {initialCategories.length > 0 ? (
          <button onClick={() => { setCategories(initialCategories); setEditing(false); }} className="btn-secondary px-4 py-2 text-xs">
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
