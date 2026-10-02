"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";

export default function ApplicationsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("Applications failed to load:", error);
  }, [error]);

  return (
    <main className="min-h-screen text-black">
      <SiteNav />
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center lg:px-10">
        <p className="eyebrow">My applications</p>
        <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl">Couldn&apos;t load your applications.</h1>
        <p className="mt-4 text-zinc-600">This is usually temporary.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">Try again</button>
          <Link href="/dashboard" className="btn-secondary">Back to dashboard</Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
