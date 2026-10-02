export type HiringStage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";

export type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  remote: boolean;
  employmentType: "Full-time" | "Part-time" | "Internship" | "Contract";
  status: "Open" | "Paused" | "Closed";
  skillsWanted: string[];
  minYearsExperience: number;
  applicantIds: string[];
  postedAt: string;
};

export const jobs: Job[] = [
  {
    id: "frontend-developer-intern",
    title: "Frontend Developer Intern",
    department: "Engineering",
    location: "Lagos, Nigeria",
    remote: false,
    employmentType: "Internship",
    status: "Open",
    skillsWanted: ["React", "JavaScript", "CSS"],
    minYearsExperience: 0,
    applicantIds: ["amara-okafor", "chinedu-eze"],
    postedAt: "2026-08-14",
  },
  {
    id: "junior-react-developer",
    title: "Junior React Developer",
    department: "Engineering",
    location: "Lagos, Nigeria",
    remote: false,
    employmentType: "Full-time",
    status: "Open",
    skillsWanted: ["React", "Next.js", "TypeScript"],
    minYearsExperience: 1,
    applicantIds: ["tendai-moyo", "daniel-mensah"],
    postedAt: "2026-08-20",
  },
  {
    id: "backend-engineer",
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote (Africa)",
    remote: true,
    employmentType: "Full-time",
    status: "Open",
    skillsWanted: ["Node.js", "PostgreSQL", "AWS"],
    minYearsExperience: 3,
    applicantIds: ["fatima-abdullahi"],
    postedAt: "2026-08-05",
  },
  {
    id: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    remote: true,
    employmentType: "Full-time",
    status: "Paused",
    skillsWanted: ["Figma", "Design Systems"],
    minYearsExperience: 2,
    applicantIds: ["naledi-mokoena"],
    postedAt: "2026-07-22",
  },
];
