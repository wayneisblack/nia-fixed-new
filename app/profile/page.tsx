import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { getUserById } from "../../lib/users";
import { computeCompletion } from "../../lib/onboarding";
import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";
import { InterestsEditor } from "../../components/interests-editor";
import { SkillsEditor } from "../../components/skills-editor";
import { LocationEditor } from "../../components/location-editor";
import { ProfileCompletion } from "../../components/profile/profile-completion";
import { AboutEditor } from "../../components/profile/about-editor";
import { CompanyDetailsEditor } from "../../components/profile/company-details-editor";
import { ExperienceEditor } from "../../components/profile/experience-editor";
import { EducationEditor } from "../../components/profile/education-editor";

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 rounded-[1.5rem] border border-black/10 bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");

  const isCompany = user.role === "employer";
  const completion = computeCompletion(user);

  return (
    <main className="min-h-screen bg-zinc-50">
      <SiteNav />

      <div className="mx-auto max-w-5xl px-6 py-14">
        <Reveal>
          <p className="eyebrow text-zinc-500">Your profile</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1 className="text-4xl font-black tracking-[-0.05em]">{isCompany ? user.companyName || "Your company" : user.name}</h1>
            <Link href="/account" className="btn-secondary px-4 py-2 text-xs">
              Account &amp; security
            </Link>
          </div>
          <p className="mt-2 text-zinc-500">
            {isCompany ? "Here's how candidates will see your company." : "Here's how recruiters will see you."}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Section id="about" title="About">
              <AboutEditor initialAbout={user.about ?? ""} isCompany={isCompany} />
            </Section>

            <Section id="interests" title={isCompany ? "Hiring interests" : "Interests"}>
              <InterestsEditor initialCategories={user.categories ?? []} isCompany={isCompany} />
            </Section>

            {!isCompany ? (
              <Section id="skills" title="Skills">
                <SkillsEditor initialSkills={user.skills ?? []} />
              </Section>
            ) : null}

            {isCompany ? (
              <Section id="industry" title="Industry & company details">
                <div id="details">
                  <CompanyDetailsEditor
                    initialIndustry={user.industry ?? ""}
                    initialCompanySize={user.companySize ?? ""}
                    initialWebsite={user.website ?? ""}
                  />
                </div>
              </Section>
            ) : null}

            <Section id="location" title="Location">
              <LocationEditor initialLocation={user.location} />
            </Section>

            {!isCompany ? (
              <>
                <Section id="experience" title="Experience">
                  <ExperienceEditor initialExperience={user.experience ?? []} />
                </Section>
                <Section id="education" title="Education">
                  <EducationEditor initialEducation={user.education ?? []} />
                </Section>
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            <ProfileCompletion completion={completion} />
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-6 text-sm text-zinc-500">
              <p className="font-semibold text-black">Editing here vs. onboarding</p>
              <p className="mt-2">
                Everything you set up during onboarding lives here — this is the permanent place to view and update it, not just a one-time form.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}
