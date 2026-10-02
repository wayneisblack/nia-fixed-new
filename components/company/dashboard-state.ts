"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../lib/api";
import { candidates as seedCandidates, type Candidate } from "../../lib/mock-candidates";
import { jobs as seedJobs, type Job, type HiringStage } from "../../lib/mock-jobs";
import { rankCandidates, type MatchResult } from "../../lib/match";

type SectionKey =
  | "overview"
  | "find-talent"
  | "jobs"
  | "candidates"
  | "shortlist"
  | "interviews"
  | "messages"
  | "analytics"
  | "company-profile"
  | "settings";

const NAV_ITEMS: { key: SectionKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "find-talent", label: "Find Talent" },
  { key: "jobs", label: "Jobs" },
  { key: "candidates", label: "Candidates" },
  { key: "shortlist", label: "Shortlist" },
  { key: "interviews", label: "Interviews" },
  { key: "messages", label: "Messages" },
  { key: "analytics", label: "Analytics" },
];

const BOTTOM_NAV_ITEMS: { key: SectionKey; label: string }[] = [
  { key: "company-profile", label: "Company Profile" },
  { key: "settings", label: "Settings" },
];

export type ShortlistEntry = {
  candidateId: string;
  stage: HiringStage;
  addedAt: string;
};

export type Message = {
  id: string;
  candidateId: string;
  from: "recruiter" | "candidate";
  text: string;
  at: string;
};

export type Interview = {
  id: string;
  candidateId: string;
  jobId?: string;
  date: string;
  time: string;
  notes: string;
  feedback?: string;
  status: "Scheduled" | "Completed" | "Cancelled";
};

export type CompanyProfile = {
  name: string;
  industry: string;
  size: string;
  website: string;
  about: string;
};

export type DashboardState = {
  candidates: Candidate[];
  jobs: Job[];
  shortlist: ShortlistEntry[];
  compareIds: string[];
  messages: Message[];
  /** Candidate ids currently "typing" a reply — drives the typing indicator in Messages. */
  typingCandidateIds: string[];
  interviews: Interview[];
  notes: Record<string, string>;
  companyProfile: CompanyProfile;
};

function seedMessages(): Message[] {
  const now = Date.now();
  return [
    {
      id: "m1",
      candidateId: "amara-okafor",
      from: "recruiter",
      text: "Hi Amara — loved your onboarding-flow case study. Do you have 20 minutes this week for a quick chat?",
      at: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
    },
    {
      id: "m2",
      candidateId: "amara-okafor",
      from: "candidate",
      text: "Hi! Thank you — yes, I'm free Thursday afternoon, West Africa Time.",
      at: new Date(now - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: "m3",
      candidateId: "tendai-moyo",
      from: "recruiter",
      text: "Hi Tendai, your admin-dashboard project stood out. Are you currently interviewing elsewhere?",
      at: new Date(now - 1000 * 60 * 60 * 5).toISOString(),
    },
  ];
}

// Canned candidate replies used to simulate the other side of a conversation
// arriving on its own — there's no real candidate on the other end yet, so
// this is what makes messages feel two-way instead of a one-sided log.
const CANDIDATE_REPLIES = [
  "Thanks for reaching out — could you tell me a bit more about the role first?",
  "That sounds interesting! I'm free most afternoons this week if you'd like to talk.",
  "Appreciate you following up. Let me check my schedule and get back to you shortly.",
  "Yes, I'm definitely still open to new opportunities right now.",
  "Sure, happy to share more about my recent work whenever suits you.",
];

function pickReply(seed: number) {
  return CANDIDATE_REPLIES[seed % CANDIDATE_REPLIES.length];
}

function seedInterviews(): Interview[] {
  return [
    {
      id: "i1",
      candidateId: "amara-okafor",
      jobId: "frontend-developer-intern",
      date: "2026-09-11",
      time: "14:00",
      notes: "First-round chat — portfolio walkthrough and React fundamentals.",
      status: "Scheduled",
    },
    {
      id: "i2",
      candidateId: "fatima-abdullahi",
      jobId: "backend-engineer",
      date: "2026-09-09",
      time: "10:30",
      notes: "System design round with the platform lead.",
      status: "Scheduled",
    },
  ];
}

export function useDashboardState(
  companyName: string,
  initialCompanyProfile?: Partial<CompanyProfile>
): [DashboardState, {
  setJobs: (jobs: Job[]) => void;
  addJob: (job: Job) => void;
  setShortlistStage: (candidateId: string, stage: HiringStage) => void;
  addToShortlist: (candidateId: string) => void;
  removeFromShortlist: (candidateId: string) => void;
  toggleCompare: (candidateId: string) => void;
  sendMessage: (candidateId: string, text: string) => void;
  scheduleInterview: (interview: Omit<Interview, "id" | "status">) => void;
  setInterviewFeedback: (id: string, feedback: string) => void;
  setNote: (candidateId: string, note: string) => void;
  setCompanyProfile: (profile: CompanyProfile) => void;
}] {
  const [jobs, setJobsState] = useState<Job[]>(seedJobs);
  const [shortlist, setShortlist] = useState<ShortlistEntry[]>([
    { candidateId: "tendai-moyo", stage: "Interview", addedAt: new Date().toISOString() },
    { candidateId: "amara-okafor", stage: "Screening", addedAt: new Date().toISOString() },
    { candidateId: "fatima-abdullahi", stage: "Interview", addedAt: new Date().toISOString() },
  ]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>(seedMessages());
  const [typingCandidateIds, setTypingCandidateIds] = useState<string[]>([]);
  const replyTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(
    () => () => {
      replyTimeouts.current.forEach(clearTimeout);
    },
    []
  );
  const [interviews, setInterviews] = useState<Interview[]>(seedInterviews());
  const [notes, setNotes] = useState<Record<string, string>>({
    "tendai-moyo": "Strong testing discipline. Wants to hear back by end of month.",
  });
  const [companyProfile, setCompanyProfileState] = useState<CompanyProfile>({
    name: companyName || "Your company",
    industry: initialCompanyProfile?.industry || "",
    size: initialCompanyProfile?.size || "",
    website: initialCompanyProfile?.website || "",
    about: initialCompanyProfile?.about || "",
  });

  const actions = {
    setJobs: setJobsState,
    addJob: (job: Job) => setJobsState((prev) => [job, ...prev]),
    setShortlistStage: (candidateId: string, stage: HiringStage) =>
      setShortlist((prev) => prev.map((entry) => (entry.candidateId === candidateId ? { ...entry, stage } : entry))),
    addToShortlist: (candidateId: string) =>
      setShortlist((prev) =>
        prev.some((entry) => entry.candidateId === candidateId)
          ? prev
          : [...prev, { candidateId, stage: "Applied" as HiringStage, addedAt: new Date().toISOString() }]
      ),
    removeFromShortlist: (candidateId: string) =>
      setShortlist((prev) => prev.filter((entry) => entry.candidateId !== candidateId)),
    toggleCompare: (candidateId: string) =>
      setCompareIds((prev) =>
        prev.includes(candidateId) ? prev.filter((id) => id !== candidateId) : prev.length >= 3 ? prev : [...prev, candidateId]
      ),
    sendMessage: (candidateId: string, text: string) => {
      setMessages((prev) => [...prev, { id: `m${prev.length + 1}-${Date.now()}`, candidateId, from: "recruiter", text, at: new Date().toISOString() }]);

      // Simulate the other side: a short "typing" pause, then a reply lands
      // on its own — no refresh needed. This stands in for a real-time
      // transport (WebSocket/SSE/polling) until there's an actual candidate
      // on the other end to message with.
      const typingDelay = 900 + Math.random() * 700;
      const replyDelay = typingDelay + 1400 + Math.random() * 1200;

      replyTimeouts.current.push(
        setTimeout(() => {
          setTypingCandidateIds((prev) => (prev.includes(candidateId) ? prev : [...prev, candidateId]));
        }, typingDelay)
      );

      replyTimeouts.current.push(
        setTimeout(() => {
          setTypingCandidateIds((prev) => prev.filter((id) => id !== candidateId));
          setMessages((prev) => [
            ...prev,
            {
              id: `m${prev.length + 1}-${Date.now()}`,
              candidateId,
              from: "candidate",
              text: pickReply(prev.length),
              at: new Date().toISOString(),
            },
          ]);
        }, replyDelay)
      );
    },
    scheduleInterview: (interview: Omit<Interview, "id" | "status">) =>
      setInterviews((prev) => [...prev, { ...interview, id: `i${prev.length + 1}-${Date.now()}`, status: "Scheduled" }]),
    setInterviewFeedback: (id: string, feedback: string) =>
      setInterviews((prev) => prev.map((iv) => (iv.id === id ? { ...iv, feedback, status: "Completed" } : iv))),
    setNote: (candidateId: string, note: string) => setNotes((prev) => ({ ...prev, [candidateId]: note })),
    setCompanyProfile: (profile: CompanyProfile) => {
      setCompanyProfileState(profile);
      // Persists to the real user document — this is the same data the
      // dedicated /profile page and onboarding read and write, so an edit
      // here shows up there too (and vice versa).
      apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry: profile.industry, companySize: profile.size, website: profile.website, about: profile.about }),
      }).catch(() => {});
    },
  };

  return [
    { candidates: seedCandidates, jobs, shortlist, compareIds, messages, typingCandidateIds, interviews, notes, companyProfile },
    actions,
  ];
}

export { NAV_ITEMS, BOTTOM_NAV_ITEMS };
export type { SectionKey, Candidate, Job, HiringStage, MatchResult };
export { rankCandidates };
