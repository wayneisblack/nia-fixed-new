export type Candidate = {
  id: string;
  name: string;
  title: string;
  location: string;
  remoteOnly: boolean;
  yearsExperience: number;
  skills: string[];
  education: string;
  availability: "Immediately" | "2 weeks notice" | "1 month notice";
  projects: { name: string; description: string }[];
  portfolioUrl?: string;
  resumeSummary: string;
  appliedTo?: string[]; // job ids
};

export const candidates: Candidate[] = [
  {
    id: "amara-okafor",
    name: "Amara Okafor",
    title: "Frontend Engineer",
    location: "Lagos, Nigeria",
    remoteOnly: false,
    yearsExperience: 2,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "REST APIs"],
    education: "B.Sc. Computer Science, University of Lagos",
    availability: "2 weeks notice",
    projects: [
      { name: "Fintech onboarding flow", description: "Rebuilt a KYC onboarding flow in Next.js, cutting drop-off by a third." },
      { name: "Component library", description: "Built and maintained a shared React component library for a 6-person team." },
    ],
    portfolioUrl: "https://amaraokafor.dev",
    resumeSummary: "Frontend engineer focused on clean, accessible interfaces. Two years shipping production React and Next.js at a Lagos fintech.",
    appliedTo: ["frontend-developer-intern"],
  },
  {
    id: "daniel-mensah",
    name: "Daniel Mensah",
    title: "Junior Software Engineer",
    location: "Accra, Ghana",
    remoteOnly: true,
    yearsExperience: 1,
    skills: ["React", "JavaScript", "Node.js", "Express", "MongoDB"],
    education: "B.Sc. Software Engineering, KNUST",
    availability: "Immediately",
    projects: [
      { name: "Campus marketplace", description: "Built a full-stack marketplace app used by 400+ students at KNUST." },
    ],
    resumeSummary: "Full-stack leaning junior engineer, strongest on the frontend. One year of professional React experience plus several shipped side projects.",
  },
  {
    id: "naledi-mokoena",
    name: "Naledi Mokoena",
    title: "Product Designer",
    location: "Johannesburg, South Africa",
    remoteOnly: true,
    yearsExperience: 3,
    skills: ["Figma", "Design Systems", "User Research", "Prototyping"],
    education: "B.A. Visual Communication, University of Johannesburg",
    availability: "1 month notice",
    projects: [
      { name: "Design system overhaul", description: "Led a token-based design system rollout across 4 product squads." },
    ],
    portfolioUrl: "https://naledimokoena.design",
    resumeSummary: "Product designer with three years across fintech and edtech, specializing in design systems and research-driven iteration.",
  },
  {
    id: "kwame-boateng",
    name: "Kwame Boateng",
    title: "MBA Candidate — Strategy & Ops",
    location: "Accra, Ghana",
    remoteOnly: false,
    yearsExperience: 4,
    skills: ["Financial Modeling", "Market Research", "Operations", "SQL"],
    education: "MBA Candidate, Ghana Institute of Management",
    availability: "1 month notice",
    projects: [
      { name: "Market entry study", description: "Led a market-entry feasibility study for a regional logistics firm." },
    ],
    resumeSummary: "Operations-minded generalist moving from banking into strategy roles, strong quantitative background.",
  },
  {
    id: "chinedu-eze",
    name: "Chinedu Eze",
    title: "Frontend Developer Intern (Candidate)",
    location: "Lagos, Nigeria",
    remoteOnly: false,
    yearsExperience: 1,
    skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    education: "B.Sc. Computer Science, University of Ibadan (Final year)",
    availability: "Immediately",
    projects: [
      { name: "Personal finance tracker", description: "Solo-built React app to track expenses, published on GitHub with 60+ stars." },
    ],
    portfolioUrl: "https://github.com/chinedueze",
    resumeSummary: "Final-year CS student with hands-on React experience from personal projects and a part-time freelance gig.",
    appliedTo: ["frontend-developer-intern"],
  },
  {
    id: "fatima-abdullahi",
    name: "Fatima Abdullahi",
    title: "Backend Engineer",
    location: "Abuja, Nigeria",
    remoteOnly: true,
    yearsExperience: 5,
    skills: ["Node.js", "PostgreSQL", "AWS", "Docker", "System Design"],
    education: "B.Eng. Computer Engineering, Ahmadu Bello University",
    availability: "1 month notice",
    projects: [
      { name: "Payments infrastructure", description: "Owned the payments ledger service processing ~2M transactions/month." },
    ],
    resumeSummary: "Senior backend engineer with five years building payments and infrastructure systems at scale.",
  },
  {
    id: "tendai-moyo",
    name: "Tendai Moyo",
    title: "Junior React Developer",
    location: "Lagos, Nigeria",
    remoteOnly: false,
    yearsExperience: 2,
    skills: ["React", "Next.js", "Redux", "TypeScript", "Jest"],
    education: "Andela Technical Leadership Program",
    availability: "2 weeks notice",
    projects: [
      { name: "Internal admin dashboard", description: "Built an internal ops dashboard in Next.js used daily by 30+ staff." },
      { name: "Design-to-code pipeline", description: "Set up a Figma-to-React workflow that cut handoff time by half." },
    ],
    portfolioUrl: "https://tendaimoyo.dev",
    resumeSummary: "React-focused engineer, two years of experience, trained through Andela's leadership program with strong testing discipline.",
  },
  {
    id: "grace-wanjiru",
    name: "Grace Wanjiru",
    title: "Data Analyst",
    location: "Nairobi, Kenya",
    remoteOnly: true,
    yearsExperience: 2,
    skills: ["SQL", "Python", "Tableau", "A/B Testing"],
    education: "B.Sc. Statistics, University of Nairobi",
    availability: "Immediately",
    projects: [
      { name: "Retention dashboard", description: "Built the company-wide retention and churn dashboard used by 3 teams." },
    ],
    resumeSummary: "Analytics-minded engineer-adjacent hire, two years turning product data into decisions.",
  },
];
