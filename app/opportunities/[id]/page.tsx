import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "../../../auth";
import { readOpportunity, findActiveApplication, readBookmarks } from "../../../lib/store";
import { SiteNav } from "../../../components/site-nav";
import { SiteFooter } from "../../../components/site-footer";
import { BookmarkButton } from "../../../components/bookmark-button";

type OpportunityPageProps = {
  params: Promise<{ id: string }>;
};

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  const opportunity = await readOpportunity(id);

  if (!opportunity) {
    notFound();
  }

  const session = await auth();
  const isTalent = session?.user?.id && session.user.role !== "employer";

  const [activeApplication, bookmarks] = isTalent
    ? await Promise.all([findActiveApplication(session!.user.id, opportunity.id), readBookmarks(session!.user.id)])
    : [undefined, []];
  const isSaved = bookmarks.some((b) => b.opportunityId === opportunity.id);

  return (
    <main className="min-h-screen text-black">
      <div className="glass-panel sticky top-0 z-20">
        <SiteNav />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
        <Link href="/opportunities" className="mb-8 inline-flex items-center text-sm text-zinc-600 transition hover:text-black">
          ← Back to opportunities
        </Link>

        <div className="glass-panel-strong rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(17,17,17,0.06)] sm:p-10">
          <div className="border-b border-black/10 pb-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">{opportunity.organization}</p>
              {isTalent ? <BookmarkButton opportunityId={opportunity.id} initialSaved={isSaved} /> : null}
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.06em] sm:text-5xl">{opportunity.title}</h1>

            <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-600">
              <span>{opportunity.location}</span>
              <span className="text-zinc-400">•</span>
              <span>{opportunity.type}</span>
              {opportunity.remote && (
                <>
                  <span className="text-zinc-400">•</span>
                  <span>Remote</span>
                </>
              )}
            </div>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[1fr_320px]">
            <div>
              <div className="rounded-[1.5rem] border border-black/10 bg-zinc-50/80 p-6">
                <h2 className="text-xl font-bold tracking-[-0.04em]">About the opportunity</h2>
                <p className="mt-4 leading-8 text-zinc-600">{opportunity.description}</p>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold tracking-[-0.04em]">Responsibilities</h3>
                <ul className="mt-4 space-y-3 text-zinc-600">
                  {opportunity.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-black" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-bold tracking-[-0.04em]">Requirements</h3>
                <ul className="mt-4 space-y-3 text-zinc-600">
                  {opportunity.requirements.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-black" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="premium-shadow h-fit rounded-[1.75rem] border border-black/10 bg-zinc-950 p-6 text-white">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Application deadline</p>
              <p className="mt-3 text-2xl font-bold">{opportunity.deadline}</p>

              <div className="mt-6 space-y-3 text-sm text-zinc-300">
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Type</span>
                  <span>{opportunity.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Remote</span>
                  <span>{opportunity.remote ? "Yes" : "No"}</span>
                </div>
              </div>

              <Link
                href={activeApplication ? `/applications/${activeApplication.id}` : `/opportunities/${opportunity.id}/apply`}
                className={`mt-8 block w-full rounded-full px-5 py-3 text-center text-sm font-medium transition ${
                  activeApplication ? "border border-white/20 bg-transparent text-white hover:bg-white/10" : "bg-white text-black hover:bg-zinc-200"
                }`}
              >
                {activeApplication ? "Applied — waiting for feedback" : "Apply now"}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
