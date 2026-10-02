import "next-auth";

type Location = { country: string; region: string; city: string };
type Phone = { dialCode: string; number: string };

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
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
  }
  interface User {
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
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
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
  }
}
