"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";
import { apiUrl, setApiToken } from "../../lib/api";

type Role = "talent" | "employer";

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("talent");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Footer's "For employers" link (and any other deep link) can pre-select
  // the employer path via ?role=employer. Done in an effect (not a lazy
  // useState initializer) so the server-rendered HTML and the first client
  // render match — window.location isn't available during SSR.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (params.get("role") === "employer") setRole("employer");
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!name || !email || password.length < 8) {
      setError("Please fill in your name, email, and an 8+ character password.");
      return;
    }
    if (role === "employer" && !String(form.get("companyName") ?? "").trim()) {
      setError("Company name is required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, companyName: form.get("companyName") }),
      });

      // The server should always return JSON, but guard against an
      // unexpected non-JSON response (e.g. a crash page) so this never
      // throws an unhandled error — the person just sees a clear message.
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.error ?? `Something went wrong (${response.status}). Please try again.`);
        setLoading(false);
        return;
      }

      try {
        const loginResponse = await fetch(apiUrl("/api/auth/login"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginPayload = await loginResponse.json().catch(() => null);
        if (loginPayload?.data?.token) setApiToken(loginPayload.data.token);
      } catch {
        // NextAuth remains the session fallback while the Spring service is introduced.
      }

      // Registration only creates the account — onboarding (roadmap, not a
      // form) is where the rest of the profile gets built.
      await signIn("credentials", { email, password, callbackUrl: "/onboarding" });
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  }

  return (
    <main className="grain relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-12 text-white">
      <div className="aurora-layer" />
      <div className="orb-float-a pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-white/[0.07] blur-3xl" />
      <div className="orb-float-b pointer-events-none absolute -right-24 bottom-24 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="sheen-sweep" />

      <form
        onSubmit={handleSubmit}
        className="premium-shadow stage-enter relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10"
      >
        <Link href="/" className="text-2xl font-black tracking-tight">
          nia.
        </Link>

        <p className="step-fade eyebrow mt-10 text-zinc-500" style={{ animationDelay: "120ms" }}>Your opportunity journey</p>
        <h1 className="text-shimmer mt-3 text-4xl font-black tracking-[-0.06em]">
          {"Create your account".split(" ").map((word, i) => (
            <span key={word} className="word-in mr-[0.28em]" style={{ animationDelay: `${180 + i * 60}ms` }}>
              {word}
            </span>
          ))}
        </h1>
        <p className="step-fade mt-3 text-sm text-zinc-400" style={{ animationDelay: "420ms" }}>
          Just the basics for now — you&apos;ll build your full profile next.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
          <button
            type="button"
            role="radio"
            aria-checked={role === "talent"}
            onClick={() => setRole("talent")}
            className={`rounded-2xl border px-4 py-3.5 text-left transition ${
              role === "talent" ? "border-white bg-white text-black" : "border-white/15 bg-white/5 text-white hover:border-white/35"
            }`}
          >
            <p className="text-sm font-semibold">I&apos;m looking for opportunities</p>
            <p className={`mt-1 text-xs ${role === "talent" ? "text-zinc-600" : "text-zinc-400"}`}>Jobs, internships, fellowships</p>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={role === "employer"}
            onClick={() => setRole("employer")}
            className={`rounded-2xl border px-4 py-3.5 text-left transition ${
              role === "employer" ? "border-white bg-white text-black" : "border-white/15 bg-white/5 text-white hover:border-white/35"
            }`}
          >
            <p className="text-sm font-semibold">I&apos;m hiring talent</p>
            <p className={`mt-1 text-xs ${role === "employer" ? "text-zinc-600" : "text-zinc-400"}`}>Post roles, find candidates</p>
          </button>
        </div>

        <div className="mt-6 space-y-5">
          <input
            name="name"
            required
            placeholder={role === "employer" ? "Your full name" : "Full name"}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
          />
          {role === "employer" ? (
            <input
              name="companyName"
              required
              placeholder="Company name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
            />
          ) : null}
          <input
            name="email"
            type="email"
            required
            placeholder="Email address"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
          />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Password (8+ characters)"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
          />
        </div>

        {error ? <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p> : null}

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full bg-white text-black hover:bg-zinc-200">
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-white underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
