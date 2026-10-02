import { SiteNav } from "../../components/site-nav";
import { SiteFooter } from "../../components/site-footer";
import { Reveal } from "../../components/reveal";

export default function AboutPage() {
  return (
    <main className="min-h-screen text-black">
      <SiteNav />
      <section className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        <Reveal>
          <p className="eyebrow">About</p>
          <h1 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-5xl">About nia.</h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Nia is the opportunity layer for African talent — a single place to find jobs, internships,
            scholarships, and fellowships, and for organizations to find the people ready to fill them.
          </p>
          <p className="mt-4 leading-7 text-zinc-500">
            This page is a placeholder. Real copy about Nia&apos;s mission, story, and team goes here.
          </p>
        </Reveal>
      </section>
      <SiteFooter />
    </main>
  );
}
