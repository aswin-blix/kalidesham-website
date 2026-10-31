import type { Content } from "../types";

/** Interface wording used across every page. */
export const ui: Content["ui"] = {
  skipLink: "Skip to content",
  menuOpen: "Menu",
  menuClose: "Close",
  sectionsNav: "Main",
  breadcrumb: "Breadcrumb",
  home: "Home",
  next: "Next",
  photoCredit: (author, license) => `Photo: ${author}, ${license}`,
  stopCount: (n, total) => `Stop ${n} of ${total}`,
  footerGroups: { discover: "Discover", experience: "Experience", plan: "Plan" },
  footerDisclaimer:
    "An independent visitor guide. For tickets, stays and treks, use the official Tamil Nadu Forest Department portals linked on this site.",
  footerPhotos: "Photos from Wikimedia Commons, used under their Creative Commons licences.",
  footerSeeCredits: "See all photo credits",
  footerContact: "Tamil Nadu Tourism helpline",
  getDirections: "Get directions",
  coordinates: "{lat}° N, {lng}° E",
  social: { instagram: "Instagram", facebook: "Facebook", youtube: "YouTube", x: "X" },
  notFoundTitle: "This path doesn't lead anywhere",
  notFoundBody: "The page you were looking for isn't here. It may have moved, or the link may be wrong.",
  notFoundCta: "Back to the start",
  checkBeforeYouGo: "Fees, timings and rules are set by the Tamil Nadu Forest Department and can change. Check before you set out.",
};
