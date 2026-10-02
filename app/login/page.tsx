"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { apiUrl, setApiToken } from "../../lib/api";

function LoginForm() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");
    let backendUnavailable = false;
    try {
      const backendResponse = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const backendPayload = await backendResponse.json().catch(() => null);
      if (!backendResponse.ok) {
        setError(backendPayload?.error ?? "Invalid email or password.");
        setLoading(false);
        return;
      }
      if (backendPayload?.data?.token) setApiToken(backendPayload.data.token);
    } catch {
      backendUnavailable = true;
    }

    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) setError("Invalid email or password.");
    else router.push(callbackUrl);
    if (backendUnavailable && !result?.error) window.localStorage.removeItem("nia-api-token");
    setLoading(false);
  }

  return (
    <main className="grain relative flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 text-white">
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/[0.05] blur-3xl" />
      <div className="absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="premium-shadow relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10"
      >
        <Link href="/" className="text-2xl font-black tracking-tight">
          nia.
        </Link>
        <p className="eyebrow mt-12 text-zinc-500">Your opportunity journey</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.06em]">Welcome back</h1>

        <div className="mt-8 space-y-5">
          <input
            name="email"
            required
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
          />
          <input
            name="password"
            required
            type="password"
            minLength={8}
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/40"
          />
        </div>

        {error ? (
          <p className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : null}

        <button type="submit" disabled={loading} className="btn-primary mt-6 w-full bg-white text-black hover:bg-zinc-200">
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="mt-6 text-center text-sm text-zinc-400">
          New to nia? <Link href="/register" className="font-semibold text-white underline">Create an account</Link>
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
