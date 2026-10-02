"use client";

import type { ReactNode } from "react";

/**
 * Focuses the screen on one stage's content — used for the "big" onboarding
 * moments (identity, about, location, industry). Not used for every field;
 * lighter stages render their own compact layout instead.
 */
export function SpotlightField({
  eyebrow,
  title,
  description,
  children,
  cinematic = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  /** Extra-dramatic headline treatment (word-by-word reveal + shimmer) for the biggest moments. */
  cinematic?: boolean;
}) {
  const words = title.split(" ");

  return (
    <div key={title} className="stage-enter mx-auto w-full max-w-xl">
      <p className="step-fade eyebrow text-zinc-500" style={{ animationDelay: "80ms" }}>
        {eyebrow}
      </p>
      <h1 className={`mt-3 text-3xl font-black tracking-[-0.05em] sm:text-4xl ${cinematic ? "text-shimmer" : ""}`}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="word-in mr-[0.28em]" style={{ animationDelay: `${140 + i * 55}ms` }}>
            {word}
          </span>
        ))}
      </h1>
      {description ? (
        <p className="step-fade mt-3 text-zinc-500" style={{ animationDelay: `${140 + words.length * 55 + 80}ms` }}>
          {description}
        </p>
      ) : null}
      <div className="step-fade mt-8" style={{ animationDelay: `${140 + words.length * 55 + 160}ms` }}>
        {children}
      </div>
    </div>
  );
}
