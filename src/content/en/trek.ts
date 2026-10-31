import type { Content } from "../types";

/** From the Forest Department's Trek Tamil Nadu programme listing. */
export const trek: Content["trek"] = {
  facts: [
    { label: "Distance", value: "12 km, there and back" },
    { label: "Time", value: "About 5 hours" },
    { label: "Grade", value: "Moderate" },
    { label: "Highest point", value: "About 517 m" },
    { label: "Forest", value: "Evergreen and dry deciduous" },
    { label: "Starts", value: "8 am or 9 am, Kalikesam eco camp reception" },
  ],
  route: {
    title: "The route",
    body: [
      "The trail leaves the plantation area near the eco camp and climbs through the forest interior to Maramalai, where an old clove plantation sits on the hills. From the Maramalai viewpoint you can look out over the Perunchani reservoir.",
      "Forest Department guides lead every group. They stop to point out medicinal plants and trees, and to look for the animals that use the trail.",
    ],
  },
  highlights: {
    title: "What you may see",
    items: [
      "The Travancore tortoise, the trek's best-known resident",
      "Gaur, monkeys and Malabar giant squirrels",
      "Forest birds, with a bird pamphlet from the organisers",
      "Medicinal plants, explained by the guides",
      "The old clove estate at Maramalai",
      "The view over the Perunchani reservoir",
    ],
    image: "travancore-tortoise",
  },
  included: {
    title: "Included in the fee",
    items: ["Trek permit", "Forest Department guide", "Trek insurance on the route", "Cap and bird pamphlet", "Light refreshments"],
  },
  excluded: {
    title: "Not included",
    items: ["Transport to the reception point", "Food and water beyond the refreshments"],
  },
  packing: {
    title: "What to bring",
    items: [
      "Trail shoes or hiking boots",
      "A refillable water bottle",
      "Quick-drying clothes and a rain jacket",
      "Sun hat, sunscreen and insect repellent",
      "Snacks and any medication you need",
      "Photo ID",
      "A bag to carry your rubbish out",
    ],
  },
  rules: {
    title: "Trail rules",
    items: [
      "Follow the guide and stay with the group.",
      "Bathing in forest streams and waterfalls is not allowed.",
      "Don't approach or feed animals, or pick plants.",
      "Go at your own pace. It is not a race.",
      "Minors need a signed consent form.",
    ],
  },
  booking: {
    title: "Booking",
    body: "Treks are booked online through Trek Tamil Nadu, the Forest Department's trekking programme, where current fees and dates are listed.",
    cta: "Book on Trek Tamil Nadu",
  },
};
