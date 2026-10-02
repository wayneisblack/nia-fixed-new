"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../lib/api";

export type EducationEntry = { id: string; school: string; fieldOfStudy: string; startYear: string; endYear: string };

export function EducationEditor({ initialEducation }: { initialEducation: EducationEntry[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [rows, setRows] = useState<EducationEntry[]>(initialEducation);
  const [saving, setSaving] = useState(false);

  function addRow() {
    setRows((r) => [...r, { id: crypto.randomUUID(), school: "", fieldOfStudy: "", startYear: "", endYear: "" }]);
  }
  function updateRow(id: string, patch: Partial<EducationEntry>) {
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
        body: JSON.stringify({ education: rows }),
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
        {initialEducation.length === 0 ? (
          <p className="text-sm text-zinc-400">Nothing added yet.</p>
        ) : (
          <ul className="space-y-3">
            {initialEducation.map((row) => (
              <li key={row.id} className="rounded-xl border border-black/10 bg-zinc-50/70 p-3.5">
                <p className="text-sm font-medium">{row.school || "Untitled school"}</p>
                <p className="text-xs text-zinc-500">
                  {row.fieldOfStudy} · {row.startYear || "—"}–{row.endYear || "—"}
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
            <input value={row.school} onChange={(e) => updateRow(row.id, { school: e.target.value })} placeholder="School" className={inputClass} />
            <input value={row.fieldOfStudy} onChange={(e) => updateRow(row.id, { fieldOfStudy: e.target.value })} placeholder="Field of study" className={inputClass} />
          </div>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
            <input value={row.startYear} onChange={(e) => updateRow(row.id, { startYear: e.target.value })} placeholder="Start year" className={inputClass} />
            <input value={row.endYear} onChange={(e) => updateRow(row.id, { endYear: e.target.value })} placeholder="End year" className={inputClass} />
            <button type="button" onClick={() => removeRow(row.id)} className="rounded-xl border border-black/10 px-3 text-sm text-zinc-400 hover:text-black">
              ✕
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={addRow} className="w-full rounded-xl border border-dashed border-black/20 py-2.5 text-sm text-zinc-500 transition hover:border-black/40 hover:text-black">
        + Add education
      </button>
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          onClick={() => {
            setRows(initialEducation);
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
