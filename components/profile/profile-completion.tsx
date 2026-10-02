import Link from "next/link";
import type { CompletionResult } from "../../lib/onboarding";

export function ProfileCompletion({ completion, dark = false }: { completion: CompletionResult; dark?: boolean }) {
  const { percent, missing } = completion;

  return (
    <div className={`rounded-[1.75rem] p-6 ${dark ? "border border-white/10 bg-zinc-950 text-white" : "glass-panel-strong"}`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-semibold uppercase tracking-[0.15em] ${dark ? "text-zinc-400" : "text-zinc-500"}`}>Profile strength</p>
        <p className="text-sm font-bold">{percent}%</p>
      </div>
      <div className={`mt-3 h-2 w-full overflow-hidden rounded-full ${dark ? "bg-white/10" : "bg-black/10"}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ${dark ? "bg-white" : "bg-black"}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {missing.length > 0 ? (
        <div className="mt-4 space-y-1.5">
          {missing.slice(0, 4).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                dark ? "text-zinc-300 hover:bg-white/5 hover:text-white" : "text-zinc-600 hover:bg-black/5 hover:text-black"
              }`}
            >
              <span>{item.label}</span>
              <span className="text-xs opacity-60">+{item.weight}%</span>
            </Link>
          ))}
        </div>
      ) : (
        <p className={`mt-4 text-sm ${dark ? "text-zinc-400" : "text-zinc-500"}`}>Your profile is fully filled out.</p>
      )}
    </div>
  );
}
