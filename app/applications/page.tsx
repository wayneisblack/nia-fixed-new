import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "../../auth";
import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";
import { readApplications, getApplicationStatus, type ApplicationStatus } from "../../lib/store";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Submitted: "bg-zinc-100 text-zinc-700",
  Responded: "bg-amber-100 text-amber-800",
  Cancelled: "bg-zinc-100 text-zinc-400 line-through",
};

const FILTERS: { key: "all" | ApplicationStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Submitted", label: "Submitted" },
  { key: "Responded", label: "Responded" },
  { key: "Cancelled", label: "Cancelled" },
];

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role === "employer") redirect("/dashboard");

  const { status: statusParam } = await searchParams;
  const applications = await readApplications(session.user.id);
  const withStatus = applications.map((application) => ({ application, status: getApplicationStatus(application) }));

  const activeFilter = FILTERS.some((f) => f.key === statusParam) ? (statusParam as (typeof FILTERS)[number]["key"]) : "all";
  const filtered = activeFilter === "all" ? withStatus : withStatus.filter((a) => a.status === activeFilter);

  return (
    <main className="min-h-screen text-black">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-6 py-12 lg:px-10">
        <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm text-zinc-600 transition hover:text-black">
          ← Back to dashboard
        </Link>

        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">My applications</h1>
        <p className="mt-3 text-zinc-600">Every opportunity you&apos;ve applied to, and where it stands.</p>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const count = filter.key === "all" ? withStatus.length : withStatus.filter((a) => a.status === filter.key).length;
            return (
              <Link
                key={filter.key}
                href={filter.key === "all" ? "/applications" : `/applications?status=${filter.key}`}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeFilter === filter.key ? "bg-black text-white" : "border border-black/10 bg-white text-zinc-700 hover:border-black/20"
                }`}
              >
                {filter.label} ({count})
              </Link>
            );
          })}
        </div>

        <div className="mt-8 space-y-4">
          {filtered.length === 0 ? (
            <Reveal>
              <div className="rounded-[1.5rem] border border-dashed border-black/15 bg-zinc-50/60 p-10 text-center">
                <p className="text-sm text-zinc-600">
                  {applications.length === 0 ? "You haven't applied to anything yet." : "No applications match this filter."}
                </p>
                <Link href="/opportunities" className="btn-secondary mt-4 inline-flex">
                  Browse opportunities
                </Link>
              </div>
            </Reveal>
          ) : (
            filtered.map(({ application, status }, i) => (
              <Reveal key={application.id} delay={i * 60}>
                <Link
                  href={`/applications/${application.id}`}
                  className="hover-lift flex flex-col justify-between gap-4 rounded-[1.5rem] border border-black/10 bg-white p-6 sm:flex-row sm:items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{application.opportunityTitle ?? "Opportunity"}</h2>
                    <p className="mt-1 text-sm text-zinc-500">{application.opportunityOrganization ?? "—"}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.15em] text-zinc-400">
                      Applied{" "}
                      {new Date(application.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                  <span className={`w-fit shrink-0 rounded-full px-3 py-2 text-xs font-medium ${STATUS_STYLES[status]}`}>{status}</span>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
