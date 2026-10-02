import { Country } from "country-state-city";

export type PhoneCountry = {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  dialCode: string; // e.g. "+234"
  flag: string;
};

/**
 * Reuses the same country-state-city dataset as lib/world-countries.ts so
 * calling codes never drift out of sync with the country list used
 * elsewhere. Built once at module load, not duplicated per component.
 */
export const PHONE_COUNTRIES: PhoneCountry[] = Country.getAllCountries()
  .map((country) => {
    const raw = (country.phonecode ?? "").trim();
    if (!raw) return null;
    const dialCode = raw.startsWith("+") ? raw : `+${raw}`;
    return {
      code: country.isoCode ?? "",
      name: country.name ?? "",
      dialCode,
      flag: country.flag ?? "",
    };
  })
  .filter((c): c is PhoneCountry => Boolean(c && c.code && c.name))
  .sort((a, b) => a.name.localeCompare(b.name));

export function findPhoneCountryByCode(code: string): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((c) => c.code === code);
}

export function findPhoneCountryByDialCode(dialCode: string): PhoneCountry | undefined {
  return PHONE_COUNTRIES.find((c) => c.dialCode === dialCode);
}

/** Loose validation: digits/spaces/dashes only, 4–14 digits — avoids being unnecessarily restrictive across countries. */
export function isPlausiblePhoneNumber(value: string): boolean {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length >= 4 && digits.length <= 14;
}
