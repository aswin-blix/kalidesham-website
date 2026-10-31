import type { Content } from "../types";

export const wildlife: Content["wildlife"] = {
  guide: {
    title: "A field guide",
    intro: "Six animals to know before you go. Choose one to read about it.",
    tabsLabel: "Animals",
    species: [
      {
        id: "macaque",
        name: "Lion-tailed macaque",
        scientific: "Macaca silenus",
        image: "lion-tailed-macaque",
        note: "A rainforest monkey found only in the Western Ghats, with a silver mane around a black face. It is among the mammals recorded in Kanyakumari Wildlife Sanctuary.",
      },
      {
        id: "elephant",
        name: "Asian elephant",
        scientific: "Elephas maximus",
        image: "elephant",
        note: "Elephants move through these forests, which is why the check post controls entry and why visitors must leave before dusk. If you meet one on the road, stop, keep your distance and let it pass.",
      },
      {
        id: "gaur",
        name: "Gaur",
        scientific: "Bos gaurus",
        image: "gaur",
        note: "Locally called bison, this is the largest wild cattle in the world. Trekkers on the Maramalai trail report seeing them. Keep your distance: a startled gaur can charge.",
      },
      {
        id: "tortoise",
        name: "Travancore tortoise",
        scientific: "Indotestudo travancorica",
        image: "travancore-tortoise",
        note: "A shy forest tortoise of the southern Western Ghats, and the animal guides on the Kalikesam to Maramalai trek most hope to show you. Watch the leaf litter beside the trail.",
      },
      {
        id: "squirrel",
        name: "Malabar giant squirrel",
        scientific: "Ratufa indica",
        image: "giant-squirrel",
        note: "A squirrel the length of a forearm, with a tail longer still. It rarely comes to the ground. Listen for its loud, rattling call in the canopy.",
      },
      {
        id: "birdwing",
        name: "Southern birdwing",
        scientific: "Troides minos",
        image: "southern-birdwing",
        note: "India's largest butterfly, found only in the south. It glides high over clearings and riverbanks, so the river at Kalikesam is a good place to watch for it.",
      },
    ],
  },
  alsoRecorded: {
    title: "Also recorded in the sanctuary",
    items: ["Tiger", "Nilgiri tahr", "Sambar deer", "Mouse deer", "Indian rock python", "Slender loris", "Dhole", "Panther"],
  },
  discoveries: {
    title: "Still being discovered",
    body: [
      "Scientists keep finding new things here. Several plant, amphibian and insect species new to science have been described from the sanctuary, some found nowhere else.",
      "In September 2023 researchers photographed Mycena chlorophos, a mushroom that glows in the dark, in the Kulasekharam range of the sanctuary.",
    ],
  },
  ethics: {
    title: "Watching wildlife well",
    items: [
      "Go early. Animals are most active in the first hours after dawn.",
      "Stay with your guide and on the path.",
      "Keep your voice low and your phone on silent.",
      "Never feed or approach animals, however calm they seem.",
      "Don't pick plants or flowers, and take all litter home.",
      "Leave before dusk, when elephants and other large animals move.",
    ],
  },
};
