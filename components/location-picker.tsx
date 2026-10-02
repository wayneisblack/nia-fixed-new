"use client";

import { useMemo, type CSSProperties } from "react";
import type { GeoCountry } from "../lib/geo-types";
import { CountrySelect } from "./country-select";

export type LocationValue = {
  country: string;
  region: string;
  city: string;
};

// `color-scheme: light` is the standards-based way to make a native
// <select>'s dropdown popup render with light OS/browser chrome (dark text
// on a light list) regardless of the visitor's OS/browser dark-mode setting.
// Without it, a user with OS-level dark mode gets a browser-themed dark
// popup here even though the closed control and every option string are
// styled for a light surface — that mismatch is what makes native selects
// unreliable to restyle. This is a real CSS property (not a hack or a
// dependency), so it stays robust across Chrome/Firefox/Safari/Edge.
const nativeControlStyle: CSSProperties = { colorScheme: "light" };

const fieldBase =
  "w-full appearance-none rounded-xl border bg-white px-3.5 py-3 text-sm shadow-sm outline-none transition " +
  "border-black/15 text-black " +
  "hover:border-black/30 " +
  "focus:border-black/50 focus:ring-4 focus:ring-black/10 " +
  "disabled:cursor-not-allowed disabled:border-black/10 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:shadow-none disabled:hover:border-black/10";

/** Dims placeholder-state text on a <select> — native selects don't have a real ::placeholder, so this is done by hand based on value. */
function selectTextClass(hasValue: boolean) {
  return hasValue ? "text-black" : "text-zinc-500";
}

function Chevron({ disabled }: { disabled?: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 ${disabled ? "text-zinc-300" : "text-zinc-500"}`}
    >
      <path d="m5 7.5 5 5 5-5" />
    </svg>
  );
}

export function LocationPicker({
  countries,
  value,
  onChange,
}: {
  countries: GeoCountry[];
  value: LocationValue;
  onChange: (value: LocationValue) => void;
}) {
  const selectedCountry = countries.find((c) => c.name === value.country);
  // Some places (Vatican City, Puerto Rico, and a number of territories) genuinely
  // have no first-level subdivision in the dataset — for those, region isn't
  // offered as a control at all rather than forcing a fake "N/A" selection.
  const hasDivisions = Boolean(selectedCountry && selectedCountry.divisions.length > 0);

  const countryOptions = useMemo(
    () => countries.map((country) => ({ key: country.code, value: country.name, label: country.name })),
    [countries]
  );

  function handleCountryChange(countryName: string) {
    onChange({ country: countryName, region: "", city: value.city });
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-700">Country</label>
        <CountrySelect options={countryOptions} value={value.country} onChange={handleCountryChange} placeholder="Search country..." ariaLabel="Country" />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-700">{selectedCountry?.divisionLabel ?? "Region"}</label>
        {selectedCountry && !hasDivisions ? (
          <div className="flex h-[46px] items-center rounded-xl border border-dashed border-black/15 bg-zinc-50 px-3.5 text-sm text-zinc-400">
            Not applicable
          </div>
        ) : (
          <div className="relative">
            <select
              value={value.region}
              onChange={(e) => onChange({ ...value, region: e.target.value })}
              disabled={!selectedCountry}
              style={nativeControlStyle}
              className={`${fieldBase} pr-9 ${selectTextClass(Boolean(value.region))}`}
              aria-label={selectedCountry?.divisionLabel ?? "Region"}
            >
              <option value="" className="text-zinc-500">
                {selectedCountry ? `Select ${selectedCountry.divisionLabel.toLowerCase()}` : "Select country first"}
              </option>
              {selectedCountry?.divisions.map((division) => (
                <option key={division} value={division} className="text-black">
                  {division}
                </option>
              ))}
            </select>
            <Chevron disabled={!selectedCountry} />
          </div>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium text-zinc-700">City / Place</label>
        <input
          value={value.city}
          onChange={(e) => onChange({ ...value, city: e.target.value })}
          placeholder="e.g. Ikeja"
          disabled={!selectedCountry}
          className={`${fieldBase} placeholder:text-zinc-400`}
        />
      </div>
    </div>
  );
}
