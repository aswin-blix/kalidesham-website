// Identity, location, contact and outside links. Visitor-facing wording lives in
// src/content; this file holds values that are the same in every language.

export type SocialKey = "instagram" | "facebook" | "youtube" | "x";

export type SiteConfig = {
  name: string;
  /** Name in the local script, shown large on the home page and in the header. */
  localName: { text: string; lang: string };
  /** Other spellings people search for. Used in structured data. */
  alternateNames: string[];
  /** Public URL. Read from NEXT_PUBLIC_SITE_URL (or Vercel's production URL); never hard-code localhost. */
  url: string | undefined;
  geo: { lat: number; lng: number };
  address: { locality: string; region: string; country: string };
  contact: {
    /** Shown in the footer and on the visit page. Set to null to hide. */
    phone: { display: string; tel: string } | null;
    email: string | null;
  };
  /** Leave empty to hide. */
  social: Partial<Record<SocialKey, string>>;
  /** Official booking pages. */
  links: {
    ecoCampBooking: string;
    trekBooking: string;
  };
  /**
   * Opening hours for search engines (24-hour "HH:MM"). The visitor-facing wording is in
   * src/content/en/home.ts (at a glance) and visit.ts (hours): update those too.
   */
  openingHours: { opens: string; closes: string; days: string[] };
  seo: {
    /** "%s" is the page title. */
    titleTemplate: string;
    /** e.g. "@kalikesam"; empty to omit. */
    twitterHandle: string;
  };
  /** Home page structured data. */
  schema: {
    type: "TouristAttraction" | "Park" | "HinduTemple" | "LandmarksOrHistoricalBuildings";
    /** Larger place it sits in, or null. */
    containedInPlace: string | null;
    isAccessibleForFree: boolean;
  };
};

const name = "Kalikesam";

export const siteConfig: SiteConfig = {
  name,
  localName: { text: "காளிகேசம்", lang: "ta" },
  alternateNames: ["Kaalikesam", "Kalikesham", "Kalidesham"],
  url:
    // `||` so an empty value in .env counts as unset.
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined),
  geo: { lat: 8.410967, lng: 77.391467 },
  address: { locality: "Keeriparai", region: "Tamil Nadu", country: "IN" },
  contact: {
    phone: { display: "1800-425-31111", tel: "180042531111" },
    email: null,
  },
  social: {},
  links: {
    ecoCampBooking: "https://tnwildscapes.com/",
    trekBooking: "https://www.trektamilnadu.com/trail/kalikesam-maramalai",
  },
  openingHours: {
    opens: "09:00",
    closes: "15:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  seo: {
    titleTemplate: `%s | ${name}`,
    twitterHandle: "",
  },
  schema: {
    type: "TouristAttraction",
    containedInPlace: "Kanyakumari Wildlife Sanctuary",
    isAccessibleForFree: false,
  },
};

export const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${siteConfig.geo.lat},${siteConfig.geo.lng}`;
