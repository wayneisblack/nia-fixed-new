import type { NextAuthConfig } from "next-auth";

// This config must stay free of Node-only dependencies (MongoDB driver, bcrypt).
// It's imported by middleware.ts, which runs on the Edge Runtime and cannot
// bundle those packages. The full provider (with database access) is added
// on top of this in auth.ts, which only runs in Node (API routes, server
// components) where those dependencies are fine.

type Location = { country: string; region: string; city: string };
type Phone = { dialCode: string; number: string };

// Profile fields that flow user -> jwt -> session, and can be pushed back
// into the token via next-auth/react's update(). Centralized here so adding
// a new profile field only means touching this list once.
const PROFILE_FIELDS = [
  "role",
  "companyName",
  "categories",
  "skills",
  "location",
  "about",
  "phone",
  "website",
  "industry",
  "companySize",
  "onboardingStep",
  "onboardingComplete",
] as const;

type ProfileFieldMap = {
  role?: "talent" | "employer";
  companyName?: string;
  categories?: string[];
  skills?: string[];
  location?: Location;
  about?: string;
  phone?: Phone;
  website?: string;
  industry?: string;
  companySize?: string;
  onboardingStep?: string;
  onboardingComplete?: boolean;
};

export const authConfig = {
  providers: [],
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ auth }) => Boolean(auth?.user),
    jwt: ({ token, user, trigger, session }) => {
      if (user) {
        token.userId = user.id;
        const source = user as unknown as ProfileFieldMap;
        for (const field of PROFILE_FIELDS) {
          (token as Record<string, unknown>)[field] = source[field];
        }
      }
      // Lets the client refresh profile fields after editing them, via next-auth/react's update().
      if (trigger === "update" && session) {
        const sessionUpdate = session as ProfileFieldMap;
        for (const field of PROFILE_FIELDS) {
          if (sessionUpdate[field] !== undefined) {
            (token as Record<string, unknown>)[field] = sessionUpdate[field];
          }
        }
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user && token.userId) (session.user as { id?: string }).id = token.userId as string;
      for (const field of PROFILE_FIELDS) {
        const tokenValue = (token as Record<string, unknown>)[field];
        if (tokenValue !== undefined) {
          (session.user as unknown as Record<string, unknown>)[field] = tokenValue;
        }
      }
      // Arrays default to [] rather than undefined so consumers never need an extra `?? []`.
      if (session.user && !Array.isArray((session.user as unknown as Record<string, unknown>).categories)) {
        (session.user as { categories?: string[] }).categories = [];
      }
      if (session.user && !Array.isArray((session.user as unknown as Record<string, unknown>).skills)) {
        (session.user as { skills?: string[] }).skills = [];
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
