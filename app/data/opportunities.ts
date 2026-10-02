import type { OpportunityCategory } from "../../lib/categories";

export type Opportunity = {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  /** Broad interest area used to match opportunities to a talent's profile — see lib/categories.ts. */
  category: OpportunityCategory;
  remote: boolean;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

export const opportunities: Opportunity[] = [
  {
    id: "frontend-developer-intern",
    title: "Frontend Developer Intern",
    organization: "TechNova",
    location: "Lagos, Nigeria",
    type: "Internship",
    category: "Engineering",
    remote: true,
    deadline: "September 15, 2026",
    description:
      "TechNova is looking for a passionate frontend developer intern to join our product team and help build beautiful, accessible digital experiences.",
    responsibilities: [
      "Build responsive interfaces using modern frontend technologies",
      "Work closely with designers and backend developers",
      "Write clean, maintainable and reusable code",
      "Test and improve user experiences across devices",
    ],
    requirements: [
      "Basic knowledge of HTML, CSS and JavaScript",
      "Experience with React is a plus",
      "Strong problem-solving skills",
      "Ability to work well with a team",
    ],
  },

  {
    id: "product-design-fellowship",
    title: "Product Design Fellowship",
    organization: "Design Africa",
    location: "Remote",
    type: "Fellowship",
    category: "UI/UX",
    remote: true,
    deadline: "September 22, 2026",
    description:
      "A fellowship designed for emerging African product designers who want to develop their skills while working on real-world products.",
    responsibilities: [
      "Design user experiences for digital products",
      "Create wireframes and high-fidelity interfaces",
      "Collaborate with product and engineering teams",
      "Participate in design reviews",
    ],
    requirements: [
      "Interest in product design",
      "Basic understanding of UX principles",
      "Ability to communicate design decisions",
      "Portfolio or examples of your work",
    ],
  },

  {
    id: "junior-software-engineer",
    title: "Junior Software Engineer",
    organization: "AfriLabs",
    location: "Lagos, Nigeria",
    type: "Job",
    category: "Engineering",
    remote: false,
    deadline: "October 3, 2026",
    description:
      "Join a growing engineering team building technology products for users across Africa.",
    responsibilities: [
      "Develop and maintain web applications",
      "Work with engineers and product managers",
      "Debug and improve existing features",
      "Write maintainable code",
    ],
    requirements: [
      "Knowledge of JavaScript or TypeScript",
      "Experience with React is a plus",
      "Understanding of APIs",
      "Strong problem-solving skills",
    ],
  },

  {
    id: "african-innovation-scholarship",
    title: "African Innovation Scholarship",
    organization: "Future Africa",
    location: "Africa",
    type: "Scholarship",
    category: "Research & Innovation",
    remote: true,
    deadline: "October 10, 2026",
    description:
      "A scholarship opportunity supporting young Africans working on innovative ideas that can create meaningful impact.",
    responsibilities: [
      "Develop an innovative project or idea",
      "Participate in the scholarship program",
      "Attend mentorship sessions",
      "Present your project to the community",
    ],
    requirements: [
      "Be based in Africa",
      "Have an innovative project or idea",
      "Demonstrate strong motivation",
      "Submit an application before the deadline",
    ],
  },
];