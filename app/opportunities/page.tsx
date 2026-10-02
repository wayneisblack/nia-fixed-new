"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";
import { SkeletonList } from "../../components/ui/skeleton";
import { BookmarkButton } from "../../components/bookmark-button";
import { apiFetch } from "../../lib/api";

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  remote: boolean;
  deadline: string;
  description: string;
};

const categories = ["All", "Jobs", "Internships", "Scholarships", "Fellowships"];

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setLoadError(false);
      try {
        const [opportunitiesRes, activityRes] = await Promise.all([
          apiFetch("/api/opportunities"),
          apiFetch("/api/me/activity"),
        ]);
        if (!opportunitiesRes.ok) throw new Error("Request failed");
        const payload = await opportunitiesRes.json();
        const activity = activityRes.ok ? await activityRes.json() : null;

        if (!active) return;
        setOpportunities(Array.isArray(payload?.data) ? payload.data : []);
        setAppliedIds(new Set(activity?.data?.appliedOpportunityIds ?? []));
        setSavedIds(new Set(activity?.data?.savedOpportunityIds ?? []));
      } catch {
        if (active) {
          setOpportunities([]);
          setLoadError(true);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return opportunities.filter((opportunity) => {
      const matchesCategory =
        selectedCategory === "All" ||
        (selectedCategory === "Jobs" && opportunity.type === "Job") ||
        (selectedCategory === "Internships" && opportunity.type === "Internship") ||
        (selectedCategory === "Scholarships" && opportunity.type === "Scholarship") ||
        (selectedCategory === "Fellowships" && opportunity.type === "Fellowship");

      const matchesSearch =
        !query ||
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.organization.toLowerCase().includes(query) ||
        opportunity.location.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [opportunities, search, selectedCategory]);

  return (
    <main className="min-h-screen text-black">
      <div className="glass-panel sticky top-0 z-20">
        <SiteNav />
      </div>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="glass-panel-strong rounded-[2rem] p-8 shadow-[0_30px_80px_rgba(17,17,17,0.06)] sm:p-10">
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Discover</p>
              <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Opportunities</h1>
              <p className="mt-3 max-w-2xl text-zinc-600">
                Find jobs, internships, scholarships, and fellowships across Africa and beyond.
              </p>
            </div>

            <div className="rounded-full border border-black/10 bg-zinc-50/80 px-4 py-2 text-sm text-zinc-700">
              {opportunities.length} live listings
            </div>
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search opportunities..."
              className="w-full rounded-2xl border border-black/10 bg-zinc-50/80 px-5 py-4 text-base outline-none transition focus:border-black focus:bg-white"
            />
          </div>

          <div className="mb-8 flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  index === 0 && selectedCategory === category
                    ? "bg-black text-white"
                    : selectedCategory === category
                      ? "bg-black text-white"
                      : "border border-black/10 bg-white/80 text-zinc-700 hover:border-black/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="space-y-5">
            {loading ? (
              <SkeletonList count={4} />
            ) : loadError ? (
              <div role="alert" className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                <p>Couldn&apos;t load opportunities right now.</p>
                <button
                  onClick={() => setReloadToken((v) => v + 1)}
                  className="mt-3 rounded-full border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  Try again
                </button>
              </div>
            ) : filteredOpportunities.length > 0 ? (
              filteredOpportunities.map((opportunity, index) => (
                <Reveal key={opportunity.id} delay={Math.min(index, 5) * 90}>
                  <article className="hover-lift rounded-[1.75rem] border border-black/10 bg-zinc-50/80 p-6 transition hover:border-black/20 hover:bg-white">
                    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-zinc-500">{opportunity.organization}</p>
                          {appliedIds.has(opportunity.id) ? (
                            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.1em] text-white">
                              Applied
                            </span>
                          ) : null}
                        </div>
                        <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">{opportunity.title}</h2>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
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

                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end">
                          <p className="text-sm text-zinc-500">Deadline: {opportunity.deadline}</p>
                          <Link
                            href={`/opportunities/${opportunity.id}`}
                            className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                          >
                            {appliedIds.has(opportunity.id) ? "View application" : "View opportunity"}
                          </Link>
                        </div>
                        <BookmarkButton opportunityId={opportunity.id} initialSaved={savedIds.has(opportunity.id)} />
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-black/10 bg-zinc-50/70 p-6 text-sm text-zinc-500">
                No opportunities match your current filters.
              </div>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
