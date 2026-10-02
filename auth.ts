import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { getMongoDatabase } from "./lib/mongodb";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        let database;
        try {
          database = await getMongoDatabase();
        } catch (error) {
          console.error("Login failed: couldn't reach MongoDB.", error);
          return null;
        }

        if (!database || !email || !password) return null;

        const user = await database.collection("users").findOne<{
          _id: { toString(): string };
          name: string;
          email: string;
          passwordHash: string;
          role?: "talent" | "employer";
          companyName?: string;
          categories?: string[];
          skills?: string[];
          location?: { country: string; region: string; city: string };
          about?: string;
          phone?: { dialCode: string; number: string };
          website?: string;
          industry?: string;
          companySize?: string;
          onboardingStep?: string;
          onboardingComplete?: boolean;
        }>({ email });
        if (!user || !(await compare(password, user.passwordHash))) return null;

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role ?? "talent",
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
          onboardingComplete: user.onboardingComplete ?? false,
        };
      },
    }),
  ],
});
