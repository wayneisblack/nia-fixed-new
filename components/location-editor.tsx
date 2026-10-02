"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { apiFetch } from "../lib/api";
import { WORLD_COUNTRIES } from "../lib/world-countries";
import { LocationPicker, type LocationValue } from "./location-picker";

const EMPTY_LOCATION: LocationValue = { country: "", region: "", city: "" };

export function LocationEditor({ initialLocation }: { initialLocation: LocationValue | undefined }) {
  const { update } = useSession();
  const router = useRouter();
  const [editing, setEditing] = useState(!initialLocation);
  const [location, setLocation] = useState<LocationValue>(initialLocation ?? EMPTY_LOCATION);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isComplete = Boolean(location.country && location.city.trim());

  async function handleSave() {
    if (!isComplete) {
      setError("Country and city are required.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      const response = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error ?? "Couldn't save your location.");
      }
      await update({ location });
      router.refresh();
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && initialLocation) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <span>Location:</span>
        <span className="rounded-full border border-black/10 bg-zinc-50 px-2.5 py-1 text-xs text-zinc-700">
          {[initialLocation.city, initialLocation.region, initialLocation.country].filter(Boolean).join(", ")}
        </span>
        <button onClick={() => setEditing(true)} className="text-xs font-medium text-black underline underline-offset-2">
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-[1.25rem] border border-black/10 bg-zinc-50/70 p-4">
      <p className="text-sm font-medium">Where are you based?</p>
      <p className="mt-1 text-xs text-zinc-500">Required — country and city.</p>
      <div className="mt-3">
        <LocationPicker countries={WORLD_COUNTRIES} value={location} onChange={setLocation} />
      </div>
      {error ? <p className="mt-2 text-xs text-red-600">{error}</p> : null}
      <div className="mt-4 flex gap-2">
        <button onClick={handleSave} disabled={saving} className="btn-primary px-4 py-2 text-xs">
          {saving ? "Saving..." : "Save"}
        </button>
        {initialLocation ? (
          <button onClick={() => { setLocation(initialLocation); setEditing(false); setError(""); }} className="btn-secondary px-4 py-2 text-xs">
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}
