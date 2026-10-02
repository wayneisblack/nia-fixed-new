"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export type CountrySelectOption = {
  /** Stable key, e.g. ISO code. */
  key: string;
  /** What gets passed to onChange and matched against value. */
  value: string;
  label: string;
  /** Optional leading glyph (flag emoji) or short secondary text (dial code). */
  prefix?: string;
};

/**
 * Searchable combobox for long lists (countries, phone codes). Native
 * <select> elements support keyboard type-ahead but not a real search box —
 * this renders a text input + filtered listbox instead, so ~195 countries
 * never have to be scrolled through blindly.
 */
export function CountrySelect({
  options,
  value,
  onChange,
  placeholder = "Search country...",
  disabled = false,
  ariaLabel = "Country",
}: {
  options: CountrySelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function updateQuery(next: string) {
    setQuery(next);
    setHighlighted(0);
  }

  function commit(option: CountrySelectOption) {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filtered[highlighted];
      if (option) commit(option);
    } else if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
          setHighlighted(0);
          requestAnimationFrame(() => inputRef.current?.focus());
        }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-3.5 py-3 text-left text-sm shadow-sm outline-none transition ${
          disabled
            ? "cursor-not-allowed border-black/10 bg-zinc-100 text-zinc-400"
            : "border-black/15 text-black hover:border-black/30 focus:border-black/50 focus:ring-4 focus:ring-black/10"
        }`}
      >
        <span className={`truncate ${selected ? "text-black" : "text-zinc-500"}`}>
          {selected ? (
            <>
              {selected.prefix ? <span className="mr-1.5">{selected.prefix}</span> : null}
              {selected.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-zinc-500">
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>

      {open ? (
        <div className="bubble-in absolute z-40 mt-1.5 w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-xl">
          <div className="border-b border-black/5 p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => updateQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search..."
              className="w-full rounded-lg border border-black/10 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-black/30"
            />
          </div>
          <ul role="listbox" aria-label={ariaLabel} className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3.5 py-3 text-sm text-zinc-400">No matches.</li>
            ) : (
              filtered.map((option, i) => (
                <li key={option.key}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={option.value === value}
                    onMouseEnter={() => setHighlighted(i)}
                    onClick={() => commit(option)}
                    className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition ${
                      i === highlighted ? "bg-zinc-100" : ""
                    } ${option.value === value ? "font-medium text-black" : "text-zinc-700"}`}
                  >
                    {option.prefix ? <span>{option.prefix}</span> : null}
                    <span className="truncate">{option.label}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
