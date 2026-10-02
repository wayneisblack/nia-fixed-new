"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { clearApiToken } from "../lib/api";

const navLinks = [
  { href: "/opportunities", label: "Opportunities" },
  { href: "/favourites", label: "Favourites" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

export function SiteNav({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isDark = variant === "dark";
  const textColor = isDark ? "text-white" : "text-black";
  const mutedColor = isDark ? "text-zinc-300" : "text-zinc-600";

  return (
    <nav className={`relative z-30 border-b ${isDark ? "border-white/10" : "border-black/5"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link href="/" className={`text-2xl font-black tracking-tight ${textColor}`}>
          nia.
        </Link>

        <div className={`hidden items-center gap-8 text-sm md:flex ${mutedColor}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:${isDark ? "text-white" : "text-black"} ${
                pathname === link.href ? (isDark ? "text-white" : "text-black") : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" ? (
            <>
              <span className={`text-sm ${mutedColor}`}>{session.user?.name?.split(" ")[0] ?? "Account"}</span>
              <button
                type="button"
                onClick={() => { clearApiToken(); signOut({ callbackUrl: "/" }); }}
                className={isDark ? "btn-ghost-dark" : "btn-secondary"}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={isDark ? "btn-ghost-dark" : "btn-secondary"}>
                Log in
              </Link>
              <Link href="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className={`flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden`}
        >
          <span className={`block h-[1.5px] w-5 transition ${isDark ? "bg-white" : "bg-black"} ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-5 transition ${isDark ? "bg-white" : "bg-black"} ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open ? (
        <div className={`md:hidden ${isDark ? "bg-[#0d0d0d]" : "bg-white"} border-t ${isDark ? "border-white/10" : "border-black/5"} px-6 py-6`}>
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={`text-base ${textColor}`}>
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3">
              {status === "authenticated" ? (
                <button type="button" onClick={() => { clearApiToken(); signOut({ callbackUrl: "/" }); }} className="btn-secondary w-full">
                  Sign out
                </button>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="btn-secondary w-full">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="btn-primary w-full">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
