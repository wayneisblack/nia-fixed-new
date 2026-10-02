import { promises as fs } from "fs";
import path from "path";

import { getMongoDatabase } from "./mongodb";
import { opportunities, type Opportunity } from "../app/data/opportunities";
import type { OpportunityCategory } from "./categories";

export type ApplicationStatus = "Submitted" | "Responded" | "Cancelled";

export type ApplicationRecord = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  portfolioUrl?: string;
  motivation: string;
  createdAt: string;
  opportunityId?: string;
  opportunityTitle?: string;
  opportunityOrganization?: string;
  /** "Active" unless the applicant has cancelled it. Cancelled applications are kept, not deleted. */
  status: "Active" | "Cancelled";
  cancelledAt?: string;
};

/**
 * There's no recruiter-side status update flowing into applications yet, so
 * "Responded" is derived from how long ago the application was submitted —
 * a placeholder for a real response status once employer review actions are
 * wired to these records. "Cancelled" reflects the applicant's own action
 * and always wins.
 */
export function getApplicationStatus(application: ApplicationRecord): ApplicationStatus {
  if (application.status === "Cancelled") return "Cancelled";
  const daysSince = (Date.now() - new Date(application.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= 5 ? "Responded" : "Submitted";
}

const dataDir = path.join(process.cwd(), "data");
const applicationsFile = path.join(dataDir, "applications.json");
const bookmarksFile = path.join(dataDir, "bookmarks.json");

async function ensureFile(file: string, fallback: string) {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, fallback, "utf-8");
  }
}

function toIsoString(value: unknown): string | undefined {
  // Spring Boot stores timestamps as BSON Dates; the Next.js side used ISO strings.
  // Accept both so createdAt/cancelledAt never silently fall back to "now".
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : undefined;
}

function normalizeApplication(document: Record<string, unknown>): ApplicationRecord {
  return {
    id: String(document.id ?? (document._id as { toString?: () => string } | undefined)?.toString?.() ?? ""),
    userId: String(document.userId ?? "demo-user"),
    fullName: String(document.fullName ?? ""),
    email: String(document.email ?? ""),
    portfolioUrl: typeof document.portfolioUrl === "string" ? document.portfolioUrl : undefined,
    motivation: String(document.motivation ?? ""),
    createdAt: toIsoString(document.createdAt) ?? new Date().toISOString(),
    opportunityId: typeof document.opportunityId === "string" ? document.opportunityId : undefined,
    opportunityTitle: typeof document.opportunityTitle === "string" ? document.opportunityTitle : undefined,
    opportunityOrganization: typeof document.opportunityOrganization === "string" ? document.opportunityOrganization : undefined,
    status: document.status === "Cancelled" ? "Cancelled" : "Active",
    cancelledAt: toIsoString(document.cancelledAt),
  };
}

export async function readApplications(userId?: string): Promise<ApplicationRecord[]> {
  const database = await getMongoDatabase();

  if (database) {
    const documents = await database.collection("applications").find(userId ? { userId } : {}).sort({ createdAt: -1 }).toArray();
    return documents.map(normalizeApplication);
  }

  await ensureFile(applicationsFile, "[]");
  const file = await fs.readFile(applicationsFile, "utf-8");

  try {
    const parsed = JSON.parse(file);
    const records = (Array.isArray(parsed) ? parsed : []).map(normalizeApplication);
    return userId ? records.filter((record) => record.userId === userId) : records;
  } catch {
    return [];
  }
}

export async function writeApplications(applications: ApplicationRecord[]) {
  const database = await getMongoDatabase();

  if (database) {
    const collection = database.collection("applications");

    await collection.deleteMany({});

    if (applications.length > 0) {
      await collection.insertMany(applications.map((application) => ({
        ...application,
      })));
    }

    return;
  }

  await ensureFile(applicationsFile, "[]");
  await fs.writeFile(applicationsFile, JSON.stringify(applications, null, 2), "utf-8");
}

export async function createApplication(payload: Omit<ApplicationRecord, "id" | "createdAt" | "status" | "cancelledAt">) {
  const database = await getMongoDatabase();

  if (database) {
    const record: ApplicationRecord = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: "Active",
    };

    await database.collection("applications").insertOne(record);
    return record;
  }

  const applications = await readApplications();
  const record: ApplicationRecord = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "Active",
  };

  applications.unshift(record);
  await writeApplications(applications);
  return record;
}

/** The applicant's current non-cancelled application for this opportunity, if any — used to block duplicate applications. */
export async function findActiveApplication(userId: string, opportunityId: string): Promise<ApplicationRecord | undefined> {
  const applications = await readApplications(userId);
  return applications.find((a) => a.opportunityId === opportunityId && a.status === "Active");
}

/** Cancels an application without deleting it, so it stays visible under My Applications → Cancelled. */
export async function cancelApplication(userId: string, applicationId: string): Promise<ApplicationRecord | undefined> {
  const database = await getMongoDatabase();
  const cancelledAt = new Date().toISOString();

  if (database) {
    const result = await database.collection("applications").findOneAndUpdate(
      { id: applicationId, userId },
      { $set: { status: "Cancelled", cancelledAt } },
      { returnDocument: "after" }
    );
    return result ? normalizeApplication(result) : undefined;
  }

  const applications = await readApplications();
  const index = applications.findIndex((a) => a.id === applicationId && a.userId === userId);
  if (index === -1) return undefined;

  applications[index] = { ...applications[index], status: "Cancelled", cancelledAt };
  await writeApplications(applications);
  return applications[index];
}

export async function readOpportunities(): Promise<Opportunity[]> {
  const database = await getMongoDatabase();

  if (!database) return opportunities;

  const collection = database.collection<Opportunity>("opportunities");
  if ((await collection.countDocuments()) === 0) {
    await collection.insertMany(opportunities);
    return opportunities;
  }

  const documents = await collection.find({}).toArray();
  // Older seeded documents may predate the `category` field — fall back to a
  // reasonable default by listing type rather than leaving it undefined.
  return documents.map((document) => ({
    ...document,
    category: document.category ?? fallbackCategoryForType(document.type),
  }));
}

function fallbackCategoryForType(type: string): OpportunityCategory {
  if (type === "Fellowship") return "UI/UX";
  if (type === "Scholarship") return "Research & Innovation";
  return "Engineering";
}

export async function readOpportunity(id: string): Promise<Opportunity | undefined> {
  return (await readOpportunities()).find((opportunity) => opportunity.id === id);
}

// --- Bookmarks / Favourites -------------------------------------------------

export type Bookmark = {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
};

function normalizeBookmark(document: Record<string, unknown>): Bookmark {
  return {
    id: String(document.id ?? (document._id as { toString?: () => string } | undefined)?.toString?.() ?? ""),
    userId: String(document.userId ?? ""),
    opportunityId: String(document.opportunityId ?? ""),
    createdAt: toIsoString(document.createdAt) ?? new Date().toISOString(),
  };
}

export async function readBookmarks(userId: string): Promise<Bookmark[]> {
  const database = await getMongoDatabase();

  if (database) {
    const documents = await database.collection("bookmarks").find({ userId }).sort({ createdAt: -1 }).toArray();
    return documents.map(normalizeBookmark);
  }

  await ensureFile(bookmarksFile, "[]");
  const file = await fs.readFile(bookmarksFile, "utf-8");

  try {
    const parsed = JSON.parse(file);
    const records = (Array.isArray(parsed) ? parsed : []).map(normalizeBookmark);
    return records.filter((record) => record.userId === userId);
  } catch {
    return [];
  }
}

/** Adds the bookmark if it isn't already saved, otherwise removes it. Returns the new saved state. */
export async function toggleBookmark(userId: string, opportunityId: string): Promise<boolean> {
  const database = await getMongoDatabase();

  if (database) {
    const collection = database.collection("bookmarks");
    const existing = await collection.findOne({ userId, opportunityId });

    if (existing) {
      await collection.deleteOne({ userId, opportunityId });
      return false;
    }

    await collection.insertOne({ id: crypto.randomUUID(), userId, opportunityId, createdAt: new Date().toISOString() });
    return true;
  }

  await ensureFile(bookmarksFile, "[]");
  const file = await fs.readFile(bookmarksFile, "utf-8");
  const all: Bookmark[] = (() => {
    try {
      const parsed = JSON.parse(file);
      return (Array.isArray(parsed) ? parsed : []).map(normalizeBookmark);
    } catch {
      return [];
    }
  })();

  const existingIndex = all.findIndex((b) => b.userId === userId && b.opportunityId === opportunityId);
  let saved: boolean;

  if (existingIndex === -1) {
    all.push({ id: crypto.randomUUID(), userId, opportunityId, createdAt: new Date().toISOString() });
    saved = true;
  } else {
    all.splice(existingIndex, 1);
    saved = false;
  }

  await fs.writeFile(bookmarksFile, JSON.stringify(all, null, 2), "utf-8");
  return saved;
}

// --- Skill suggestions (user-entered skills not yet in the catalogue) ------

export type SkillSuggestion = {
  id: string;
  userId: string;
  skill: string;
  createdAt: string;
};

const skillSuggestionsFile = path.join(dataDir, "skill-suggestions.json");

function normalizeSkillSuggestion(document: Record<string, unknown>): SkillSuggestion {
  return {
    id: String(document.id ?? (document._id as { toString?: () => string } | undefined)?.toString?.() ?? ""),
    userId: String(document.userId ?? ""),
    skill: String(document.skill ?? ""),
    createdAt: typeof document.createdAt === "string" ? document.createdAt : new Date().toISOString(),
  };
}

/**
 * Records a skill a user typed that isn't in the catalogue yet, so frequently
 * requested or emerging skills can be reviewed and promoted into
 * lib/skills.ts later. This never adds the skill to the live catalogue —
 * it's a queue for a human (or a future admin tool) to look at.
 */
export async function suggestCustomSkill(userId: string, skill: string): Promise<void> {
  const trimmed = skill.trim();
  if (!trimmed) return;

  const database = await getMongoDatabase().catch(() => null);

  if (database) {
    await database.collection("skill_suggestions").insertOne({
      id: crypto.randomUUID(),
      userId,
      skill: trimmed,
      createdAt: new Date().toISOString(),
    });
    return;
  }

  await ensureFile(skillSuggestionsFile, "[]");
  const file = await fs.readFile(skillSuggestionsFile, "utf-8");
  const all: SkillSuggestion[] = (() => {
    try {
      const parsed = JSON.parse(file);
      return (Array.isArray(parsed) ? parsed : []).map(normalizeSkillSuggestion);
    } catch {
      return [];
    }
  })();

  all.push({ id: crypto.randomUUID(), userId, skill: trimmed, createdAt: new Date().toISOString() });
  await fs.writeFile(skillSuggestionsFile, JSON.stringify(all, null, 2), "utf-8");
}
