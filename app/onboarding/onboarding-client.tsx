"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { apiFetch } from "../../lib/api";
import {
  stepsForRole,
  stepIndex,
  nextStepId,
  previousStepId,
  type Role,
  type StepId,
} from "../../lib/onboarding";
import type { LocationValue } from "../../components/location-picker";
import { LocationPicker } from "../../components/location-picker";
import { SkillsPicker } from "../../components/skills-picker";
import { WORLD_COUNTRIES } from "../../lib/world-countries";
import { OPPORTUNITY_CATEGORIES } from "../../lib/categories";
import { OnboardingShell } from "../../components/onboarding/shell";
import { SpotlightField } from "../../components/onboarding/spotlight-field";
import { StepActions } from "../../components/onboarding/step-actions";
import { CompletionTransition } from "../../components/onboarding/completion-transition";

type ExperienceEntry = { id: string; title: string; organization: string; startYear: string; endYear: string; current: boolean };
type EducationEntry = { id: string; school: string; fieldOfStudy: string; startYear: string; endYear: string };

type Draft = {
  about: string;
  categories: string[];
  skills: string[];
  location: LocationValue;
  industry: string;
  companySize: string;
  website: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
};

const COMPANY_SIZES = ["1–10 employees", "11–50 employees", "51–200 employees", "200–1,000 employees", "1,000+ employees"];

async function saveProfile(patch: Record<string, unknown>) {
  const response = await apiFetch("/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error ?? "Couldn't save that. Please try again.");
  }
  return response.json().catch(() => null);
}

export function OnboardingClient({
  role,
  name,
  companyName,
  initialStepId,
  initialProfile,
}: {
  role: Role;
  name: string;
  companyName?: string;
  initialStepId: string;
  initialProfile: Draft;
}) {
  const router = useRouter();
  const { update } = useSession();
  const steps = useMemo(() => stepsForRole(role), [role]);

  const resumedAtStart = stepIndex(role, initialStepId) === 0;
  const [showResumeBanner] = useState(!resumedAtStart);
  const [stepId, setStepId] = useState<StepId>((initialStepId as StepId) ?? steps[0].id);
  const [furthestIndex, setFurthestIndex] = useState(stepIndex(role, initialStepId));
  const [draft, setDraft] = useState<Draft>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const currentStep = steps.find((s) => s.id === stepId) ?? steps[0];
  const currentIndex = stepIndex(role, stepId);

  function goToStep(id: StepId) {
    setError("");
    setStepId(id);
    const idx = stepIndex(role, id);
    setFurthestIndex((f) => Math.max(f, idx));
  }

  async function persistAndAdvance(patch: Record<string, unknown>) {
    setError("");
    setSaving(true);
    try {
      const next = nextStepId(role, stepId);
      await saveProfile({ ...patch, onboardingStep: next });
      goToStep(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  function goBack() {
    setError("");
    setStepId(previousStepId(role, stepId));
  }

  async function finishOnboarding() {
    try {
      await saveProfile({ onboardingComplete: true });
      await update({ onboardingComplete: true });
    } catch {
      // Even if the final flag fails to save, don't strand the user on a
      // finished-looking screen — they'll just see onboarding again next
      // visit, which is safe.
    }
    router.push("/dashboard");
  }

  return (
    <OnboardingShell steps={steps} currentStepId={stepId} furthestIndex={furthestIndex} onJump={goToStep}>
      <div className="w-full">
        {showResumeBanner && currentIndex > 0 && currentStep.id !== "complete" ? (
          <div className="step-fade mx-auto mb-8 w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
            Welcome back. You were working on <span className="font-semibold text-white">{currentStep.short}</span>.
          </div>
        ) : null}

        {currentStep.id === "identity" ? (
          <IdentityStep
            role={role}
            name={name}
            companyName={companyName}
            onContinue={() => persistAndAdvance({})}
            saving={saving}
          />
        ) : null}

        {currentStep.id === "interests" || currentStep.id === "hiring-interests" ? (
          <InterestsStep
            role={role}
            value={draft.categories}
            onChange={(categories) => setDraft((d) => ({ ...d, categories }))}
            onContinue={() => persistAndAdvance({ categories: draft.categories })}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "skills" ? (
          <SkillsStep
            value={draft.skills}
            onChange={(skills) => setDraft((d) => ({ ...d, skills }))}
            onContinue={() => persistAndAdvance({ skills: draft.skills })}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "about" ? (
          <AboutStep
            role={role}
            value={draft.about}
            onChange={(about) => setDraft((d) => ({ ...d, about }))}
            onContinue={() => persistAndAdvance({ about: draft.about })}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "location" ? (
          <LocationStep
            role={role}
            value={draft.location}
            onChange={(location) => setDraft((d) => ({ ...d, location }))}
            onContinue={() => persistAndAdvance({ location: draft.location })}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "industry" ? (
          <IndustryStep
            value={draft.industry}
            onChange={(industry) => setDraft((d) => ({ ...d, industry }))}
            onContinue={() => persistAndAdvance({ industry: draft.industry })}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "company-details" ? (
          <CompanyDetailsStep
            companySize={draft.companySize}
            website={draft.website}
            onChangeSize={(companySize) => setDraft((d) => ({ ...d, companySize }))}
            onChangeWebsite={(website) => setDraft((d) => ({ ...d, website }))}
            onContinue={() => persistAndAdvance({ companySize: draft.companySize, website: draft.website })}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "experience" ? (
          <ExperienceStep
            value={draft.experience}
            onChange={(experience) => setDraft((d) => ({ ...d, experience }))}
            onContinue={() => persistAndAdvance({ experience: draft.experience })}
            onSkip={() => persistAndAdvance({})}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "education" ? (
          <EducationStep
            value={draft.education}
            onChange={(education) => setDraft((d) => ({ ...d, education }))}
            onContinue={() => persistAndAdvance({ education: draft.education })}
            onSkip={() => persistAndAdvance({})}
            onBack={goBack}
            saving={saving}
            error={error}
          />
        ) : null}

        {currentStep.id === "preferences" || currentStep.id === "hiring-preferences" ? (
          <PreferencesStep
            role={role}
            onContinue={() => persistAndAdvance({})}
            onSkip={() => persistAndAdvance({})}
            onBack={goBack}
            saving={saving}
          />
        ) : null}

        {currentStep.id === "complete" ? <CompletionTransition steps={steps} onDone={finishOnboarding} /> : null}
      </div>
    </OnboardingShell>
  );
}

// --- Steps -------------------------------------------------------------

function IdentityStep({
  role,
  name,
  companyName,
  onContinue,
  saving,
}: {
  role: Role;
  name: string;
  companyName?: string;
  onContinue: () => void;
  saving: boolean;
}) {
  const firstName = name.split(" ")[0] || "there";
  return (
    <SpotlightField
      eyebrow="Account created"
      title={role === "employer" ? `Let's build ${companyName || "your company"}'s profile.` : `Hi ${firstName}. Let's build your Nia profile.`}
      description="A few quick stages — each one unlocks the next. You can always edit any of this later from your profile."
      cinematic
    >
      <StepActions onContinue={onContinue} showBack={false} loading={saving} continueLabel="Let's go" />
    </SpotlightField>
  );
}

function InterestsStep({
  role,
  value,
  onChange,
  onContinue,
  onBack,
  saving,
  error,
}: {
  role: Role;
  value: string[];
  onChange: (v: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  const [justPopped, setJustPopped] = useState<string | null>(null);
  const popTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function toggle(category: string) {
    const willSelect = !value.includes(category);
    onChange(willSelect ? [...value, category] : value.filter((c) => c !== category));
    if (willSelect) {
      setJustPopped(category);
      if (popTimeout.current) clearTimeout(popTimeout.current);
      popTimeout.current = setTimeout(() => setJustPopped(null), 550);
    }
  }

  return (
    <SpotlightField
      eyebrow={role === "employer" ? "Hiring interests" : "Interests"}
      title={role === "employer" ? "What are you hiring for?" : "What are you interested in?"}
      description="Pick everything relevant — this drives what Nia recommends."
      cinematic
    >
      <div className="flex flex-wrap gap-2.5" role="group" aria-label="Categories">
        {OPPORTUNITY_CATEGORIES.map((category, i) => {
          const selected = value.includes(category);
          const popped = justPopped === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(category)}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`bubble-in relative overflow-visible rounded-2xl border px-4 py-3 text-sm font-medium transition active:scale-95 ${
                popped ? "card-pop" : ""
              } ${selected ? "border-white bg-white text-black" : "border-white/15 bg-white/5 text-white hover:border-white/35"}`}
            >
              {popped ? <span className="ring-burst" aria-hidden="true" /> : null}
              {selected ? "✓ " : ""}
              {category}
            </button>
          );
        })}
      </div>
      <StepActions
        onBack={onBack}
        onContinue={onContinue}
        loading={saving}
        disabled={value.length === 0}
        error={error}
        requiredReason="At least one interest is required so Nia can match you with relevant opportunities."
      />
    </SpotlightField>
  );
}

function SkillsStep({
  value,
  onChange,
  onContinue,
  onBack,
  saving,
  error,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  function handleCustomSkillAdded(skill: string) {
    fetch("/api/skills/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill }),
    }).catch(() => {});
  }

  return (
    <SpotlightField eyebrow="Skills" title="What are you good at?" description="Search or browse by category. You need at least one to continue.">
      <div className="rounded-2xl bg-white p-4 text-black">
        <SkillsPicker value={value} onChange={onChange} onCustomSkillAdded={handleCustomSkillAdded} />
      </div>
      <StepActions
        onBack={onBack}
        onContinue={onContinue}
        loading={saving}
        disabled={value.length === 0}
        error={error}
        requiredReason="At least one skill is required so employers can find you."
      />
    </SpotlightField>
  );
}

function AboutStep({
  role,
  value,
  onChange,
  onContinue,
  onBack,
  saving,
  error,
}: {
  role: Role;
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  return (
    <SpotlightField
      eyebrow="About"
      title={role === "employer" ? "Tell candidates about your company." : "Tell us about yourself."}
      description={role === "employer" ? "This is what candidates see when you reach out." : "A couple of sentences is plenty — recruiters just want to know who they're talking to."}
      cinematic
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        maxLength={2000}
        placeholder={role === "employer" ? "We're a team of..." : "I'm a..."}
        className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
      />
      <StepActions
        onBack={onBack}
        onContinue={onContinue}
        loading={saving}
        disabled={value.trim().length === 0}
        error={error}
        requiredReason={role === "employer" ? "A short description is required — it's what candidates see when you reach out." : "A short bio is required so recruiters know who they're talking to."}
      />
    </SpotlightField>
  );
}

function LocationStep({
  role,
  value,
  onChange,
  onContinue,
  onBack,
  saving,
  error,
}: {
  role: Role;
  value: LocationValue;
  onChange: (v: LocationValue) => void;
  onContinue: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  const isComplete = Boolean(value.country && value.city.trim());
  return (
    <SpotlightField
      eyebrow="Location"
      title={role === "employer" ? "Where is your company based?" : "Where are you based?"}
      description="Required — country and city. You can update this later from your profile."
      cinematic
    >
      <div className="rounded-2xl bg-white p-4">
        <LocationPicker countries={WORLD_COUNTRIES} value={value} onChange={onChange} />
      </div>
      <StepActions
        onBack={onBack}
        onContinue={onContinue}
        loading={saving}
        disabled={!isComplete}
        error={error}
        requiredReason="Your location is required so Nia can match you with relevant opportunities nearby."
      />
    </SpotlightField>
  );
}

function IndustryStep({
  value,
  onChange,
  onContinue,
  onBack,
  saving,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onContinue: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  return (
    <SpotlightField eyebrow="Industry" title="What industry are you in?" description="A short answer is fine — e.g. Fintech, Healthcare, Logistics.">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g. Fintech"
        className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
      />
      <StepActions
        onBack={onBack}
        onContinue={onContinue}
        loading={saving}
        disabled={value.trim().length === 0}
        error={error}
        requiredReason="Industry helps Nia match you with relevant talent."
      />
    </SpotlightField>
  );
}

function CompanyDetailsStep({
  companySize,
  website,
  onChangeSize,
  onChangeWebsite,
  onContinue,
  onBack,
  saving,
  error,
}: {
  companySize: string;
  website: string;
  onChangeSize: (v: string) => void;
  onChangeWebsite: (v: string) => void;
  onContinue: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  const [popped, setPopped] = useState<string | null>(null);
  const popTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function selectSize(size: string) {
    onChangeSize(size);
    setPopped(size);
    if (popTimeout.current) clearTimeout(popTimeout.current);
    popTimeout.current = setTimeout(() => setPopped(null), 550);
  }

  return (
    <SpotlightField eyebrow="Company details" title="A few more details." description="Company size is required; website is optional." cinematic>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2.5" role="group" aria-label="Company size">
          {COMPANY_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={companySize === size}
              onClick={() => selectSize(size)}
              className={`relative overflow-visible rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${popped === size ? "card-pop" : ""} ${
                companySize === size ? "border-white bg-white text-black" : "border-white/15 bg-white/5 text-white hover:border-white/35"
              }`}
            >
              {popped === size ? <span className="ring-burst" aria-hidden="true" /> : null}
              {size}
            </button>
          ))}
        </div>
        <input
          value={website}
          onChange={(e) => onChangeWebsite(e.target.value)}
          placeholder="https://yourcompany.com (optional)"
          className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
        />
      </div>
      <StepActions
        onBack={onBack}
        onContinue={onContinue}
        loading={saving}
        disabled={!companySize}
        error={error}
        requiredReason="Company size helps candidates understand your team."
      />
    </SpotlightField>
  );
}

function ExperienceStep({
  value,
  onChange,
  onContinue,
  onSkip,
  onBack,
  saving,
  error,
}: {
  value: ExperienceEntry[];
  onChange: (v: ExperienceEntry[]) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  function addRow() {
    onChange([...value, { id: crypto.randomUUID(), title: "", organization: "", startYear: "", endYear: "", current: false }]);
  }
  function updateRow(id: string, patch: Partial<ExperienceEntry>) {
    onChange(value.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }
  function removeRow(id: string) {
    onChange(value.filter((row) => row.id !== id));
  }

  const inputClass = "w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40";

  return (
    <SpotlightField eyebrow="Experience" title="Any work experience?" description="Optional — you can add this later from your profile too.">
      <div className="space-y-4">
        {value.map((row) => (
          <div key={row.id} className="bubble-in space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4">
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
              <button type="button" onClick={() => removeRow(row.id)} className="rounded-xl border border-white/15 px-3 text-sm text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input type="checkbox" checked={row.current} onChange={(e) => updateRow(row.id, { current: e.target.checked, endYear: "" })} />
              I currently work here
            </label>
          </div>
        ))}
        <button type="button" onClick={addRow} className="w-full rounded-2xl border border-dashed border-white/20 py-3 text-sm text-zinc-300 transition hover:border-white/40 hover:text-white">
          + Add work experience
        </button>
      </div>
      <StepActions onBack={onBack} onContinue={onContinue} onSkip={value.length === 0 ? onSkip : undefined} loading={saving} error={error} />
    </SpotlightField>
  );
}

function EducationStep({
  value,
  onChange,
  onContinue,
  onSkip,
  onBack,
  saving,
  error,
}: {
  value: EducationEntry[];
  onChange: (v: EducationEntry[]) => void;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  saving: boolean;
  error: string;
}) {
  function addRow() {
    onChange([...value, { id: crypto.randomUUID(), school: "", fieldOfStudy: "", startYear: "", endYear: "" }]);
  }
  function updateRow(id: string, patch: Partial<EducationEntry>) {
    onChange(value.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }
  function removeRow(id: string) {
    onChange(value.filter((row) => row.id !== id));
  }

  const inputClass = "w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40";

  return (
    <SpotlightField eyebrow="Education" title="Your education" description="Optional — you can add this later from your profile too.">
      <div className="space-y-4">
        {value.map((row) => (
          <div key={row.id} className="bubble-in space-y-2.5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="grid gap-2.5 sm:grid-cols-2">
              <input value={row.school} onChange={(e) => updateRow(row.id, { school: e.target.value })} placeholder="School" className={inputClass} />
              <input value={row.fieldOfStudy} onChange={(e) => updateRow(row.id, { fieldOfStudy: e.target.value })} placeholder="Field of study" className={inputClass} />
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
              <input value={row.startYear} onChange={(e) => updateRow(row.id, { startYear: e.target.value })} placeholder="Start year" className={inputClass} />
              <input value={row.endYear} onChange={(e) => updateRow(row.id, { endYear: e.target.value })} placeholder="End year" className={inputClass} />
              <button type="button" onClick={() => removeRow(row.id)} className="rounded-xl border border-white/15 px-3 text-sm text-zinc-400 hover:text-white">
                ✕
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={addRow} className="w-full rounded-2xl border border-dashed border-white/20 py-3 text-sm text-zinc-300 transition hover:border-white/40 hover:text-white">
          + Add education
        </button>
      </div>
      <StepActions onBack={onBack} onContinue={onContinue} onSkip={value.length === 0 ? onSkip : undefined} loading={saving} error={error} />
    </SpotlightField>
  );
}

function PreferencesStep({
  role,
  onContinue,
  onSkip,
  onBack,
  saving,
}: {
  role: Role;
  onContinue: () => void;
  onSkip: () => void;
  onBack: () => void;
  saving: boolean;
}) {
  return (
    <SpotlightField
      eyebrow="Preferences"
      title={role === "employer" ? "Hiring preferences" : "A few preferences"}
      description="Optional — fine-tune this anytime from your profile. For now, you're basically done."
    >
      <p className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-6 text-center text-sm text-zinc-400">
        Fine-grained preferences are coming soon. Skip for now and set them later from your profile.
      </p>
      <StepActions onBack={onBack} onContinue={onContinue} onSkip={onSkip} loading={saving} continueLabel="Continue" />
    </SpotlightField>
  );
}
