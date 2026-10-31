import type { Content } from "../types";

export const home: Content["home"] = {
  summary:
    "A Kali shrine where a forest road ends at a clear river, inside Kanyakumari Wildlife Sanctuary in the Western Ghats.",
  primaryCta: "Plan your visit",
  secondaryCta: "Follow the road in",
  nameNote: {
    heading: "About the name",
    split: ["காளி", "கேசம்"],
    lead: "The name joins Kali, the goddess whose shrine stands at the river, with kesam, the Tamil word for hair.",
    body: "It sits in the foothills of the Western Ghats, about 35 km from Nagercoil, deep inside Kanyakumari Wildlife Sanctuary. Evergreen forest, swamp and river meet here, and the Kani people still live in the surrounding hills.",
  },
  forest: {
    title: "Where the forest meets the water",
    intro: "Evergreen shola, the main forest and marshy swamp all lie within a short walk of the river. Around them, the sanctuary stretches deep into the Western Ghats.",
    stats: [
      { value: "402 km²", label: "Sanctuary area, approximately" },
      { value: "14", label: "Forest types in the sanctuary" },
      { value: "7", label: "Rivers rising inside the sanctuary" },
      { value: "1,370 mm", label: "Rain in an average year" },
    ],
    images: ["river-wide", "black-rock-cascade", "river-shallows", "vattaparai-falls", "karumparai-falls"],
  },
  explore: {
    title: "Explore Kalikesam",
    intro: "Follow the forest path. Each stop is one part of the place: the river and the road, the shrine, the forest and the people who live in it.",
    start: "Trailhead",
    cta: "Take this path",
    end: "End of the path. See you at the river.",
  },
  wildlife: {
    title: "Who lives in these woods",
    intro: "A few of the animals that share the forest with the river. Walk quietly and keep your distance.",
    cta: "Meet them in the field guide",
  },
  glance: {
    title: "At a glance",
    facts: [
      { label: "Open", value: "9 am to 3 pm" },
      { label: "Entry", value: "₹30 adults, ₹20 children" },
      { label: "From Nagercoil", value: "About 35 km" },
      { label: "Best months", value: "January to May" },
    ],
    cta: "Everything you need to plan a visit",
    image: "river-gate",
  },
};
