/**
 * Africa geographic dataset — country → first-level administrative division.
 *
 * Scope: all 54 UN-member African states. City/place is intentionally left
 * as free text everywhere (per the location system spec) since a complete
 * city-level dataset isn't practical to maintain by hand.
 *
 * `divisionLabel` is the correct local term for that country's first-level
 * subdivision (State, Region, Province, County, Governorate, Wilaya, etc.)
 * — countries genuinely differ here, so this isn't just "State" everywhere.
 *
 * A few countries have subdivisions that change relatively often (Ethiopia
 * restructured regions in 2023; South Sudan's state count has moved between
 * 10 and 32 since 2015 before settling back at 10 in 2020; Somalia's federal
 * member states solidified only in 2024–2025). Those are accurate as of
 * this writing but are the ones most worth re-checking periodically —
 * everything else here (Nigeria's states, Kenya's counties, South Africa's
 * provinces, etc.) has been stable for a long time and isn't likely to
 * shift.
 */

import type { GeoCountry } from "./geo-types";
export type { GeoCountry } from "./geo-types";

export const AFRICAN_COUNTRIES: GeoCountry[] = [
  {
    code: "DZ",
    name: "Algeria",
    divisionLabel: "Province",
    divisions: [
      "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra", "Béchar", "Blida", "Bouira",
      "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda",
      "Skikda", "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem", "M'Sila", "Mascara",
      "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj", "Boumerdès", "El Tarf", "Tindouf",
      "Tissemsilt", "El Oued", "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
      "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Béni Abbès", "In Salah",
      "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Menia",
    ],
  },
  {
    code: "AO",
    name: "Angola",
    divisionLabel: "Province",
    divisions: [
      "Bengo", "Benguela", "Bié", "Cabinda", "Cuando Cubango", "Cuanza Norte", "Cuanza Sul", "Cunene", "Huambo",
      "Huíla", "Luanda", "Lunda Norte", "Lunda Sul", "Malanje", "Moxico", "Namibe", "Uíge", "Zaire",
    ],
  },
  {
    code: "BJ",
    name: "Benin",
    divisionLabel: "Department",
    divisions: [
      "Alibori", "Atacora", "Atlantique", "Borgou", "Collines", "Couffo", "Donga", "Littoral", "Mono", "Ouémé",
      "Plateau", "Zou",
    ],
  },
  {
    code: "BW",
    name: "Botswana",
    divisionLabel: "District",
    divisions: [
      "Central", "Ghanzi", "Kgalagadi", "Kgatleng", "Kweneng", "North East", "North West", "South East",
      "Southern", "Gaborone", "Francistown", "Lobatse", "Selibe Phikwe", "Jwaneng", "Sowa Town",
    ],
  },
  {
    code: "BF",
    name: "Burkina Faso",
    divisionLabel: "Region",
    divisions: [
      "Boucle du Mouhoun", "Cascades", "Centre", "Centre-Est", "Centre-Nord", "Centre-Ouest", "Centre-Sud",
      "Est", "Hauts-Bassins", "Nord", "Plateau-Central", "Sahel", "Sud-Ouest",
    ],
  },
  {
    code: "BI",
    name: "Burundi",
    divisionLabel: "Province",
    divisions: [
      "Bubanza", "Bujumbura Mairie", "Bujumbura Rural", "Bururi", "Cankuzo", "Cibitoke", "Gitega", "Karuzi",
      "Kayanza", "Kirundo", "Makamba", "Muramvya", "Muyinga", "Mwaro", "Ngozi", "Rumonge", "Rutana", "Ruyigi",
    ],
  },
  {
    code: "CV",
    name: "Cabo Verde",
    divisionLabel: "Municipality",
    divisions: [
      "Boa Vista", "Brava", "Maio", "Mosteiros", "Paul", "Porto Novo", "Praia", "Ribeira Brava", "Ribeira Grande",
      "Ribeira Grande de Santiago", "Sal", "Santa Catarina", "Santa Catarina do Fogo", "Santa Cruz", "São Domingos",
      "São Filipe", "São Lourenço dos Órgãos", "São Miguel", "São Salvador do Mundo", "São Vicente", "Tarrafal",
      "Tarrafal de São Nicolau",
    ],
  },
  {
    code: "CM",
    name: "Cameroon",
    divisionLabel: "Region",
    divisions: [
      "Adamawa", "Centre", "East", "Far North", "Littoral", "North", "Northwest", "South", "Southwest", "West",
    ],
  },
  {
    code: "CF",
    name: "Central African Republic",
    divisionLabel: "Prefecture",
    divisions: [
      "Bamingui-Bangoran", "Bangui", "Basse-Kotto", "Haute-Kotto", "Haut-Mbomou", "Kémo", "Lobaye", "Mambéré-Kadéï",
      "Mbomou", "Nana-Grébizi", "Nana-Mambéré", "Ombella-M'Poko", "Ouaka", "Ouham", "Ouham-Pendé", "Sangha-Mbaéré",
      "Vakaga", "Volo",
    ],
  },
  {
    code: "TD",
    name: "Chad",
    divisionLabel: "Region",
    divisions: [
      "Bahr el Gazel", "Batha", "Borkou", "Chari-Baguirmi", "Ennedi Est", "Ennedi Ouest", "Guéra", "Hadjer-Lamis",
      "Kanem", "Lac", "Logone Occidental", "Logone Oriental", "Mandoul", "Mayo-Kebbi Est", "Mayo-Kebbi Ouest",
      "Moyen-Chari", "N'Djamena", "Ouaddaï", "Salamat", "Sila", "Tandjilé", "Tibesti", "Wadi Fira",
    ],
  },
  {
    code: "KM",
    name: "Comoros",
    divisionLabel: "Island",
    divisions: ["Grande Comore (Ngazidja)", "Anjouan (Nzwani)", "Mohéli (Mwali)"],
  },
  {
    code: "CG",
    name: "Congo",
    divisionLabel: "Department",
    divisions: [
      "Bouenza", "Brazzaville", "Cuvette", "Cuvette-Ouest", "Kouilou", "Lékoumou", "Likouala", "Niari", "Plateaux",
      "Pointe-Noire", "Pool", "Sangha",
    ],
  },
  {
    code: "CD",
    name: "Democratic Republic of the Congo",
    divisionLabel: "Province",
    divisions: [
      "Bas-Uele", "Équateur", "Haut-Katanga", "Haut-Lomami", "Haut-Uele", "Ituri", "Kasaï", "Kasaï-Central",
      "Kasaï-Oriental", "Kinshasa", "Kongo Central", "Kwango", "Kwilu", "Lomami", "Lualaba", "Mai-Ndombe",
      "Maniema", "Mongala", "Nord-Kivu", "Nord-Ubangi", "Sankuru", "Sud-Kivu", "Sud-Ubangi", "Tanganyika",
      "Tshopo", "Tshuapa",
    ],
  },
  {
    code: "CI",
    name: "Ivory Coast",
    divisionLabel: "Region",
    divisions: [
      "Abidjan", "Agnéby-Tiassa", "Bafing", "Bagoué", "Bélier", "Béré", "Bounkani", "Cavally", "Folon", "Gbêkê",
      "Gbôklé", "Gôh", "Gontougo", "Grands-Ponts", "Guémon", "Hambol", "Haut-Sassandra", "Iffou", "Indénié-Djuablin",
      "Kabadougou", "Lôh-Djiboua", "Marahoué", "Moronou", "Nawa", "N'Zi", "Poro", "San-Pédro", "Sud-Comoé",
      "Tchologo", "Tonkpi", "Worodougou", "Yamoussoukro",
    ],
  },
  {
    code: "DJ",
    name: "Djibouti",
    divisionLabel: "Region",
    divisions: ["Djibouti", "Ali Sabieh", "Arta", "Dikhil", "Obock", "Tadjourah"],
  },
  {
    code: "EG",
    name: "Egypt",
    divisionLabel: "Governorate",
    divisions: [
      "Alexandria", "Aswan", "Asyut", "Beheira", "Beni Suef", "Cairo", "Dakahlia", "Damietta", "Faiyum",
      "Gharbia", "Giza", "Ismailia", "Kafr El Sheikh", "Luxor", "Matrouh", "Minya", "Monufia", "New Valley",
      "North Sinai", "Port Said", "Qalyubia", "Qena", "Red Sea", "Sharqia", "Sohag", "South Sinai", "Suez",
    ],
  },
  {
    code: "GQ",
    name: "Equatorial Guinea",
    divisionLabel: "Province",
    divisions: [
      "Annobón", "Bioko Norte", "Bioko Sur", "Centro Sur", "Kié-Ntem", "Litoral", "Wele-Nzas",
    ],
  },
  {
    code: "ER",
    name: "Eritrea",
    divisionLabel: "Region",
    divisions: ["Anseba", "Debub", "Gash-Barka", "Maekel", "Northern Red Sea", "Southern Red Sea"],
  },
  {
    code: "SZ",
    name: "Eswatini",
    divisionLabel: "Region",
    divisions: ["Hhohho", "Lubombo", "Manzini", "Shiselweni"],
  },
  {
    code: "ET",
    name: "Ethiopia",
    divisionLabel: "Region",
    divisions: [
      "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Central Ethiopia", "Dire Dawa", "Gambela", "Harari",
      "Oromia", "Sidama", "Somali", "South Ethiopia", "South West Ethiopia Peoples'", "Tigray",
    ],
  },
  {
    code: "GA",
    name: "Gabon",
    divisionLabel: "Province",
    divisions: [
      "Estuaire", "Haut-Ogooué", "Moyen-Ogooué", "Ngounié", "Nyanga", "Ogooué-Ivindo", "Ogooué-Lolo",
      "Ogooué-Maritime", "Woleu-Ntem",
    ],
  },
  {
    code: "GM",
    name: "Gambia",
    divisionLabel: "Division",
    divisions: ["Banjul", "Central River", "Lower River", "North Bank", "Upper River", "West Coast"],
  },
  {
    code: "GH",
    name: "Ghana",
    divisionLabel: "Region",
    divisions: [
      "Ahafo", "Ashanti", "Bono", "Bono East", "Central", "Eastern", "Greater Accra", "North East", "Northern",
      "Oti", "Savannah", "Upper East", "Upper West", "Volta", "Western", "Western North",
    ],
  },
  {
    code: "GN",
    name: "Guinea",
    divisionLabel: "Region",
    divisions: ["Boké", "Conakry", "Faranah", "Kankan", "Kindia", "Labé", "Mamou", "N'Zérékoré"],
  },
  {
    code: "GW",
    name: "Guinea-Bissau",
    divisionLabel: "Region",
    divisions: [
      "Bafatá", "Biombo", "Bissau", "Bolama", "Cacheu", "Gabú", "Oio", "Quinara", "Tombali",
    ],
  },
  {
    code: "KE",
    name: "Kenya",
    divisionLabel: "County",
    divisions: [
      "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera", "Marsabit",
      "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga",
      "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo-Marakwet",
      "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho", "Bomet", "Kakamega", "Vihiga",
      "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi",
    ],
  },
  {
    code: "LS",
    name: "Lesotho",
    divisionLabel: "District",
    divisions: [
      "Berea", "Butha-Buthe", "Leribe", "Mafeteng", "Maseru", "Mohale's Hoek", "Mokhotlong", "Qacha's Nek",
      "Quthing", "Thaba-Tseka",
    ],
  },
  {
    code: "LR",
    name: "Liberia",
    divisionLabel: "County",
    divisions: [
      "Bomi", "Bong", "Gbarpolu", "Grand Bassa", "Grand Cape Mount", "Grand Gedeh", "Grand Kru", "Lofa",
      "Margibi", "Maryland", "Montserrado", "Nimba", "River Cess", "River Gee", "Sinoe",
    ],
  },
  {
    code: "LY",
    name: "Libya",
    divisionLabel: "District",
    divisions: [
      "Butnan", "Derna", "Al Jabal al Akhdar", "Al Marj", "Benghazi", "Al Wahat", "Kufra", "Ajdabiya", "Sirte",
      "Misrata", "Murqub", "Jafara", "Tripoli", "Zawiya", "Nuqat al Khams", "Jabal al Gharbi", "Nalut", "Wadi al Shatii",
      "Jufra", "Sabha", "Wadi al Hayaa", "Murzuq", "Ghat",
    ],
  },
  {
    code: "MG",
    name: "Madagascar",
    divisionLabel: "Province",
    divisions: ["Antananarivo", "Antsiranana", "Fianarantsoa", "Mahajanga", "Toamasina", "Toliara"],
  },
  {
    code: "MW",
    name: "Malawi",
    divisionLabel: "District",
    divisions: [
      "Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa", "Dedza", "Dowa", "Karonga", "Kasungu", "Likoma",
      "Lilongwe", "Machinga", "Mangochi", "Mchinji", "Mulanje", "Mwanza", "Mzimba", "Neno", "Nkhata Bay",
      "Nkhotakota", "Nsanje", "Ntcheu", "Ntchisi", "Phalombe", "Rumphi", "Salima", "Thyolo", "Zomba",
    ],
  },
  {
    code: "ML",
    name: "Mali",
    divisionLabel: "Region",
    divisions: [
      "Bamako", "Gao", "Kayes", "Kidal", "Koulikoro", "Ménaka", "Mopti", "Ségou", "Sikasso", "Taoudénit", "Tombouctou",
    ],
  },
  {
    code: "MR",
    name: "Mauritania",
    divisionLabel: "Region",
    divisions: [
      "Adrar", "Assaba", "Brakna", "Dakhlet Nouadhibou", "Gorgol", "Guidimaka", "Hodh Ech Chargui", "Hodh El Gharbi",
      "Inchiri", "Nouakchott Nord", "Nouakchott Ouest", "Nouakchott Sud", "Tagant", "Tiris Zemmour", "Trarza",
    ],
  },
  {
    code: "MU",
    name: "Mauritius",
    divisionLabel: "District",
    divisions: [
      "Black River", "Flacq", "Grand Port", "Moka", "Pamplemousses", "Plaines Wilhems", "Port Louis", "Rivière du Rempart",
      "Savanne", "Rodrigues", "Agalega", "Saint Brandon",
    ],
  },
  {
    code: "MA",
    name: "Morocco",
    divisionLabel: "Region",
    divisions: [
      "Tanger-Tétouan-Al Hoceïma", "L'Oriental", "Fès-Meknès", "Rabat-Salé-Kénitra", "Béni Mellal-Khénifra",
      "Casablanca-Settat", "Marrakech-Safi", "Drâa-Tafilalet", "Souss-Massa", "Guelmim-Oued Noun",
      "Laâyoune-Sakia El Hamra", "Dakhla-Oued Ed-Dahab",
    ],
  },
  {
    code: "MZ",
    name: "Mozambique",
    divisionLabel: "Province",
    divisions: [
      "Cabo Delgado", "Gaza", "Inhambane", "Manica", "Maputo Province", "Maputo City", "Nampula", "Niassa",
      "Sofala", "Tete", "Zambézia",
    ],
  },
  {
    code: "NA",
    name: "Namibia",
    divisionLabel: "Region",
    divisions: [
      "Erongo", "Hardap", "Karas", "Kavango East", "Kavango West", "Khomas", "Kunene", "Ohangwena", "Omaheke",
      "Omusati", "Oshana", "Oshikoto", "Otjozondjupa", "Zambezi",
    ],
  },
  {
    code: "NE",
    name: "Niger",
    divisionLabel: "Region",
    divisions: ["Agadez", "Diffa", "Dosso", "Maradi", "Niamey", "Tahoua", "Tillabéri", "Zinder"],
  },
  {
    code: "NG",
    name: "Nigeria",
    divisionLabel: "State",
    divisions: [
      "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta",
      "Ebonyi", "Edo", "Ekiti", "Enugu", "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
      "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
      "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
    ],
  },
  {
    code: "RW",
    name: "Rwanda",
    divisionLabel: "Province",
    divisions: ["Kigali", "Eastern", "Northern", "Southern", "Western"],
  },
  {
    code: "ST",
    name: "São Tomé and Príncipe",
    divisionLabel: "District",
    divisions: ["Água Grande", "Cantagalo", "Caué", "Lembá", "Lobata", "Mé-Zóchi", "Príncipe"],
  },
  {
    code: "SN",
    name: "Senegal",
    divisionLabel: "Region",
    divisions: [
      "Dakar", "Diourbel", "Fatick", "Kaffrine", "Kaolack", "Kédougou", "Kolda", "Louga", "Matam", "Saint-Louis",
      "Sédhiou", "Tambacounda", "Thiès", "Ziguinchor",
    ],
  },
  {
    code: "SC",
    name: "Seychelles",
    divisionLabel: "District",
    divisions: [
      "Anse Boileau", "Anse Etoile", "Anse Royale", "Au Cap", "Baie Lazare", "Baie Sainte Anne", "Beau Vallon",
      "Bel Air", "Bel Ombre", "Cascade", "English River", "Glacis", "Grand Anse Mahé", "Grand Anse Praslin",
      "La Digue", "La Rivière Anglaise", "Les Mamelles", "Mont Buxton", "Mont Fleuri", "Plaisance", "Pointe La Rue",
      "Port Glaud", "Roche Caiman", "Saint Louis", "Takamaka",
    ],
  },
  {
    code: "SL",
    name: "Sierra Leone",
    divisionLabel: "District",
    divisions: [
      "Bo", "Bombali", "Bonthe", "Falaba", "Kailahun", "Kambia", "Karene", "Kenema", "Koinadugu", "Kono",
      "Moyamba", "Port Loko", "Pujehun", "Tonkolili", "Western Area Rural", "Western Area Urban",
    ],
  },
  {
    code: "SO",
    name: "Somalia",
    divisionLabel: "Federal Member State",
    divisions: [
      "Banadir (Mogadishu)", "Galmudug", "Hirshabelle", "Jubaland", "North Eastern State", "Puntland",
      "South West State", "Somaliland",
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    divisionLabel: "Province",
    divisions: [
      "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape",
      "North West", "Western Cape",
    ],
  },
  {
    code: "SS",
    name: "South Sudan",
    divisionLabel: "State",
    divisions: [
      "Central Equatoria", "Eastern Equatoria", "Jonglei", "Lakes", "Northern Bahr el Ghazal", "Unity",
      "Upper Nile", "Warrap", "Western Bahr el Ghazal", "Western Equatoria",
    ],
  },
  {
    code: "SD",
    name: "Sudan",
    divisionLabel: "State",
    divisions: [
      "Blue Nile", "Central Darfur", "East Darfur", "Gedaref", "Gezira", "Kassala", "Khartoum", "North Darfur",
      "North Kordofan", "Northern", "Red Sea", "River Nile", "Sennar", "South Darfur", "South Kordofan",
      "West Darfur", "West Kordofan", "White Nile",
    ],
  },
  {
    code: "TZ",
    name: "Tanzania",
    divisionLabel: "Region",
    divisions: [
      "Arusha", "Dar es Salaam", "Dodoma", "Geita", "Iringa", "Kagera", "Katavi", "Kigoma", "Kilimanjaro", "Lindi",
      "Manyara", "Mara", "Mbeya", "Morogoro", "Mtwara", "Mwanza", "Njombe", "Pemba North", "Pemba South", "Pwani",
      "Rukwa", "Ruvuma", "Shinyanga", "Simiyu", "Singida", "Songwe", "Tabora", "Tanga", "Unguja North",
      "Unguja South", "Zanzibar Urban/West",
    ],
  },
  {
    code: "TG",
    name: "Togo",
    divisionLabel: "Region",
    divisions: ["Centrale", "Kara", "Maritime", "Plateaux", "Savanes"],
  },
  {
    code: "TN",
    name: "Tunisia",
    divisionLabel: "Governorate",
    divisions: [
      "Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kébili",
      "Kef", "Mahdia", "Manouba", "Medenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse",
      "Tataouine", "Tozeur", "Tunis", "Zaghouan",
    ],
  },
  {
    code: "UG",
    name: "Uganda",
    // Uganda's official first-level units are Districts, but the count has
    // grown quickly and often (111 in 2010 → 146+ since) as districts keep
    // splitting, making it impractical to keep accurate by hand. The four
    // traditional regions are stable and still how most people describe
    // where in Uganda they are.
    divisionLabel: "Region",
    divisions: ["Central", "Eastern", "Northern", "Western"],
  },
  {
    code: "ZM",
    name: "Zambia",
    divisionLabel: "Province",
    divisions: [
      "Central", "Copperbelt", "Eastern", "Luapula", "Lusaka", "Muchinga", "Northern", "North-Western",
      "Southern", "Western",
    ],
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    divisionLabel: "Province",
    divisions: [
      "Bulawayo", "Harare", "Manicaland", "Mashonaland Central", "Mashonaland East", "Mashonaland West",
      "Masvingo", "Matabeleland North", "Matabeleland South", "Midlands",
    ],
  },
];

export function findAfricanCountry(name: string): GeoCountry | undefined {
  return AFRICAN_COUNTRIES.find((c) => c.name === name);
}
