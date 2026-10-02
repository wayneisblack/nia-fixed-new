import type { Opportunity } from "../app/data/opportunities";

/**
 * Opportunities relevant to a talent's stated interests. Without any
 * interests set yet, everything is treated as potentially relevant — a
 * graceful default rather than showing nothing until the user configures a
 * profile.
 */
export function getRecommendedOpportunities(opportunities: Opportunity[], categories: string[]): Opportunity[] {
  if (categories.length === 0) return opportunities;
  return opportunities.filter((o) => categories.includes(o.category));
}
