import type { DashboardState } from "../dashboard-state";
import { CountUp } from "../../animated/count-up";
import { AnimatedBar } from "../../animated/animated-bar";
import { FadeIn } from "../../animated/fade-in";

export function OverviewSection({ state, onNavigate }: { state: DashboardState; onNavigate: (key: "find-talent" | "jobs" | "shortlist" | "interviews") => void }) {
  const activeJobs = state.jobs.filter((j) => j.status === "Open").length;
  const totalApplicants = state.jobs.reduce((sum, j) => sum + j.applicantIds.length, 0);
  const shortlisted = state.shortlist.length;
  const upcomingInterviews = state.interviews.filter((i) => i.status === "Scheduled").length;
  const hired = state.shortlist.filter((s) => s.stage === "Hired").length;
  const hiringProgress = shortlisted === 0 ? 0 : Math.round((hired / shortlisted) * 100);

  const activity = [
    { text: `${state.messages[state.messages.length - 1]?.from === "candidate" ? "Reply from" : "Message sent to"} a candidate`, at: "2h ago" },
    { text: `${upcomingInterviews} interview${upcomingInterviews === 1 ? "" : "s"} scheduled this week`, at: "5h ago" },
    { text: `${shortlisted} candidates currently in your shortlist`, at: "1d ago" },
  ];

  return (
    <div>
      <FadeIn>
        <div className="mb-8">
          <p className="eyebrow">Overview</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Here&apos;s where hiring stands.</h1>
        </div>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FadeIn delay={0}><StatCard label="Active jobs" value={activeJobs} onClick={() => onNavigate("jobs")} /></FadeIn>
        <FadeIn delay={70}><StatCard label="Total applicants" value={totalApplicants} onClick={() => onNavigate("jobs")} /></FadeIn>
        <FadeIn delay={140}><StatCard label="AI-recommended talent" value={8} onClick={() => onNavigate("find-talent")} /></FadeIn>
        <FadeIn delay={210}><StatCard label="Shortlisted candidates" value={shortlisted} onClick={() => onNavigate("shortlist")} /></FadeIn>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <FadeIn delay={100} className="glass-panel-strong rounded-[1.75rem] p-6">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Hiring progress</h2>
              <span className="text-sm text-zinc-500">{hired} hired of {shortlisted} shortlisted</span>
            </div>
            <AnimatedBar percent={hiringProgress} className="mt-4" trackClassName="h-3 w-full overflow-hidden rounded-full bg-zinc-100" />
            <div className="mt-6 grid grid-cols-3 gap-3 text-center sm:grid-cols-6">
              {(["Applied", "Screening", "Interview", "Offer", "Hired", "Rejected"] as const).map((stage, i) => {
                const count = state.shortlist.filter((s) => s.stage === stage).length;
                return (
                  <FadeIn key={stage} delay={150 + i * 40} className="rounded-xl border border-black/10 bg-zinc-50 py-3 card-interactive">
                    <div>
                      <p className="text-lg font-bold"><CountUp value={count} duration={600} /></p>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-zinc-500">{stage}</p>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={180} className="glass-panel-strong rounded-[1.75rem] p-6">
          <div>
            <h2 className="text-lg font-bold">Recent activity</h2>
            <div className="mt-4 space-y-4">
              {activity.map((item, i) => (
                <FadeIn key={i} delay={220 + i * 90} className="flex items-start gap-3 text-sm">
                  <>
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
                    <div>
                      <p className="text-zinc-700">{item.text}</p>
                      <p className="text-xs text-zinc-400">{item.at}</p>
                    </div>
                  </>
                </FadeIn>
              ))}
            </div>
            <button onClick={() => onNavigate("interviews")} className="btn-secondary mt-5 w-full text-sm">
              View upcoming interviews
            </button>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={260}>
        <button
          onClick={() => onNavigate("find-talent")}
          className="card-interactive mt-6 flex w-full items-center justify-between rounded-[1.75rem] border border-black/10 bg-zinc-950 p-6 text-left text-white"
        >
          <div>
            <p className="eyebrow flex items-center gap-2 text-zinc-400">
              <span className="ai-dot-light" />
              Nia AI
            </p>
            <p className="mt-1 text-xl font-bold">Tell Nia who you need — Nia finds them.</p>
          </div>
          <span className="btn-primary shrink-0 bg-white text-black">Find talent →</span>
        </button>
      </FadeIn>
    </div>
  );
}

function StatCard({ label, value, onClick }: { label: string; value: number; onClick: () => void }) {
  return (
    <button onClick={onClick} className="card-interactive glass-panel-strong w-full rounded-[1.5rem] p-5 text-left">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-[-0.05em]"><CountUp value={value} /></p>
    </button>
  );
}
