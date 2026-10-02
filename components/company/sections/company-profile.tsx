"use client";

import { useState } from "react";
import type { CompanyProfile } from "../dashboard-state";
import { FadeIn } from "../../animated/fade-in";

const inputClass = "w-full rounded-xl border border-black/10 bg-zinc-50 px-3.5 py-2.5 text-sm outline-none transition focus:border-black/30";

export function CompanyProfileSection({ profile, onSave }: { profile: CompanyProfile; onSave: (profile: CompanyProfile) => void }) {
  const [draft, setDraft] = useState(profile);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <FadeIn>
        <div className="mb-6">
          <p className="eyebrow">Company Profile</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">About your company</h1>
          <p className="mt-2 text-zinc-600">This is what candidates see when you reach out.</p>
        </div>
      </FadeIn>

      <FadeIn delay={70}>
        <div className="glass-panel-strong space-y-5 rounded-[1.75rem] p-6">
          <Field label="Company name">
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Industry">
              <input value={draft.industry} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Company size">
              <select value={draft.size} onChange={(e) => setDraft({ ...draft, size: e.target.value })} className={inputClass}>
                <option>1–10 employees</option>
                <option>11–50 employees</option>
                <option>51–200 employees</option>
                <option>200+ employees</option>
              </select>
            </Field>
          </div>
          <Field label="Website">
            <input value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} placeholder="https://" className={inputClass} />
          </Field>
          <Field label="About">
            <textarea
              value={draft.about}
              onChange={(e) => setDraft({ ...draft, about: e.target.value })}
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="btn-primary">Save changes</button>
            {saved ? (
              <span className="step-fade flex items-center gap-1.5 text-sm text-zinc-500">
                <span className="toast-check">✓</span> Saved
              </span>
            ) : null}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export function SettingsSection({ email }: { email?: string | null }) {
  return (
    <div className="max-w-2xl">
      <FadeIn>
        <div className="mb-6">
          <p className="eyebrow">Settings</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Account & team</h1>
        </div>
      </FadeIn>

      <FadeIn delay={70}>
        <div className="glass-panel-strong space-y-6 rounded-[1.75rem] p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Account</p>
            <p className="mt-2 text-sm text-zinc-700">Signed in as {email ?? "—"}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Team members</p>
            <div className="mt-3 space-y-2">
              <TeamRow name="You" role="Admin" email={email ?? ""} />
            </div>
            <button className="btn-secondary mt-3 text-sm">+ Invite teammate</button>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Roles & permissions</p>
            <p className="mt-2 text-sm text-zinc-600">Admins can manage jobs, candidates, and team access. Recruiters can manage jobs and candidates only.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function TeamRow({ name, role, email }: { name: string; role: string; email: string }) {
  return (
    <div className="card-interactive flex items-center justify-between rounded-xl border border-black/10 bg-zinc-50 px-4 py-2.5 text-sm">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-xs text-zinc-500">{email}</p>
      </div>
      <span className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-xs">{role}</span>
    </div>
  );
}
