import type { Candidate } from "./mock-candidates";

export type ParsedQuery = {
  skills: string[];
  location?: string;
  remote?: boolean;
  minYears?: number;
  maxYears?: number;
  raw: string;
};

const KNOWN_SKILLS = [
  "React", "Next.js", "TypeScript", "JavaScript", "Node.js", "Express",
  "MongoDB", "PostgreSQL", "AWS", "Docker", "System Design", "Redux",
  "Jest", "Tailwind CSS", "REST APIs", "Figma", "Design Systems",
  "User Research", "Prototyping", "SQL", "Python", "Tableau", "A/B Testing",
  "Financial Modeling", "Market Research", "Operations", "HTML", "CSS", "Git",
];

const KNOWN_LOCATIONS = ["Lagos", "Accra", "Johannesburg", "Nairobi", "Abuja"];

/** Parses a free-text recruiter query into structured filters. Not an LLM —
 * a transparent keyword/pattern parser that's easy to reason about and fast. */
export function parseQuery(query: string): ParsedQuery {
  const lower = query.toLowerCase();

  const skills = KNOWN_SKILLS.filter((skill) => lower.includes(skill.toLowerCase()));

  const location = KNOWN_LOCATIONS.find((loc) => lower.includes(loc.toLowerCase()));
  const remote = /\bremote\b/.test(lower);

  let minYears: number | undefined;
  let maxYears: number | undefined;

  const rangeMatch = lower.match(/(\d+)\s*[-–to]+\s*(\d+)\s*year/);
  const plusMatch = lower.match(/(\d+)\s*\+\s*year/);
  const singleMatch = lower.match(/(\d+)\s*year/);

  if (rangeMatch) {
    minYears = Number(rangeMatch[1]);
    maxYears = Number(rangeMatch[2]);
  } else if (plusMatch) {
    minYears = Number(plusMatch[1]);
  } else if (singleMatch) {
    minYears = Math.max(0, Number(singleMatch[1]) - 1);
    maxYears = Number(singleMatch[1]) + 1;
  } else if (/\bjunior\b|\bentry.level\b|\bintern\b/.test(lower)) {
    minYears = 0;
    maxYears = 2;
  } else if (/\bmid.level\b|\bmid\b/.test(lower)) {
    minYears = 2;
    maxYears = 4;
  } else if (/\bsenior\b/.test(lower)) {
    minYears = 4;
  }

  return { skills, location, remote, minYears, maxYears, raw: query };
}

export type MatchResult = {
  candidate: Candidate;
  score: number;
  reasons: { label: string; met: boolean }[];
};

export function scoreCandidate(candidate: Candidate, parsed: ParsedQuery): MatchResult {
  const reasons: { label: string; met: boolean }[] = [];
  let points = 0;
  let maxPoints = 0;

  // Skills: the heaviest weighted signal.
  if (parsed.skills.length > 0) {
    const candidateSkillsLower = candidate.skills.map((s) => s.toLowerCase());
    parsed.skills.forEach((skill) => {
      const met = candidateSkillsLower.includes(skill.toLowerCase());
      reasons.push({ label: skill, met });
      maxPoints += 20;
      if (met) points += 20;
    });
  }

  // Experience range.
  if (parsed.minYears !== undefined || parsed.maxYears !== undefined) {
    const min = parsed.minYears ?? 0;
    const max = parsed.maxYears ?? Infinity;
    const met = candidate.yearsExperience >= min && candidate.yearsExperience <= max;
    const label =
      parsed.maxYears !== undefined
        ? `${min}-${parsed.maxYears} years experience`
        : `${min}+ years experience`;
    reasons.push({ label, met });
    maxPoints += 20;
    if (met) points += 20;
  }

  // Location / remote.
  if (parsed.location) {
    const met = candidate.location.toLowerCase().includes(parsed.location.toLowerCase());
    reasons.push({ label: parsed.location, met: met || candidate.remoteOnly });
    maxPoints += 15;
    if (met || candidate.remoteOnly) points += 15;
  }
  if (parsed.remote) {
    const met = candidate.remoteOnly;
    reasons.push({ label: "Open to remote", met });
    maxPoints += 15;
    if (met) points += 15;
  }

  // Relevant projects always counts as a small bonus signal, shown for context.
  if (candidate.projects.length > 0) {
    reasons.push({ label: `${candidate.projects.length} relevant project${candidate.projects.length > 1 ? "s" : ""}`, met: true });
    maxPoints += 10;
    points += 10;
  }

  const score = maxPoints === 0 ? 60 : Math.round((points / maxPoints) * 100);

  return { candidate, score: Math.min(100, Math.max(0, score)), reasons };
}

export function rankCandidates(candidates: Candidate[], query: string): MatchResult[] {
  const parsed = parseQuery(query);
  return candidates
    .map((candidate) => scoreCandidate(candidate, parsed))
    .sort((a, b) => b.score - a.score);
}
