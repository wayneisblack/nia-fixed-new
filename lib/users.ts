import { ObjectId } from "mongodb";
import { getMongoDatabase } from "./mongodb";
import type { ProfileData } from "./onboarding";

export type ExperienceEntry = {
  id: string;
  title: string;
  organization: string;
  startYear: string;
  endYear: string;
  current: boolean;
};

export type EducationEntry = {
  id: string;
  school: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
};

export type UserDocument = ProfileData & {
  _id: ObjectId;
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  emailVerified?: boolean;
};

/** Full user document for the currently-authenticated session — used wherever
 * a server component needs fields the JWT session doesn't carry (experience,
 * education, emailVerified). Returns null if not found. */
export async function getUserById(userId: string): Promise<UserDocument | null> {
  const database = await getMongoDatabase().catch(() => null);
  if (!database) return null;

  let objectId: ObjectId;
  try {
    objectId = new ObjectId(userId);
  } catch {
    return null;
  }

  const user = await database.collection("users").findOne({ _id: objectId });
  if (!user) return null;

  return user as unknown as UserDocument;
}

/** Plain, serializable subset of a user document — safe to pass as a prop
 * from a Server Component into a Client Component. Server Components can
 * only pass plain objects across that boundary (no ObjectId, no class
 * instances), and this additionally makes sure passwordHash never travels
 * to the client even implicitly. */
export type ClientProfile = {
  id: string;
  name?: string;
  email?: string;
  role?: ProfileData["role"];
  companyName?: string;
  categories?: string[];
  skills?: string[];
  location?: ProfileData["location"];
  about?: string;
  phone?: ProfileData["phone"];
  website?: string;
  industry?: string;
  companySize?: string;
  onboardingStep?: string;
  onboardingComplete?: boolean;
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  emailVerified?: boolean;
};

export function toClientProfile(user: UserDocument): ClientProfile {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    companyName: user.companyName,
    categories: user.categories,
    skills: user.skills,
    location: user.location,
    about: user.about,
    phone: user.phone,
    website: user.website,
    industry: user.industry,
    companySize: user.companySize,
    onboardingStep: user.onboardingStep,
    onboardingComplete: user.onboardingComplete,
    experience: user.experience,
    education: user.education,
    emailVerified: user.emailVerified,
  };
}
