import type { Content } from "../types";

/** Activities as listed by Tamil Nadu Tourism and the district administration. */
export const thingsToDo: Content["thingsToDo"] = {
  activities: [
    {
      id: "river",
      name: "Paddling in the river",
      body: "The district administration lists the river as open for bathing, with changing rooms and restrooms nearby. The edge is shallow and clear; the current further out is strong, so stay where the forest staff allow.",
      image: "river-gate",
    },
    {
      id: "coracle",
      name: "Coracle rides",
      body: "Round bamboo boats, steered with a single paddle, on calm stretches of water. Ask at the eco camp whether rides are running.",
      image: "coracle",
    },
    {
      id: "walks",
      name: "Nature walks and treks",
      body: "Short guided walks from the eco camp, or a full day on the trail to the old clove estate at Maramalai.",
      image: "forest-stream",
      link: "trek",
    },
    {
      id: "birds",
      name: "Bird watching",
      body: "Early morning along the river and the plantation edges is best. Bring binoculars; the canopy is tall.",
    },
    {
      id: "butterflies",
      name: "Butterfly watching",
      body: "Sunny clearings and damp riverbanks after the rains draw the most butterflies, including the southern birdwing, India's largest.",
      image: "southern-birdwing",
    },
    {
      id: "cycling",
      name: "Cycling",
      body: "The quiet roads between the rubber estates suit an easy ride. Ask at the eco camp about bicycles.",
    },
    {
      id: "temple",
      name: "Visiting the shrine",
      body: "The Kali temple on the riverbank is the reason the road exists. Visit quietly, and check at the check post whether the temple area is open.",
      image: "temple-hall",
      link: "temple",
    },
  ],
  trekTeaser: {
    title: "Kalikesam to Maramalai",
    body: "A 12 km guided trek through evergreen forest to an old clove estate, with a view over the Perunchani reservoir.",
    cta: "Read about the trek",
  },
};
