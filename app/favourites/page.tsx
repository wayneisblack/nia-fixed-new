import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";
import { BookmarkButton } from "../../components/bookmark-button";
import { readApplications, readBookmarks, readOpportunities } from "../../lib/store";

export default async function FavouritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role === "employer") redirect("/dashboard");

  const userId = session.user.id;
  const [bookmarks, opportunities, applications] = await Promise.all([
    readBookmarks(userId),
    readOpportunities(),
    readApplications(userId),
  ]);

  const appliedIds = new Set(applications.filter((a) => a.status === "Active").map((a) => a.opportunityId));
  const saved = bookmarks
    .map((b) => opportunities.find((o) => o.id === b.opportunityId))
    .filter((o): o is NonNullable<typeof o> => Boolean(o));

  return (
    <main className="min-h-screen text-black">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <Link href="/opportunities" className="mb-8 inline-flex items-center text-sm text-zinc-600 transition hover:text-black">
          ← Back to opportunities
        </Link>

        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Favourites</h1>
        <p className="mt-3 text-zinc-600">Opportunities you&apos;ve saved to come back to later.</p>

        <div className="mt-10 space-y-4">
          {saved.length === 0 ? (
            <Reveal>
              <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-zinc-50/60 p-10 text-center">
                <p className="text-sm text-zinc-600">You haven&apos;t saved any opportunities yet.</p>
                <Link href="/opportunities" className="btn-secondary mt-4 inline-flex">
                  Browse opportunities
                </Link>
              </div>
            </Reveal>
          ) : (
            saved.map((opportunity, i) => (
              <Reveal key={opportunity.id} delay={i * 60}>
                <div className="flex items-center gap-4 rounded-[1.5rem] border border-black/10 bg-white p-6">
                  <Link href={`/opportunities/${opportunity.id}`} className="flex-1">
                    <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">{opportunity.type}</p>
                    <h2 className="mt-1 text-lg font-semibold">{opportunity.title}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{opportunity.organization} · {opportunity.location}</p>
                  </Link>
                  {appliedIds.has(opportunity.id) ? (
                    <span className="shrink-0 rounded-full bg-black px-3 py-2 text-xs font-medium text-white">Applied</span>
                  ) : null}
                  <BookmarkButton opportunityId={opportunity.id} initialSaved />
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
