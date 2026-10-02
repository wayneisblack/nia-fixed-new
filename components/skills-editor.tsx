"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { SkillsPicker } from "./skills-picker";

export function SkillsEditor({ initialSkills }: { initialSkills: string[] }) {
  const { update } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(initialSkills.length === 0);
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      await update({ skills });
      router.refresh();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCustomSkillAdded(skill: string) {
    fetch("/api/skills/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill }),
    }).catch(() => {});
  }

  if (!editing) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span>Skills:</span>
        {skills.length === 0 ? (
          <span className="text-zinc-400">Nothing set yet</span>
        ) : (
          skills.map((s) => (
            <span key={s} className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700">
              {s}
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
      <p className="text-sm font-medium">What are you good at?</p>
      <p className="mt-1 text-xs text-zinc-500">Choose the skills that best represent you.</p>
      <div className="mt-3">
        <SkillsPicker value={skills} onChange={setSkills} onCustomSkillAdded={handleCustomSkillAdded} />
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        {initialSkills.length > 0 ? (
          <button onClick={() => { setSkills(initialSkills); setEditing(false); }} className="btn-secondary px-4 py-2 text-xs">
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
