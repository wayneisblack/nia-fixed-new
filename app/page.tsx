import Link from "next/link";
import { SiteNav } from "../components/site-nav";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { opportunities } from "./data/opportunities";

const featureCards = [
  {
    title: "Curated, not crowdsourced",
    copy: "Every listing is reviewed before it goes live. No expired links, no spam, no bait-and-switch roles.",
  },
  {
    title: "One dashboard, every step",
    copy: "Track applications, deadlines, and outcomes in a single view instead of a dozen email threads.",
  },
  {
    title: "Built for the whole journey",
    copy: "From your first internship to a leadership fellowship — the platform grows with your career.",
  },
];

const partnerLogos = [
  "Andela", "MEST Africa", "Flutterwave", "Mastercard Foundation",
  "Tony Elumelu Foundation", "AWS re/Start", "Google Africa", "Interswitch",
];

const testimonials = [
  {
    quote:
      "I stopped checking eleven different job boards. Everything relevant to me showed up in one feed, and I actually finished my applications instead of losing track of them.",
    name: "Amara O.",
    role: "Software Engineer, Lagos",
  },
  {
    quote:
      "The dashboard is what sold me. Seeing every application status in one place made the whole search feel manageable instead of chaotic.",
    name: "Kwame B.",
    role: "MBA Candidate, Accra",
  },
  {
    quote:
      "Found a fellowship here I hadn't seen anywhere else. The listing was detailed enough that I knew exactly what I was applying for before I started.",
    name: "Naledi M.",
    role: "Product Designer, Johannesburg",
  },
];

const faqs = [
  {
    q: "Is nia free to use?",
    a: "Yes. Browsing, applying, and tracking applications on nia is completely free for talent. Organizations pay to list roles and reach candidates.",
  },
  {
    q: "What kinds of opportunities are listed?",
    a: "Full-time and contract jobs, internships, scholarships, and fellowships — spanning early-career roles through senior leadership tracks, across tech, finance, design, and public sector work.",
  },
  {
    q: "How are listings vetted?",
    a: "Every opportunity is reviewed for legitimacy and clarity before publishing — real organization, real deadline, real point of contact.",
  },
  {
    q: "Can I apply from outside Africa?",
    a: "Absolutely. nia is built for African talent wherever they're based, including the diaspora, and for remote-friendly roles from any location.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden text-black">
      <header className="grain relative isolate bg-[#0a0a0a] text-white">
        <div className="absolute inset-0 soft-grid opacity-[0.15]" />
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-white/[0.04] blur-3xl" />

        <SiteNav variant="dark" />

        <section className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:pb-28 lg:pt-20">
          <Reveal className="flex flex-col justify-center">
            <div>
            <span className="mb-6 inline-flex w-fit rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md">
              Opportunities for African talent
            </span>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.03] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Your career, taken seriously.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-300">
              Jobs, internships, scholarships, and fellowships for ambitious talent across Africa —
              vetted, organized, and tracked in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/opportunities" className="btn-primary bg-white text-black hover:bg-zinc-200">
                Explore opportunities
              </Link>
              <Link href="/register" className="btn-ghost-dark">
                Create your profile
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg gap-4 sm:grid-cols-3">
              <div className="glass-panel-dark rounded-2xl px-4 py-4 text-left">
                <p className="text-2xl font-bold text-white">1,200+</p>
                <p className="mt-1 text-xs text-zinc-400">Opportunities listed</p>
              </div>
              <div className="glass-panel-dark rounded-2xl px-4 py-4 text-left">
                <p className="text-2xl font-bold text-white">320</p>
                <p className="mt-1 text-xs text-zinc-400">Partner organizations</p>
              </div>
              <div className="glass-panel-dark rounded-2xl px-4 py-4 text-left">
                <p className="text-2xl font-bold text-white">54</p>
                <p className="mt-1 text-xs text-zinc-400">Countries reached</p>
              </div>
            </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="flex items-center justify-center">
            <div className="orbit-scene w-full max-w-md">
              <div className="orbit-ring" />
              <div className="orbit-ring ring-2" />
              <div className="orbit-ring ring-3" />
              <div className="orbit-core" />

              <div className="orbit-spin" style={{ animationDuration: "26s" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "rotate(-40deg) translateX(min(42vw,190px))" }}>
                  <span
                    className="orbit-badge"
                    style={{ animation: "orbit-counter-spin 26s linear infinite" }}
                  >
                    Internship · Lagos
                  </span>
                </div>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "rotate(150deg) translateX(min(42vw,190px))" }}>
                  <span
                    className="orbit-badge"
                    style={{ animation: "orbit-counter-spin 26s linear infinite" }}
                  >
                    Fellowship · Remote
                  </span>
                </div>
              </div>

              <div className="orbit-spin reverse" style={{ animationDuration: "34s" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "rotate(60deg) translateX(min(30vw,135px))" }}>
                  <span
                    className="orbit-badge"
                    style={{ animation: "orbit-counter-spin-reverse 34s linear infinite" }}
                  >
                    Junior Engineer
                  </span>
                </div>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "rotate(250deg) translateX(min(30vw,135px))" }}>
                  <span
                    className="orbit-badge"
                    style={{ animation: "orbit-counter-spin-reverse 34s linear infinite" }}
                  >
                    Scholarship
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Social proof marquee */}
        <div className="relative z-10 border-t border-white/10 py-8">
          <p className="mx-auto mb-5 max-w-7xl px-6 text-center text-xs uppercase tracking-[0.25em] text-zinc-500 lg:px-10">
            Opportunities sourced from organizations like
          </p>
          <div className="overflow-hidden">
            <div className="marquee-track">
              {[...partnerLogos, ...partnerLogos].map((name, index) => (
                <span
                  key={`${name}-${index}`}
                  className="mx-8 shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight text-zinc-500"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">Why nia</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-5xl">
              Built to move careers forward.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {featureCards.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 120}>
              <div className="glass-panel-strong hover-lift rounded-[1.75rem] p-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-black text-lg text-white">
                  •
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-base leading-7 text-zinc-600">{feature.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-[#111111] py-20 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-zinc-400">Trending</p>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-5xl">Fresh opportunities</h2>
              </div>

              <Link href="/opportunities" className="text-sm font-medium text-zinc-300 transition hover:text-white">
                Browse all →
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            {opportunities.slice(0, 3).map((opportunity, index) => (
              <Reveal key={opportunity.id} delay={index * 120}>
                <article className="hover-lift rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-lg">
                  <p className="text-sm text-zinc-400">{opportunity.organization}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">{opportunity.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-300">
                    <span className="rounded-full border border-white/10 px-2.5 py-1">{opportunity.type}</span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1">{opportunity.location}</span>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-zinc-300">{opportunity.description}</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Deadline</span>
                    <span className="text-sm text-zinc-200">{opportunity.deadline}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <Reveal>
            <div className="glass-panel-strong rounded-[2rem] p-8">
              <p className="eyebrow">For talent</p>
              <h3 className="mt-4 text-3xl font-bold tracking-[-0.05em]">Your profile, your momentum.</h3>
              <p className="mt-4 max-w-md text-zinc-600">
                Build a standout profile, save opportunities, and track every step toward your next role.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Personalized opportunity matching",
                  "Application tracking and reminders",
                  "Direct access to early-career programs",
                ].map((item) => (
                  <div key={item} className="hover-lift flex items-center gap-3 rounded-2xl border border-black/10 bg-white/80 px-4 py-3 text-sm font-medium text-black">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="rounded-[2rem] border border-black/10 bg-[#111111] p-8 text-white shadow-[0_25px_80px_rgba(17,17,17,0.25)]">
              <p className="eyebrow text-zinc-400">For employers</p>
              <h3 className="mt-4 text-3xl font-bold tracking-[-0.05em]">Hire with clarity.</h3>
              <p className="mt-4 max-w-md text-zinc-300">
                Discover relevant candidates and share impactful opportunities with the right communities.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Tailored candidate discovery",
                  "Verified talent communities",
                  "Efficient hiring workflows",
                ].map((item) => (
                  <div key={item} className="hover-lift flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs text-black">✓</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <Reveal>
          <div className="mb-10 max-w-2xl">
            <p className="eyebrow">Voices from the platform</p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-5xl">
              People are getting hired.
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 120}>
              <figure className="glass-panel-strong hover-lift flex h-full flex-col justify-between rounded-[1.75rem] p-7">
                <blockquote className="text-base leading-7 text-zinc-700">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-black/10 pt-4">
                  <p className="text-sm font-semibold text-black">{testimonial.name}</p>
                  <p className="text-xs text-zinc-600">{testimonial.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f2f1ee] py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal>
            <div className="mb-10 max-w-2xl">
              <p className="eyebrow">Questions</p>
              <h2 className="mt-3 text-3xl font-bold tracking-[-0.05em] sm:text-5xl">Frequently asked.</h2>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((item, index) => (
              <Reveal key={item.q} delay={index * 80}>
                <details className="faq-item group rounded-2xl border border-black/10 bg-white p-6">
                  <summary className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold text-black">{item.q}</span>
                    <span className="faq-icon text-xl text-zinc-500">+</span>
                  </summary>
                  <p className="mt-4 leading-7 text-zinc-600">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="grain relative overflow-hidden bg-[#0a0a0a] py-24 text-white">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl" />
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center lg:px-10">
          <div>
            <h2 className="text-3xl font-black tracking-[-0.05em] sm:text-5xl">
              Your next opportunity is already listed.
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              Create a profile in under two minutes and start tracking applications today.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-primary bg-white text-black hover:bg-zinc-200">
                Get started free
              </Link>
              <Link href="/opportunities" className="btn-ghost-dark">
                Browse opportunities
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
