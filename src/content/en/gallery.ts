import type { Content } from "../types";

export const gallery: Content["gallery"] = {
  filterLabel: "Show photos of",
  all: "Everything",
  categories: {
    place: "The river",
    temple: "Temple",
    wildlife: "Wildlife",
    people: "People",
    nearby: "Nearby",
  },
  close: "Close",
  previous: "Previous photo",
  next: "Next photo",
  counter: "{n} of {total}",
};

export const credits: Content["credits"] = {
  intro:
    "Every photograph comes from Wikimedia Commons. The images were resized and recompressed for the web; the originals and full licence terms are on each Commons page.",
  columns: { photo: "Photo", author: "Author", licence: "Licence" },
  fonts: "Typefaces: {fonts}.",
  sourcesTitle: "Where the facts on this site come from",
};
