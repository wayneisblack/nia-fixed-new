import type { LocationValue } from "../components/location-picker";

/**
 * Centralized onboarding + profile-completion logic. Nothing in this file
 * touches React — the onboarding UI, the profile page, and the dashboard
 * gate all read from the same step/requirement definitions so they can
 * never drift out of sync with each other.
 */

export type Role = "talent" | "employer";

export type PhoneValue = { dialCode: string; number: string };

/** The subset of the user document relevant to onboarding/profile completion. */
export type ProfileData = {
  name?: string;
  email?: string;
  role?: Role;
  companyName?: string;
  about?: string;
  categories?: string[]; // candidate interests / company hiring interests
  skills?: string[];
  location?: LocationValue;
  phone?: PhoneValue;
  website?: string;
  industry?: string;
  companySize?: string;
  experience?: unknown[];
  education?: unknown[];
  preferences?: Record<string, unknown>;
  onboardingStep?: string;
  onboardingComplete?: boolean;
};

export type StepId =
  | "identity"
  | "interests"
  | "skills"
  | "about"
  | "location"
  | "experience"
  | "education"
  | "preferences"
  | "hiring-interests"
  | "industry"
  | "company-details"
  | "hiring-preferences"
  | "complete";

export type OnboardingStep = {
  id: StepId;
  title: string;
  /** Short label shown on the roadmap. */
  short: string;
  /** Whether this stage must be completed before the dashboard unlocks. */
  mandatory: boolean;
  /** Why it's required — shown instead of a skip button when mandatory. */
  requiredReason?: string;
};

export const CANDIDATE_STEPS: OnboardingStep[] = [
  { id: "identity", title: "Let's start with you", short: "Identity", mandatory: true },
  { id: "interests", title: "What are you interested in?", short: "Interests", mandatory: true, requiredReason: "At least one interest helps Nia recommend the right opportunities." },
  { id: "skills", title: "What are you good at?", short: "Skills", mandatory: true, requiredReason: "At least one skill helps employers find you." },
  { id: "about", title: "Tell us about yourself", short: "About", mandatory: true, requiredReason: "A short bio helps recruiters know who they're talking to." },
  { id: "location", title: "Where are you based?", short: "Location", mandatory: true, requiredReason: "Your location is required so Nia can match you with relevant opportunities." },
  { id: "experience", title: "Any work experience?", short: "Experience", mandatory: false },
  { id: "education", title: "Your education", short: "Education", mandatory: false },
  { id: "preferences", title: "A few preferences", short: "Preferences", mandatory: false },
  { id: "complete", title: "You're ready.", short: "Complete", mandatory: true },
];

export const COMPANY_STEPS: OnboardingStep[] = [
  { id: "identity", title: "Let's build your company", short: "Identity", mandatory: true },
  { id: "hiring-interests", title: "What are you hiring for?", short: "Hiring interests", mandatory: true, requiredReason: "At least one hiring interest helps Nia surface the right candidates." },
  { id: "about", title: "Tell candidates about your company", short: "About", mandatory: true, requiredReason: "A short description is what candidates see when you reach out." },
  { id: "industry", title: "What industry are you in?", short: "Industry", mandatory: true, requiredReason: "Industry helps Nia match you with relevant talent." },
  { id: "location", title: "Where is your company based?", short: "Location", mandatory: true, requiredReason: "Your location is required so Nia can match you with nearby talent." },
  { id: "company-details", title: "A few more details", short: "Company details", mandatory: true, requiredReason: "Company size helps candidates understand your team." },
  { id: "hiring-preferences", title: "Hiring preferences", short: "Preferences", mandatory: false },
  { id: "complete", title: "You're ready.", short: "Complete", mandatory: true },
];

export function stepsForRole(role: Role | undefined): OnboardingStep[] {
  return role === "employer" ? COMPANY_STEPS : CANDIDATE_STEPS;
}

export function firstStepId(role: Role | undefined): StepId {
  return stepsForRole(role)[0].id;
}

export function stepIndex(role: Role | undefined, stepId: string | undefined): number {
  const steps = stepsForRole(role);
  const index = steps.findIndex((s) => s.id === stepId);
  return index === -1 ? 0 : index;
}

export function nextStepId(role: Role | undefined, stepId: StepId): StepId {
  const steps = stepsForRole(role);
  const index = steps.findIndex((s) => s.id === stepId);
  return steps[Math.min(index + 1, steps.length - 1)].id;
}

export function previousStepId(role: Role | undefined, stepId: StepId): StepId {
  const steps = stepsForRole(role);
  const index = steps.findIndex((s) => s.id === stepId);
  return steps[Math.max(index - 1, 0)].id;
}

// --- Completion -------------------------------------------------------------

export type MissingItem = {
  label: string;
  /** Where clicking this item should take the user. */
  href: string;
  weight: number;
};

export type CompletionResult = {
  percent: number;
  mandatoryMet: boolean;
  missing: MissingItem[];
};

function hasLocation(location: LocationValue | undefined) {
  return Boolean(location?.country && location?.city?.trim());
}

/**
 * Every field below carries a weight; percentages are computed from the
 * weights actually satisfied vs. the total — never faked or rounded up.
 */
export function computeCompletion(profile: ProfileData): CompletionResult {
  const isCompany = profile.role === "employer";

  const fields: { label: string; met: boolean; weight: number; mandatory: boolean; href: string }[] = isCompany
    ? [
        { label: "Company name", met: Boolean(profile.companyName?.trim()), weight: 10, mandatory: true, href: "/profile" },
        { label: "About your company", met: Boolean(profile.about?.trim()), weight: 15, mandatory: true, href: "/profile#about" },
        { label: "Industry", met: Boolean(profile.industry?.trim()), weight: 10, mandatory: true, href: "/profile#industry" },
        { label: "At least one hiring interest", met: Boolean(profile.categories?.length), weight: 15, mandatory: true, href: "/profile#interests" },
        { label: "Company size", met: Boolean(profile.companySize?.trim()), weight: 10, mandatory: true, href: "/profile#details" },
        { label: "Location", met: hasLocation(profile.location), weight: 15, mandatory: true, href: "/profile#location" },
        { label: "Website", met: Boolean(profile.website?.trim()), weight: 5, mandatory: false, href: "/profile#details" },
        { label: "Phone number", met: Boolean(profile.phone?.number?.trim()), weight: 5, mandatory: false, href: "/account" },
      ]
    : [
        { label: "Name", met: Boolean(profile.name?.trim()), weight: 10, mandatory: true, href: "/profile" },
        { label: "About you", met: Boolean(profile.about?.trim()), weight: 15, mandatory: true, href: "/profile#about" },
        { label: "At least one interest", met: Boolean(profile.categories?.length), weight: 15, mandatory: true, href: "/profile#interests" },
        { label: "At least one skill", met: Boolean(profile.skills?.length), weight: 15, mandatory: true, href: "/profile#skills" },
        { label: "Location", met: hasLocation(profile.location), weight: 15, mandatory: true, href: "/profile#location" },
        { label: "Work experience", met: Boolean(profile.experience?.length), weight: 5, mandatory: false, href: "/profile#experience" },
        { label: "Education", met: Boolean(profile.education?.length), weight: 5, mandatory: false, href: "/profile#education" },
        { label: "Profile picture", met: false, weight: 5, mandatory: false, href: "/profile" },
        { label: "Phone number", met: Boolean(profile.phone?.number?.trim()), weight: 5, mandatory: false, href: "/account" },
      ];

  const totalWeight = fields.reduce((sum, f) => sum + f.weight, 0);
  const metWeight = fields.reduce((sum, f) => sum + (f.met ? f.weight : 0), 0);
  const mandatoryMet = fields.filter((f) => f.mandatory).every((f) => f.met);

  return {
    percent: totalWeight === 0 ? 0 : Math.round((metWeight / totalWeight) * 100),
    mandatoryMet,
    missing: fields.filter((f) => !f.met).map((f) => ({ label: f.label, href: f.href, weight: f.weight })),
  };
}
