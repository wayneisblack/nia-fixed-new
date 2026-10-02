"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../lib/api";

export type ExperienceEntry = { id: string; title: string; organization: string; startYear: string; endYear: string; current: boolean };

export function ExperienceEditor({ initialExperience }: { initialExperience: ExperienceEntry[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState<ExperienceEntry[]>(initialExperience);
  const [saving, setSaving] = useState(false);

  function addRow() {
    setRows((r) => [...r, { id: crypto.randomUUID(), title: "", organization: "", startYear: "", endYear: "", current: false }]);
  }
  function updateRow(id: string, patch: Partial<ExperienceEntry>) {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }
  function removeRow(id: string) {
    setRows((r) => r.filter((row) => row.id !== id));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: rows }),
      });
      router.refresh();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "w-full rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30";

  if (!editing) {
    return (
      <div>
        {initialExperience.length === 0 ? (
          <p className="text-sm text-zinc-400">Nothing added yet.</p>
        ) : (
          <ul className="space-y-3">
            {initialExperience.map((row) => (
              <li key={row.id} className="rounded-xl border border-black/10 bg-zinc-50/70 p-3.5">
                <p className="text-sm font-medium">{row.title || "Untitled role"}</p>
                <p className="text-xs text-zinc-500">
                  {row.organization} · {row.startYear || "—"}–{row.current ? "Present" : row.endYear || "—"}
                </p>
              </li>
            ))}
          </ul>
        )}
        <button onClick={() => setEditing(true)} className="mt-3 text-xs font-medium text-black underline underline-offset-2">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.id} className="space-y-2.5 rounded-xl border border-black/10 bg-zinc-50/70 p-3.5">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <input value={row.title} onChange={(e) => updateRow(row.id, { title: e.target.value })} placeholder="Role / title" className={inputClass} />
            <input value={row.organization} onChange={(e) => updateRow(row.id, { organization: e.target.value })} placeholder="Company" className={inputClass} />
          </div>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
            <input value={row.startYear} onChange={(e) => updateRow(row.id, { startYear: e.target.value })} placeholder="Start year" className={inputClass} />
            <input
              value={row.current ? "" : row.endYear}
              disabled={row.current}
              onChange={(e) => updateRow(row.id, { endYear: e.target.value })}
              placeholder={row.current ? "Present" : "End year"}
              className={`${inputClass} disabled:opacity-50`}
            />
            <button type="button" onClick={() => removeRow(row.id)} className="rounded-xl border border-black/10 px-3 text-sm text-zinc-400 hover:text-black">
              ✕
            </button>
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-500">
            <input type="checkbox" checked={row.current} onChange={(e) => updateRow(row.id, { current: e.target.checked, endYear: "" })} />
            I currently work here
          </label>
        </div>
      ))}
      <button type="button" onClick={addRow} className="w-full rounded-xl border border-dashed border-black/20 py-2.5 text-sm text-zinc-500 transition hover:border-black/40 hover:text-black">
        + Add work experience
      </button>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => {
            setRows(initialExperience);
            setEditing(false);
          }}
          className="btn-secondary px-4 py-2 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
