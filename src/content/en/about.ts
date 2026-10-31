import type { Content } from "../types";

export const about: Content["about"] = {
  where: {
    title: "Where it is",
    body: [
      "Kalikesam lies in the foothills of the Western Ghats in Kanyakumari district, the southernmost district of Tamil Nadu. It is inside Kanyakumari Wildlife Sanctuary, about 35 km from Nagercoil and about 85 km by road from Thiruvananthapuram.",
      "Kalikesam is small: the river, the shrine on its bank, a Forest Department eco camp, and forest on every side.",
    ],
    facts: [
      { label: "District", value: "Kanyakumari, Tamil Nadu" },
      { label: "Sanctuary", value: "Kanyakumari Wildlife Sanctuary, declared 2008" },
      { label: "Sanctuary area", value: "About 402 km²" },
      { label: "Coordinates", value: "8.4110° N, 77.3915° E" },
    ],
  },
  journey: {
    title: "One road, ending at the river",
    intro: "Kalikesam is not a town. It is the place where a single forest road stops at the water. These are the places you pass on the way in.",
    stops: [
      {
        id: "checkpost",
        title: "The check post at Keeriparai",
        body: "Entry tickets are sold at the forest check post near Keeriparai police station. Vehicles are checked here, and alcohol does not go any further. The post was set up to end the drinking parties that once came to this remote stretch of river.",
        image: "keeriparai-hills",
      },
      {
        id: "estates",
        title: "Through rubber and evergreen",
        body: "Past the bridge the road forks; Kalikesam is the left branch. It runs through state rubber estates, where tall trees stand in straight planted rows, before the evergreen forest closes in. Drive slowly: the surface is rough, and cattle and children use the road too.",
        image: "forest-stream",
      },
      {
        id: "shrine",
        title: "A shrine on the way",
        body: "A small temple at Vazhathuvayal stands on the way to the eco camp and its forest canteen. Meals there are cooked to order, so book ahead if you want lunch.",
        image: "wayside-shrine",
      },
      {
        id: "river",
        title: "The river",
        body: "The water is clear enough to watch small fish around your ankles. It is shallow at the edge and deepens further out, and after rain the current turns strong and swirling. Bathe only where the forest staff allow it.",
        image: "river-shallows",
      },
      {
        id: "temple",
        title: "Kali on the riverbank",
        body: "The road ends at the Kali temple on the bank, the shrine that gives the place its name. Extra buses run from Nagercoil on full-moon days and during Tamil festival seasons.",
        image: "temple",
        sacred: true,
      },
    ],
  },
  landscape: {
    title: "The forest around it",
    body: [
      "Kalikesam is where land and water ecosystems meet: evergreen shola, the main forest and marshy swamp all lie within a short walk. The sanctuary around it holds fourteen forest types in all, and seven rivers rise inside it, among them the Thamirabarani and the Pahrali.",
      "The sanctuary gets about 1,370 mm of rain a year. The river fills when the Kerala monsoon sets in, and heavy rain can flood it without warning.",
    ],
    forestTypes: {
      title: "Forest types in the sanctuary include",
      items: [
        "Southern hilltop tropical evergreen",
        "West coast semi-evergreen",
        "Moist teak",
        "Dry teak",
        "Thorn forest",
        "Ochlandra reed brakes",
      ],
    },
  },
};
