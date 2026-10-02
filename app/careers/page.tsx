import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";

export default function CareersPage() {
  return (
    <main className="min-h-screen text-black">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <Reveal>
          <p className="eyebrow">Careers</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">Careers at nia.</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            This page is a placeholder for stories about the people and organizations Nia has helped connect —
            who they are, what they went on to do, and what it&apos;s like to build Nia itself.
          </p>
        </Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}
