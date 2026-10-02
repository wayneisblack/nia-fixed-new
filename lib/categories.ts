export const OPPORTUNITY_CATEGORIES = [
  "Engineering",
  "UI/UX",
  "Data & Business",
  "Research & Innovation",
] as const;

export type OpportunityCategory = (typeof OPPORTUNITY_CATEGORIES)[number];

export function isOpportunityCategory(value: unknown): value is OpportunityCategory {
  return typeof value === "string" && (OPPORTUNITY_CATEGORIES as readonly string[]).includes(value);
}
