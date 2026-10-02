import Link from "next/link";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Opportunities", href: "/opportunities" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "For employers", href: "/register?role=employer" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "mailto:niatalentfactory@gmail.com" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <p className="text-2xl font-black tracking-tight">nia.</p>
            <p className="mt-4 max-w-xs text-sm leading-6 text-zinc-400">
              The opportunity layer for African talent — jobs, internships, scholarships, and fellowships,
              in one place.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="eyebrow text-zinc-500">{column.title}</p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-zinc-300 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} nia. All rights reserved.</p>
          <p>Built for ambitious talent across the continent.</p>
        </div>
      </div>
    </footer>
  );
}
