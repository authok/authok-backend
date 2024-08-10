export interface Language {
  code: string; // "zh",
  name: string; //  "Chinese",
  native: string; // "中文"
}

export interface Location {
  geoname_id: number; // 1795565,
  capital: string; // "Beijing",
  languages: Language[],
  country_flag: string; // "https://assets.ipstack.com/flags/cn.svg",
  country_flag_emoji: string; // "🇨🇳",
  country_flag_emoji_unicode: string; // "U+1F1E8 U+1F1F3",
  calling_code: string; // "86",
  is_eu: boolean; // false
}

export interface IPInfo {
  ip: string; // "115.44.118.125",
  type: string; // "ipv4",
  continent_code: string; // "AS",
  continent_name: string; // "Asia",
  country_code: string; // "CN",
  country_name: string; // "China",
  region_code: string; // "GD",
  region_name: string; // "Guangdong",
  city: string; // "Shenzhen",
  zip: string; // "518000",
  latitude: string; // 22.547500610351562,
  longitude: string; // 114.10166931152344,
  location: Location;
}