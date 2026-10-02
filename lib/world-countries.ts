import { Country, State } from "country-state-city";
import type { GeoCountry } from "./geo-types";
export type { GeoCountry } from "./geo-types";

const COUNTRY_DIVISION_LABELS: Record<string, string> = {
  US: "State",
  CA: "Province",
  MX: "State",
  BR: "State",
  AR: "Province",
  CL: "Region",
  PE: "Department",
  CO: "Department",
  EC: "Province",
  BO: "Department",
  UY: "Department",
  PY: "Department",
  GB: "County",
  IE: "County",
  FR: "Department",
  ES: "Province",
  PT: "District",
  IT: "Province",
  DE: "State",
  NL: "Province",
  BE: "Province",
  CH: "Canton",
  AT: "State",
  PL: "Voivodeship",
  CZ: "Region",
  SK: "Region",
  HU: "County",
  RO: "County",
  BG: "Province",
  GR: "Region",
  TR: "Province",
  NG: "State",
  ZA: "Province",
  GH: "Region",
  KE: "County",
  UG: "Region",
  TZ: "Region",
  CM: "Region",
  SN: "Region",
  IN: "State",
  BD: "Division",
  NP: "Province",
  LK: "Province",
  PK: "Province",
  CN: "Province",
  JP: "Prefecture",
  KR: "Province",
  AU: "State",
  NZ: "Region",
  ID: "Province",
  MY: "State",
  SG: "Region",
  TH: "Province",
  VN: "Province",
  PH: "Region",
  SA: "Region",
  AE: "Emirate",
  EG: "Governorate",
  MA: "Region",
  DZ: "Province",
  TN: "Governorate",
  ML: "Region",
  MZ: "Province",
};

export const WORLD_COUNTRIES: GeoCountry[] = Country.getAllCountries()
  .map((country) => {
    const code = country.isoCode ?? "";
    const divisionLabel = COUNTRY_DIVISION_LABELS[code] ?? "Administrative area";
    const divisions = State.getStatesOfCountry(code)
      .map((state) => state.name)
      .filter((name): name is string => Boolean(name && name.trim()));

    return {
      code,
      name: country.name ?? "",
      divisionLabel,
      divisions,
    };
  })
  .filter((country): country is GeoCountry => Boolean(country.name && country.code));

export function findWorldCountry(name: string): GeoCountry | undefined {
  return WORLD_COUNTRIES.find((country) => country.name === name);
}
