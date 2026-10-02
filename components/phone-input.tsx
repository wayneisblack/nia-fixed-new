"use client";

import { useMemo } from "react";
import { PHONE_COUNTRIES } from "../lib/phone-codes";
import { CountrySelect } from "./country-select";

export type PhoneValue = { dialCode: string; number: string };

const fieldBase =
  "w-full rounded-xl border border-black/15 bg-white px-3.5 py-3 text-sm text-black shadow-sm outline-none transition " +
  "hover:border-black/30 focus:border-black/50 focus:ring-4 focus:ring-black/10 placeholder:text-zinc-400";

export function PhoneInput({
  value,
  onChange,
}: {
  value: PhoneValue;
  onChange: (value: PhoneValue) => void;
}) {
  const options = useMemo(
    () =>
      PHONE_COUNTRIES.map((c) => ({
        key: c.code,
        value: c.dialCode,
        label: `${c.name} (${c.dialCode})`,
        prefix: c.flag,
      })),
    []
  );

  return (
    <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)] gap-3">
      <CountrySelect
        options={options}
        value={value.dialCode}
        onChange={(dialCode) => onChange({ ...value, dialCode })}
        placeholder="Code"
        ariaLabel="Country calling code"
      />
      <input
        type="tel"
        inputMode="tel"
        value={value.number}
        onChange={(e) => onChange({ ...value, number: e.target.value })}
        placeholder="Phone number"
        className={fieldBase}
      />
    </div>
  );
}
