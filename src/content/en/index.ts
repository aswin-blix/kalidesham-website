import type { Content } from "../types";
import { about } from "./about";
import { faq } from "./faq";
import { credits, gallery } from "./gallery";
import { home } from "./home";
import { nearby } from "./nearby";
import { pages } from "./pages";
import { people } from "./people";
import { sources } from "./sources";
import { temple } from "./temple";
import { thingsToDo } from "./things-to-do";
import { trek } from "./trek";
import { ui } from "./ui";
import { visit } from "./visit";
import { wildlife } from "./wildlife";

export const en: Content = {
  locale: "en-IN",
  seo: {
    keywords: [
      "Kalikesam",
      "Kalikesam eco tourism",
      "Kanyakumari Wildlife Sanctuary",
      "Keeriparai",
      "Maramalai trek",
      "Kanyakumari waterfalls",
    ],
  },
  ui,
  pages,
  home,
  about,
  temple,
  wildlife,
  people,
  thingsToDo,
  trek,
  nearby,
  visit,
  faq,
  gallery,
  credits,
  sources,
};
