export type GeoCountry = {
  /** ISO 3166-1 alpha-2 code. */
  code: string;
  name: string;
  /** What to label the region dropdown for this country — "State", "Region", "Province", "County", etc. */
  divisionLabel: string;
  divisions: string[];
};
