export type SkillCategory = {
  id: string;
  label: string;
  skills: string[];
};

// Structured so new categories/skills can be appended without touching
// anything that consumes this — the picker, search, and onboarding all just
// read from SKILL_CATEGORIES / ALL_SKILLS.
export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "technology",
    label: "Technology",
    skills: [
      "Frontend Development",
      "Backend Development",
      "Full-Stack Development",
      "UI/UX Design",
      "Software Engineering",
      "Mobile Development",
      "Data Analysis",
      "Data Science",
      "Machine Learning",
      "Cybersecurity",
      "Cloud Computing",
      "DevOps",
      "Product Management",
      "Quality Assurance / Testing",
      "Database Administration",
      "Blockchain Development",
      "Technical Writing",
      "IT Support",
    ],
  },
  {
    id: "creative-media",
    label: "Creative / Media",
    skills: [
      "Content Creation",
      "Story Writing",
      "Copywriting",
      "Photography",
      "Video Editing",
      "Videography",
      "Graphic Design",
      "Animation",
      "Illustration",
      "Music Production",
      "Sound Engineering",
      "Acting",
      "Voice Over",
      "Fashion Design",
      "Interior Design",
      "Podcasting",
      "Social Media Content",
    ],
  },
  {
    id: "business-social",
    label: "Business / Social",
    skills: [
      "Customer Service",
      "Customer Care",
      "Sales",
      "Marketing",
      "Digital Marketing",
      "Project Management",
      "Service Management",
      "Communication",
      "Public Speaking",
      "Leadership",
      "Business Development",
      "Operations Management",
      "Human Resources",
      "Accounting",
      "Financial Analysis",
      "Event Planning",
      "Teaching / Training",
      "Research",
      "Legal / Compliance",
      "Supply Chain & Logistics",
    ],
  },
];

export const ALL_SKILLS: string[] = SKILL_CATEGORIES.flatMap((category) => category.skills);

export function findSkillCategory(skill: string): SkillCategory | undefined {
  return SKILL_CATEGORIES.find((category) => category.skills.includes(skill));
}

export function searchSkills(query: string): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return ALL_SKILLS;
  return ALL_SKILLS.filter((skill) => skill.toLowerCase().includes(q));
}

/** True if the given text exactly matches a catalogue skill (case-insensitive). */
export function isCatalogueSkill(value: string): boolean {
  const v = value.trim().toLowerCase();
  return ALL_SKILLS.some((skill) => skill.toLowerCase() === v);
}
