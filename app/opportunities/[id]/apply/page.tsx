"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { apiFetch } from "../../../../lib/api";
import { opportunities } from "../../../data/opportunities";
import { SiteNav } from "../../../../components/site-nav";

export default function ApplyPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const opportunity = opportunities.find((item) => item.id === params.id);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [checkingExisting, setCheckingExisting] = useState(true);
  const [existingApplicationId, setExistingApplicationId] = useState<string | null>(null);

  // Guard against duplicate applications reached via direct URL — the API
  // also rejects this, but checking up front avoids showing the form at all.
  useEffect(() => {
    let active = true;

    async function checkExisting() {
      try {
        const response = await apiFetch("/api/me/activity");
        const payload = await response.json().catch(() => null);
        if (!active) return;
        const applicationId = payload?.data?.activeApplicationsByOpportunity?.[params.id as string];
        setExistingApplicationId(typeof applicationId === "string" ? applicationId : null);
      } finally {
        if (active) setCheckingExisting(false);
      }
    }

    checkExisting();
    return () => {
      active = false;
    };
  }, [params.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = String(formData.get("fullName") ?? "").trim();
    const payload = {
      fullName,
      email: String(formData.get("email") ?? "").trim(),
      portfolioUrl: String(formData.get("portfolioUrl") ?? "").trim(),
      motivation: String(formData.get("motivation") ?? "").trim(),
      opportunityId: params.id,
      opportunityTitle: opportunity?.title ?? "Opportunity",
      opportunityOrganization: opportunity?.organization ?? "",
    };

    try {
      const response = await apiFetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) router.push("/login");
        if (response.status === 409 && result?.data?.id) {
          setExistingApplicationId(result.data.id);
          throw new Error(result?.error ?? "You've already applied to this opportunity.");
        }
        throw new Error(result?.error ?? "Something went wrong while submitting your application.");
      }

      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkingExisting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] text-black">
        <p className="text-sm text-zinc-500">Loading...</p>
      </main>
    );
  }

  if (existingApplicationId && !submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6 text-black">
        <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">✓</div>
          <h1 className="mt-6 text-3xl font-black tracking-[-0.05em]">You&apos;ve already applied</h1>
          <p className="mt-4 leading-7 text-zinc-600">
            You can only have one active application per opportunity. Cancel your existing application first if you&apos;d like to reapply.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={`/applications/${existingApplicationId}`}
              className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              View my application
            </Link>
            <Link href="/opportunities" className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-black transition hover:border-black/20">
              Back to opportunities
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf9] px-6 text-black">
        <div className="w-full max-w-lg rounded-[2rem] border border-black/10 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
            ✓
          </div>
          <h1 className="mt-6 text-3xl font-black tracking-[-0.05em]">Application submitted</h1>
          <p className="mt-4 leading-7 text-zinc-600">
            Your application has been successfully sent. You can keep track of its progress from your dashboard.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => setSubmitted(false)}
              className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Submit another
            </button>
            <Link href="/dashboard" className="rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-black transition hover:border-black/20">
              View dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf9] text-black">
      <SiteNav />

      <section className="mx-auto max-w-3xl px-6 py-14 lg:px-10">
        <Link href="/opportunities" className="mb-8 inline-flex items-center text-sm text-zinc-600 transition hover:text-black">
          ← Back
        </Link>

        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">Application</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em]">Apply for this opportunity</h1>
        <p className="mt-4 text-zinc-600">
          Tell the organization a little about yourself and why you believe you are a strong fit.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Full name</label>
              <input name="fullName" required type="text" placeholder="Your full name" className="w-full rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 outline-none transition focus:border-black focus:bg-white" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">Email address</label>
              <input name="email" required type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 outline-none transition focus:border-black focus:bg-white" />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Portfolio URL</label>
            <input name="portfolioUrl" type="url" placeholder="https://yourportfolio.com" className="w-full rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 outline-none transition focus:border-black focus:bg-white" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">Why are you interested?</label>
            <textarea name="motivation" required rows={6} placeholder="Tell us why you're interested in this opportunity..." className="w-full resize-none rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 outline-none transition focus:border-black focus:bg-white" />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70">
            {isSubmitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </section>
    </main>
  );
}
