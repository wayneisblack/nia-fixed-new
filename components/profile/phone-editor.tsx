"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { PhoneInput, type PhoneValue } from "../phone-input";

const EMPTY_PHONE: PhoneValue = { dialCode: "", number: "" };

export function PhoneEditor({ initialPhone }: { initialPhone: PhoneValue | undefined }) {
  const router = useRouter();
  const [editing, setEditing] = useState(!initialPhone);
  const [phone, setPhone] = useState<PhoneValue>(initialPhone ?? EMPTY_PHONE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!phone.dialCode || !phone.number.trim()) {
      setError("Choose a country code and enter a number.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const response = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Couldn't save your phone number.");
      }
      router.refresh();
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && initialPhone) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700">
          {initialPhone.dialCode} {initialPhone.number}
        </span>
        <button onClick={() => setEditing(true)} className="text-xs font-medium text-black underline underline-offset-2">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div>
      <PhoneInput value={phone} onChange={setPhone} />
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      <div className="mt-3 flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        {initialPhone ? (
          <button
            onClick={() => {
              setPhone(initialPhone);
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
