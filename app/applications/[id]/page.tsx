import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "../../../auth";
import { SiteNav } from "../../../components/site-nav";
import { SiteFooter } from "../../../components/site-footer";
import { Reveal } from "../../../components/reveal";
import { CancelApplicationButton } from "../../../components/cancel-application-button";
import { readApplications, getApplicationStatus } from "../../../lib/store";

const STEPS = ["Submitted", "Responded"] as const;

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role === "employer") redirect("/dashboard");

  const applications = await readApplications(session.user.id);
  const application = applications.find((a) => a.id === id);
  if (!application) notFound();

  const status = getApplicationStatus(application);
  const isCancelled = status === "Cancelled";
  const currentStepIndex = STEPS.indexOf(status as (typeof STEPS)[number]);

  return (
    <main className="min-h-screen text-black">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-12 lg:px-10">
        <Link href="/applications" className="mb-8 inline-flex items-center text-sm text-zinc-600 transition hover:text-black">
          ← Back to my applications
        </Link>

        <Reveal>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Application</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">{application.opportunityTitle ?? "Opportunity"}</h1>
              <p className="mt-3 text-zinc-600">{application.opportunityOrganization ?? "—"}</p>
            </div>
            {!isCancelled ? <CancelApplicationButton applicationId={application.id} /> : null}
          </div>
        </Reveal>

        {isCancelled ? (
          <Reveal delay={80}>
            <div className="mt-10 rounded-[1.75rem] border border-black/10 bg-zinc-50 p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Status</p>
              <p className="mt-2 text-lg font-semibold text-zinc-600">Cancelled</p>
              <p className="mt-2 text-sm text-zinc-500">
                {application.cancelledAt
                  ? `You cancelled this application on ${new Date(application.cancelledAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}.`
                  : "You cancelled this application."}{" "}
                It stays here for your records.
              </p>
              {application.opportunityId ? (
                <Link href={`/opportunities/${application.opportunityId}/apply`} className="btn-primary mt-5 inline-flex">
                  Reapply
                </Link>
              ) : null}
            </div>
          </Reveal>
        ) : (
          <Reveal delay={80}>
            <div className="mt-10 rounded-[1.75rem] border border-black/10 bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">Status</p>
              <ol className="mt-5 flex flex-col gap-0 sm:flex-row sm:items-center">
                {STEPS.map((step, i) => {
                  const reached = i <= currentStepIndex;
                  return (
                    <li key={step} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-center sm:gap-2">
                      <div className="flex items-center gap-3 sm:flex-col sm:gap-2">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                            reached ? "bg-black text-white" : "border border-black/20 bg-white text-zinc-400"
                          }`}
                        >
                          {reached ? "✓" : i + 1}
                        </span>
                        <span className={`text-sm ${reached ? "font-medium text-black" : "text-zinc-400"}`}>{step}</span>
                      </div>
                      {i < STEPS.length - 1 ? (
                        <span className={`hidden h-px flex-1 sm:block ${i < currentStepIndex ? "bg-black" : "bg-black/10"}`} />
                      ) : null}
                    </li>
                  );
                })}
              </ol>
              <p className="mt-6 text-sm text-zinc-500">
                Applied on{" "}
                {new Date(application.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}. Status
                updates automatically as time passes — the organization hasn&apos;t sent a review update yet.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={140}>
          <div className="mt-6 rounded-[1.75rem] border border-black/10 bg-white p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">What you submitted</p>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-zinc-500">Full name</dt>
                <dd className="mt-1 font-medium">{application.fullName}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Email</dt>
                <dd className="mt-1 font-medium">{application.email}</dd>
              </div>
              {application.portfolioUrl ? (
                <div>
                  <dt className="text-zinc-500">Portfolio</dt>
                  <dd className="mt-1">
                    <a href={application.portfolioUrl} target="_blank" rel="noreferrer" className="font-medium underline">
                      {application.portfolioUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-zinc-500">Motivation</dt>
                <dd className="mt-1 leading-6 text-zinc-700">{application.motivation}</dd>
              </div>
            </dl>
          </div>
        </Reveal>

        {application.opportunityId && !isCancelled ? (
          <Reveal delay={200}>
            <Link href={`/opportunities/${application.opportunityId}`} className="btn-secondary mt-6 inline-flex">
              View original listing
            </Link>
          </Reveal>
        ) : null}
      </section>

      <SiteFooter />
    </main>
  );
}
