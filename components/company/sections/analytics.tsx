import type { Job } from "../../../lib/mock-jobs";
import type { Candidate } from "../../../lib/mock-candidates";
import type { ShortlistEntry } from "../dashboard-state";
import { CountUp } from "../../animated/count-up";
import { AnimatedBar } from "../../animated/animated-bar";
import { AnimatedLineChart } from "../../animated/animated-line-chart";
import { FadeIn } from "../../animated/fade-in";

const APPLICANT_TRENDS = [12, 18, 15, 24, 21, 30, 27, 34]; // last 8 weeks, illustrative
const WEEK_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

export function AnalyticsSection({ jobs, candidates, shortlist }: { jobs: Job[]; candidates: Candidate[]; shortlist: ShortlistEntry[] }) {
  const funnelStages = ["Applied", "Screening", "Interview", "Offer", "Hired"] as const;
  const funnelCounts = funnelStages.map((stage) => shortlist.filter((s) => s.stage === stage).length);
  const maxFunnel = Math.max(1, ...funnelCounts);

  const skillCounts = new Map<string, number>();
  jobs.forEach((job) => job.skillsWanted.forEach((skill) => skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1)));
  candidates.forEach((c) => c.skills.forEach((skill) => skillCounts.set(skill, (skillCounts.get(skill) ?? 0) + 1)));
  const topSkills = Array.from(skillCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxSkill = Math.max(1, ...topSkills.map(([, count]) => count));

  const avgTimeToHireDays = 18;
  const totalApplicants = jobs.reduce((sum, j) => sum + j.applicantIds.length, 0);
  const hireRate = shortlist.length === 0 ? 0 : Math.round((shortlist.filter((s) => s.stage === "Hired").length / shortlist.length) * 100);

  return (
    <div>
      <FadeIn>
        <div className="mb-6">
          <p className="eyebrow">Analytics</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Hiring insights</h1>
        </div>
      </FadeIn>

      <div className="grid gap-4 sm:grid-cols-3">
        <FadeIn delay={0}>
          <div className="card-interactive glass-panel-strong rounded-[1.5rem] p-5">
            <p className="text-sm text-zinc-500">Avg. time to hire</p>
            <p className="mt-2 text-3xl font-black tracking-[-0.05em]"><CountUp value={avgTimeToHireDays} /> days</p>
          </div>
        </FadeIn>
        <FadeIn delay={70}>
          <div className="card-interactive glass-panel-strong rounded-[1.5rem] p-5">
            <p className="text-sm text-zinc-500">Applicants (all jobs)</p>
            <p className="mt-2 text-3xl font-black tracking-[-0.05em]"><CountUp value={totalApplicants} /></p>
          </div>
        </FadeIn>
        <FadeIn delay={140}>
          <div className="card-interactive glass-panel-strong rounded-[1.5rem] p-5">
            <p className="text-sm text-zinc-500">Shortlist → hire rate</p>
            <p className="mt-2 text-3xl font-black tracking-[-0.05em]"><CountUp value={hireRate} formatter={(n) => `${Math.round(n)}%`} /></p>
          </div>
        </FadeIn>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <FadeIn delay={100}>
          <div className="glass-panel-strong rounded-[1.75rem] p-6">
            <h2 className="text-lg font-bold">Applicant trend</h2>
            <p className="text-xs text-zinc-500">Last 8 weeks · hover a point for the exact count</p>
            <AnimatedLineChart values={APPLICANT_TRENDS} labels={WEEK_LABELS} />
          </div>
        </FadeIn>

        <FadeIn delay={160}>
          <div className="glass-panel-strong rounded-[1.75rem] p-6">
            <h2 className="text-lg font-bold">Hiring funnel</h2>
            <p className="text-xs text-zinc-500">Current shortlist, by stage</p>
            <div className="mt-6 space-y-3">
              {funnelStages.map((stage, i) => (
                <div key={stage}>
                  <div className="mb-1 flex justify-between text-xs text-zinc-500">
                    <span>{stage}</span>
                    <span><CountUp value={funnelCounts[i]} duration={700} /></span>
                  </div>
                  <AnimatedBar
                    percent={(funnelCounts[i] / maxFunnel) * 100}
                    trackClassName="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100"
                    delay={i * 80}
                  />
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={220}>
        <div className="mt-6 glass-panel-strong rounded-[1.75rem] p-6">
          <h2 className="text-lg font-bold">Most requested skills</h2>
          <p className="text-xs text-zinc-500">Across open jobs and your candidate pool</p>
          <div className="mt-5 space-y-3">
            {topSkills.map(([skill, count], i) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-zinc-700">{skill}</span>
                <AnimatedBar
                  percent={(count / maxSkill) * 100}
                  className="flex-1"
                  trackClassName="h-2 w-full overflow-hidden rounded-full bg-zinc-100"
                  delay={i * 60}
                />
                <span className="w-6 shrink-0 text-right text-xs text-zinc-500"><CountUp value={count} duration={600} /></span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
