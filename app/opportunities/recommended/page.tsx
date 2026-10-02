import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { SiteNav } from "../../../components/site-nav";
import { SiteFooter } from "../../../components/site-footer";
import { Reveal } from "../../../components/reveal";
import { BookmarkButton } from "../../../components/bookmark-button";
import { readApplications, readBookmarks, readOpportunities } from "../../../lib/store";
import { getRecommendedOpportunities } from "../../../lib/recommendations";

export default async function RecommendedOpportunitiesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role === "employer") redirect("/dashboard");

  const userId = session.user.id;
  const categories = session.user.categories ?? [];
  const [applications, allOpportunities, bookmarks] = await Promise.all([
    readApplications(userId),
    readOpportunities(),
    readBookmarks(userId),
  ]);

  const appliedIds = new Set(applications.filter((a) => a.status === "Active").map((a) => a.opportunityId));
  const savedIds = new Set(bookmarks.map((b) => b.opportunityId));
  const recommended = getRecommendedOpportunities(allOpportunities, categories);

  return (
    <main className="min-h-screen text-black">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm text-zinc-600 transition hover:text-black">
          ← Back to dashboard
        </Link>

        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Recommended for you</h1>
        <p className="mt-3 text-zinc-600">
          {categories.length === 0
            ? "Set your interests on the dashboard to narrow this down — showing everything for now."
            : `Matched to your interests: ${categories.join(", ")}.`}
        </p>

        <div className="mt-10 space-y-4">
          {recommended.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-zinc-50/60 p-10 text-center">
              <p className="text-sm text-zinc-600">No opportunities match your interests right now.</p>
              <Link href="/opportunities" className="btn-secondary mt-4 inline-flex">
                Browse all opportunities
              </Link>
            </div>
          ) : (
            recommended.map((opportunity, i) => (
              <Reveal key={opportunity.id} delay={Math.min(i, 6) * 60}>
                <div className="flex items-center gap-4 rounded-[1.75rem] border border-black/10 bg-white p-6">
                  <Link href={`/opportunities/${opportunity.id}`} className="flex-1">
                    <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">{opportunity.type} · {opportunity.category}</p>
                    <h2 className="mt-2 text-xl font-semibold">{opportunity.title}</h2>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                      <span>{opportunity.organization}</span>
                      <span className="text-zinc-400">•</span>
                      <span>{opportunity.location}</span>
                      {opportunity.remote ? (
                        <>
                          <span className="text-zinc-400">•</span>
                          <span>Remote</span>
                        </>
                      ) : null}
                    </div>
                  </Link>
                  {appliedIds.has(opportunity.id) ? (
                    <span className="shrink-0 rounded-full bg-black px-3 py-2 text-xs font-medium text-white">Applied</span>
                  ) : (
                    <span className="hidden shrink-0 text-sm text-zinc-500 sm:block">Deadline {opportunity.deadline}</span>
                  )}
                  <BookmarkButton opportunityId={opportunity.id} initialSaved={savedIds.has(opportunity.id)} />
                </div>
              </Reveal>
            ))
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
