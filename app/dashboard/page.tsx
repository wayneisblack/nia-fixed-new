import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";
import { CompanyDashboard } from "../../components/company/company-dashboard";
import { BookmarkButton } from "../../components/bookmark-button";
import { ProfileCompletion } from "../../components/profile/profile-completion";
import { readApplications, readBookmarks, readOpportunities, getApplicationStatus } from "../../lib/store";
import { getRecommendedOpportunities } from "../../lib/recommendations";
import { getUserById, toClientProfile } from "../../lib/users";
import { computeCompletion } from "../../lib/onboarding";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(session.user.id);
  if (!user) redirect("/login");

  // The dashboard only unlocks once every mandatory onboarding field is set —
  // this mirrors the same requirements onboarding itself enforces, read from
  // the one shared definition in lib/onboarding.ts.
  const completion = computeCompletion(user);
  if (!completion.mandatoryMet) redirect("/onboarding");

  if (session.user.role === "employer") {
    return <CompanyDashboard name={session.user.name} email={session.user.email} companyName={session.user.companyName} profile={toClientProfile(user)} />;
  }

  const userId = session.user.id;
  const displayName = session.user.name?.split(" ")[0] ?? "there";
  const categories = session.user.categories ?? [];
  const [applications, allOpportunities, bookmarks] = await Promise.all([
    readApplications(userId),
    readOpportunities(),
    readBookmarks(userId),
  ]);

  const activeApplications = applications.filter((a) => a.status === "Active");
  const appliedIds = new Set(activeApplications.map((a) => a.opportunityId).filter(Boolean));
  const savedIds = new Set(bookmarks.map((b) => b.opportunityId));

  // Recommended for you = opportunities matching the user's interests. The
  // stat card counts only the ones they haven't applied to yet; the preview
  // below shows a few of all of them, applied ones marked rather than hidden.
  const recommendedAll = getRecommendedOpportunities(allOpportunities, categories);
  const recommendedNotApplied = recommendedAll.filter((o) => !appliedIds.has(o.id));
  const recommendedPreview = recommendedAll.slice(0, 3);

  const recentApplications = applications.slice(0, 5).map((application) => ({
    key: application.id,
    role: application.opportunityTitle ?? "Opportunity",
    organization: application.opportunityOrganization ?? "—",
    status: getApplicationStatus(application),
    date: new Date(application.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  }));

  const hasApplications = applications.length > 0;

  return (
    <main className="min-h-screen text-black">
      <SiteNav />

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Welcome back, {displayName}.</h1>
            <p className="mt-3 text-zinc-600">Keep track of your opportunities and application momentum.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1">
            <ProfileCompletion completion={completion} />
          </div>
          <Link href="/profile" className="hover-lift flex flex-1 flex-col justify-center rounded-[1.75rem] border border-dashed border-black/15 bg-zinc-50/60 p-6 text-sm text-zinc-500 transition hover:border-black/30 hover:text-black">
            <span className="font-semibold text-black">Edit your profile</span>
            <span className="mt-1">Interests, skills, location, about, and more — all editable anytime, not just during onboarding.</span>
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          <Reveal>
            <div className="glass-panel-strong hover-lift rounded-[1.75rem] p-6">
              <p className="text-sm text-zinc-500">Applications submitted</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.06em]">{applications.length}</p>
              <p className="mt-2 text-sm text-zinc-500">Updated in real time</p>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <div className="glass-panel-strong hover-lift rounded-[1.75rem] p-6">
              <p className="text-sm text-zinc-500">Open listings right now</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.06em]">{allOpportunities.length}</p>
              <p className="mt-2 text-sm text-zinc-500">Across jobs, internships & fellowships</p>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div className="glass-panel-strong hover-lift rounded-[1.75rem] p-6">
              <p className="text-sm text-zinc-500">Recommended for you</p>
              <p className="mt-3 text-4xl font-black tracking-[-0.06em]">{recommendedNotApplied.length}</p>
              <p className="mt-2 text-sm text-zinc-500">Not yet applied</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <Reveal>
            <div className="glass-panel-strong rounded-[2rem] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-[-0.04em]">Recent applications</h2>
              {hasApplications ? (
                <Link href="/applications" className="text-sm text-zinc-500 transition hover:text-black">
                  View all
                </Link>
              ) : null}
            </div>

            <div className="mt-6 space-y-4">
              {hasApplications ? (
                recentApplications.map((application) => (
                  <Link
                    key={application.key}
                    href={`/applications/${application.key}`}
                    className="hover-lift flex flex-col justify-between gap-4 rounded-[1.5rem] border border-black/10 bg-zinc-50/70 p-5 sm:flex-row sm:items-center"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{application.role}</h3>
                      <p className="mt-1 text-sm text-zinc-500">{application.organization}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-400">Applied {application.date}</p>
                    </div>
                    <span
                      className={`w-fit rounded-full px-3 py-2 text-xs font-medium ${
                        application.status === "Cancelled"
                          ? "bg-zinc-100 text-zinc-400 line-through"
                          : application.status === "Responded"
                            ? "bg-amber-100 text-amber-800"
                            : "border border-black/10 bg-zinc-100 text-black"
                      }`}
                    >
                      {application.status}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-zinc-50/60 p-8 text-center">
                  <p className="text-sm text-zinc-600">You haven&apos;t applied to anything yet.</p>
                  <Link href="/opportunities" className="btn-secondary mt-4 inline-flex">
                    Browse opportunities
                  </Link>
                </div>
              )}
            </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <aside className="premium-shadow rounded-[2rem] border border-black/10 bg-zinc-950 p-6 text-white">
              <p className="eyebrow text-zinc-400">Tip</p>
              <h2 className="mt-4 text-2xl font-black tracking-[-0.05em]">Complete your first application</h2>
              <p className="mt-2 text-zinc-300">
                Candidates who apply within a week of creating a profile are more likely to hear back before a deadline closes.
              </p>
              <Link href="/opportunities" className="btn-ghost-dark mt-6 w-full">
                Find an opportunity
              </Link>
            </aside>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-12 glass-panel-strong rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-[-0.04em]">Recommended for you</h2>
            <Link href="/opportunities/recommended" className="text-sm text-zinc-500 transition hover:text-black">
              Explore all
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {recommendedPreview.length === 0 ? (
              <p className="text-sm text-zinc-500 md:col-span-3">No matching opportunities right now — check back soon.</p>
            ) : (
              recommendedPreview.map((item) => (
                <div key={item.id} className="hover-lift relative block rounded-[1.5rem] border border-black/10 bg-zinc-50/80 p-5">
                  <div className="absolute right-4 top-4">
                    <BookmarkButton opportunityId={item.id} initialSaved={savedIds.has(item.id)} size="sm" />
                  </div>
                  <Link href={`/opportunities/${item.id}`} className="block pr-10">
                    <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">{item.type} · {item.category}</p>
                    <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-zinc-500">{item.organization}</p>
                    <div className="mt-5 flex items-center justify-between text-sm text-zinc-600">
                      <span>{item.location}</span>
                      {appliedIds.has(item.id) ? (
                        <span className="rounded-full bg-black px-2 py-1 text-xs text-white">Applied</span>
                      ) : (
                        <span className="rounded-full border border-black/10 bg-white px-2 py-1 text-xs">Deadline {item.deadline}</span>
                      )}
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
