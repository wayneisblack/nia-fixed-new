"use client";

import { useMemo, useRef, useState } from "react";
import { SKILL_CATEGORIES, searchSkills, isCatalogueSkill } from "../lib/skills";

export function SkillsPicker({
  value,
  onChange,
  onCustomSkillAdded,
}: {
  value: string[];
  onChange: (skills: string[]) => void;
  /** Fired when the user adds a skill that isn't in the catalogue — hook this up to log it for review. */
  onCustomSkillAdded?: (skill: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const addedTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function announceAdded(skill: string) {
    setJustAdded(skill);
    if (addedTimeout.current) clearTimeout(addedTimeout.current);
    addedTimeout.current = setTimeout(() => setJustAdded(null), 1400);
  }

  const results = useMemo(() => {
    const base = query.trim() ? searchSkills(query) : SKILL_CATEGORIES.find((c) => c.id === activeCategory)?.skills ?? SKILL_CATEGORIES.flatMap((c) => c.skills);
    return base;
  }, [query, activeCategory]);

  const showNoResults = query.trim().length > 0 && results.length === 0;
  const canAddCustom = query.trim().length > 1 && !isCatalogueSkill(query);

  function toggle(skill: string) {
    if (value.includes(skill)) {
      onChange(value.filter((s) => s !== skill));
    } else {
      onChange([...value, skill]);
      announceAdded(skill);
    }
  }

  function addCustomSkill() {
    const skill = query.trim();
    if (!skill || value.includes(skill)) return;
    onChange([...value, skill]);
    onCustomSkillAdded?.(skill);
    announceAdded(skill);
    setQuery("");
  }

  return (
    <div className="relative">
      {justAdded ? (
        <div className="toast-in pointer-events-none absolute -top-3 right-0 z-20 flex items-center gap-1.5 rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          <span className="toast-check">✓</span>
          {justAdded} added
        </div>
      ) : null}

      {/* Selected skills — pinned up top so removal is immediate and obvious */}
      {value.length > 0 ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {value.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggle(skill)}
              className="bubble-in group flex items-center gap-1.5 rounded-full bg-black px-3.5 py-2 text-xs font-medium text-white transition active:scale-95"
            >
              {skill}
              <span aria-hidden="true" className="text-zinc-400 transition group-hover:text-white">✕</span>
              <span className="sr-only">Remove {skill}</span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Search */}
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search skills — e.g. Graphic Design, Sales, Photography..."
          className="w-full rounded-2xl border border-black/10 bg-zinc-50 px-4 py-3 pl-11 text-sm outline-none transition focus:border-black/30"
        />
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Category filter — hidden while actively searching */}
      {!query.trim() ? (
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Skill categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === "all"}
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              activeCategory === "all" ? "border-black bg-black text-white" : "border-black/10 bg-white text-zinc-600 hover:border-black/25"
            }`}
          >
            All
          </button>
          {SKILL_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                activeCategory === category.id ? "border-black bg-black text-white" : "border-black/10 bg-white text-zinc-600 hover:border-black/25"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Results grid */}
      <div className="mt-5 flex flex-wrap gap-2">
        {results.map((skill, i) => {
          const selected = value.includes(skill);
          const popped = justAdded === skill;
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggle(skill)}
              aria-pressed={selected}
              style={{ animationDelay: `${Math.min(i, 14) * 25}ms` }}
              className={`skill-badge bubble-in relative overflow-visible rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${popped ? "card-pop" : ""} ${
                selected ? "border-black bg-black text-white" : "border-black/10 bg-white text-zinc-700"
              }`}
            >
              {popped ? <span className="ring-burst" style={{ borderColor: "rgba(0,0,0,0.9)" }} aria-hidden="true" /> : null}
              {selected ? "✓ " : ""}
              {skill}
            </button>
          );
        })}

        {showNoResults ? (
          <p className="bubble-in text-sm text-zinc-500">No matches for &quot;{query}&quot;.</p>
        ) : null}
      </div>

      {canAddCustom ? (
        <button
          type="button"
          onClick={addCustomSkill}
          className="bubble-in mt-3 flex items-center gap-2 rounded-full border border-dashed border-black/25 bg-zinc-50 px-4 py-2 text-xs font-medium text-zinc-700 transition hover:border-black/40 hover:bg-white"
        >
          <span aria-hidden="true">+</span> Can&apos;t find &quot;{query.trim()}&quot;? Add it
        </button>
      ) : null}
    </div>
  );
}
