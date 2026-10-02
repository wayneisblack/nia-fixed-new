"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../lib/api";

const COMPANY_SIZES = ["1–10 employees", "11–50 employees", "51–200 employees", "200–1,000 employees", "1,000+ employees"];

export function CompanyDetailsEditor({
  initialIndustry,
  initialCompanySize,
  initialWebsite,
}: {
  initialIndustry: string;
  initialCompanySize: string;
  initialWebsite: string;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(!initialIndustry || !initialCompanySize);
  const [industry, setIndustry] = useState(initialIndustry);
  const [companySize, setCompanySize] = useState(initialCompanySize);
  const [website, setWebsite] = useState(initialWebsite);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!industry.trim() || !companySize) {
      setError("Industry and company size are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const response = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, companySize, website }),
      });
      if (!response.ok) throw new Error("Couldn't save your company details.");
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
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700">{initialIndustry || "No industry set"}</span>
        <span className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700">{initialCompanySize || "No size set"}</span>
        {initialWebsite ? (
          <a href={initialWebsite} target="_blank" rel="noreferrer" className="text-xs text-black underline underline-offset-2">
            {initialWebsite}
          </a>
        ) : null}
        <button onClick={() => setEditing(true)} className="text-xs font-medium text-black underline underline-offset-2">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-700">Industry</label>
        <input value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-700">Company size</label>
        <div className="flex flex-wrap gap-2">
          {COMPANY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setCompanySize(size)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                companySize === size ? "border-black bg-black text-white" : "border-black/10 bg-white text-zinc-600 hover:border-black/25"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-zinc-700">Website (optional)</label>
        <input
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://"
          className="w-full rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30"
        />
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <div className="flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        {initialIndustry && initialCompanySize ? (
          <button
            onClick={() => {
              setIndustry(initialIndustry);
              setCompanySize(initialCompanySize);
              setWebsite(initialWebsite);
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
