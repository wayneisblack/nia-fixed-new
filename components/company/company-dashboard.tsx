"use client";

import { useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { clearApiToken } from "../../lib/api";
import { useDashboardState, NAV_ITEMS, BOTTOM_NAV_ITEMS, type SectionKey } from "./dashboard-state";
import { CandidateModal } from "./candidate-modal";
import { ToastProvider, useToast } from "../animated/toast";
import { SectionErrorBoundary } from "../ui/error-boundary";
import { OnboardingBanner } from "./onboarding-banner";
import type { MatchResult } from "../../lib/match";
import type { Job } from "../../lib/mock-jobs";
import type { ClientProfile } from "../../lib/users";

import { OverviewSection } from "./sections/overview";
import { FindTalentSection } from "./sections/find-talent";
import { JobsSection } from "./sections/jobs";
import { CandidatesSection } from "./sections/candidates";
import { ShortlistSection } from "./sections/shortlist";
import { InterviewsSection } from "./sections/interviews";
import { MessagesSection } from "./sections/messages";
import { AnalyticsSection } from "./sections/analytics";
import { CompanyProfileSection, SettingsSection } from "./sections/company-profile";

export function CompanyDashboard(props: { name?: string | null; email?: string | null; companyName?: string | null; profile?: ClientProfile }) {
  return (
    <ToastProvider>
      <CompanyDashboardInner {...props} />
    </ToastProvider>
  );
}

function CompanyDashboardInner({
  name,
  email,
  companyName,
  profile,
}: {
  name?: string | null;
  email?: string | null;
  companyName?: string | null;
  profile?: ClientProfile;
}) {
  const [state, actions] = useDashboardState(companyName ?? "", {
    industry: profile?.industry,
    size: profile?.companySize,
    website: profile?.website,
    about: profile?.about,
  });
  const [section, setSection] = useState<SectionKey>("overview");
  const [openCandidate, setOpenCandidate] = useState<{ id: string; match?: MatchResult } | null>(null);
  const [findTalentSeed, setFindTalentSeed] = useState<string | undefined>(undefined);
  const [messagesTarget, setMessagesTarget] = useState<string | undefined>(undefined);
  const [jobsAutoCreate, setJobsAutoCreate] = useState(false);
  const { showToast } = useToast();

  // Onboarding: a first-time employer sees a "set up your first job" prompt
  // instead of landing straight in the sample dashboard. This is tracked
  // per-account in localStorage for now, since jobs here are still mock data —
  // once job creation is persisted, this same banner can key off `jobs.length === 0`
  // instead.
  const onboardingKey = `nia-onboarded:${email ?? companyName ?? "employer"}`;
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(onboardingKey) !== "true";
  });

  function markOnboarded() {
    if (typeof window !== "undefined") window.localStorage.setItem(onboardingKey, "true");
    setShowOnboarding(false);
  }

  const shortlistIds = state.shortlist.map((s) => s.candidateId);

  function openProfile(candidateId: string, match?: MatchResult) {
    setOpenCandidate({ id: candidateId, match });
  }

  function handleFindCandidatesFor(job: Job) {
    setFindTalentSeed(`${job.title} with skills in ${job.skillsWanted.join(", ")}`);
    setSection("find-talent");
  }

  function handleContact(candidateId: string) {
    setMessagesTarget(candidateId);
    setSection("messages");
    setOpenCandidate(null);
  }

  function handleShortlist(candidateId: string) {
    actions.addToShortlist(candidateId);
    const candidate = state.candidates.find((c) => c.id === candidateId);
    showToast(`${candidate?.name ?? "Candidate"} added to shortlist`, "success");
  }

  function handleAddJob(job: Job) {
    actions.addJob(job);
    showToast(`${job.title} published`, "success");
    markOnboarded();
  }

  function handleSetUpFirstJob() {
    setSection("jobs");
    setJobsAutoCreate(true);
  }

  function handleSchedule(interview: Parameters<typeof actions.scheduleInterview>[0]) {
    actions.scheduleInterview(interview);
    const candidate = state.candidates.find((c) => c.id === interview.candidateId);
    showToast(`Interview scheduled with ${candidate?.name ?? "candidate"}`, "success");
  }

  const modalCandidate = openCandidate ? state.candidates.find((c) => c.id === openCandidate.id) : undefined;

  return (
    <div className="flex min-h-screen bg-[#fafaf9] text-black">
      <a href="#dashboard-main" className="skip-link">Skip to main content</a>

      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-black/10 bg-white lg:flex">
        <Link href="/" className="px-6 py-6 text-2xl font-black tracking-tight">nia.</Link>
        <nav className="flex-1 space-y-1 px-3" aria-label="Dashboard sections" onKeyDown={handleNavKeyDown}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              aria-current={section === item.key ? "page" : undefined}
              className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                section === item.key ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-black/10 px-3 py-4" onKeyDown={handleNavKeyDown}>
          {BOTTOM_NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              aria-current={section === item.key ? "page" : undefined}
              className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
                section === item.key ? "bg-black text-white" : "text-zinc-600 hover:bg-zinc-100"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => { clearApiToken(); signOut({ callbackUrl: "/" }); }}
            className="mt-2 block w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-black active:scale-[0.98]"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <MobileNav section={section} onSelect={setSection} />

      {/* Main content */}
      <main id="dashboard-main" className="flex-1 overflow-y-auto px-5 pb-8 pt-24 sm:px-8 lg:px-10 lg:pt-8">
        <div className="mb-6 hidden items-center justify-between lg:flex">
          <p className="flex items-center gap-2 text-sm text-zinc-500">
            <span className="ai-dot" />
            Welcome back, {name?.split(" ")[0] ?? "there"}{companyName ? ` · ${companyName}` : ""}
          </p>
        </div>

        {showOnboarding && section === "overview" ? (
          <OnboardingBanner companyName={companyName} onSetUpJob={handleSetUpFirstJob} onSkip={markOnboarded} />
        ) : null}

        <div key={section} className="section-in">
          <SectionErrorBoundary label={[...NAV_ITEMS, ...BOTTOM_NAV_ITEMS].find((i) => i.key === section)?.label}>
          {section === "overview" && <OverviewSection state={state} onNavigate={setSection} />}

          {section === "find-talent" && (
            <FindTalentSection
              candidates={state.candidates}
              shortlistIds={shortlistIds}
              compareIds={state.compareIds}
              initialQuery={findTalentSeed}
              onOpenCandidate={openProfile}
              onShortlist={handleShortlist}
              onToggleCompare={actions.toggleCompare}
            />
          )}

          {section === "jobs" && (
            <JobsSection
              jobs={state.jobs}
              onAddJob={handleAddJob}
              onFindCandidatesFor={handleFindCandidatesFor}
              autoOpenCreate={jobsAutoCreate}
              onAutoOpenHandled={() => setJobsAutoCreate(false)}
            />
          )}

          {section === "candidates" && (
            <CandidatesSection candidates={state.candidates} shortlistIds={shortlistIds} onOpenCandidate={(id) => openProfile(id)} />
          )}

          {section === "shortlist" && (
            <ShortlistSection
              shortlist={state.shortlist}
              candidates={state.candidates}
              compareIds={state.compareIds}
              onStageChange={actions.setShortlistStage}
              onRemove={actions.removeFromShortlist}
              onOpenCandidate={(id) => openProfile(id)}
              onToggleCompare={actions.toggleCompare}
            />
          )}

          {section === "interviews" && (
            <InterviewsSection
              interviews={state.interviews}
              candidates={state.candidates}
              jobs={state.jobs}
              onSchedule={handleSchedule}
              onSetFeedback={actions.setInterviewFeedback}
            />
          )}

          {section === "messages" && (
            <MessagesSection
              messages={state.messages}
              candidates={state.candidates}
              initialCandidateId={messagesTarget}
              typingCandidateIds={state.typingCandidateIds}
              onSend={actions.sendMessage}
            />
          )}

          {section === "analytics" && (
            <AnalyticsSection jobs={state.jobs} candidates={state.candidates} shortlist={state.shortlist} />
          )}

          {section === "company-profile" && (
            <CompanyProfileSection profile={state.companyProfile} onSave={actions.setCompanyProfile} />
          )}

          {section === "settings" && <SettingsSection email={email} />}
          </SectionErrorBoundary>
        </div>
      </main>

      {modalCandidate ? (
        <CandidateModal
          candidate={modalCandidate}
          match={openCandidate?.match}
          note={state.notes[modalCandidate.id]}
          isShortlisted={shortlistIds.includes(modalCandidate.id)}
          onClose={() => setOpenCandidate(null)}
          onShortlist={() => handleShortlist(modalCandidate.id)}
          onRemoveShortlist={() => actions.removeFromShortlist(modalCandidate.id)}
          onSaveNote={(note) => actions.setNote(modalCandidate.id, note)}
          onContact={() => handleContact(modalCandidate.id)}
        />
      ) : null}
    </div>
  );
}

/** Arrow-key roving navigation within a nav button group (Up/Down/Home/End), per the APG pattern. */
function handleNavKeyDown(event: KeyboardEvent<HTMLElement>) {
  const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button"));
  const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
  if (currentIndex === -1) return;

  let nextIndex: number | null = null;
  if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % buttons.length;
  else if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
  else if (event.key === "Home") nextIndex = 0;
  else if (event.key === "End") nextIndex = buttons.length - 1;
  else return;

  event.preventDefault();
  buttons[nextIndex]?.focus();
}

function MobileNav({ section, onSelect }: { section: SectionKey; onSelect: (key: SectionKey) => void }) {
  const [open, setOpen] = useState(false);
  const allItems = [...NAV_ITEMS, ...BOTTOM_NAV_ITEMS];

  return (
    <div className="fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur-md lg:hidden">
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-xl font-black tracking-tight">nia.</span>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="true"
          aria-label={`${allItems.find((i) => i.key === section)?.label ?? "Menu"}, section menu`}
          className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium transition active:scale-95"
        >
          {allItems.find((i) => i.key === section)?.label ?? "Menu"} ▾
        </button>
      </div>
      {open ? (
        <div className="grid grid-cols-2 gap-2 border-t border-black/10 p-4" onKeyDown={handleNavKeyDown}>
          {allItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onSelect(item.key);
                setOpen(false);
              }}
              aria-current={section === item.key ? "page" : undefined}
              className={`rounded-xl px-3 py-2 text-left text-sm transition active:scale-95 ${section === item.key ? "bg-black text-white" : "bg-zinc-100 text-zinc-700"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
