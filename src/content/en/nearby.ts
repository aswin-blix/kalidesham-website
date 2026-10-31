import type { Content } from "../types";

export const nearby: Content["nearby"] = {
  mapLabel: "Open in Google Maps",
  places: [
    {
      id: "karumparai",
      name: "Karumparai falls",
      image: "karumparai-falls",
      distance: "On the road in, near Palkulam",
      body: [
        "Karumparai, the Black Rock falls, lies at Palkulam between Kalikesam and Thadikarankonam. Water pours down a dark rock face into a pool strewn with boulders.",
      ],
      mapQuery: "Karumparai waterfall Palkulam Kanyakumari",
    },
    {
      id: "vattaparai",
      name: "Vattaparai falls",
      image: "vattaparai-falls",
      distance: "Right branch after Keeriparai bridge",
      body: [
        "Where the road forks after Keeriparai bridge, Kalikesam is to the left and Vattaparai to the right. The falls drop between large rocks into a still pool.",
      ],
      mapQuery: "Vattaparai falls Keeriparai",
    },
    {
      id: "thirparappu",
      name: "Thirparappu falls",
      image: "thirparappu-falls",
      distance: "About 30 km",
      body: [
        "Here the Kodayar spills nearly 50 feet over a rocky bed about 300 feet long. There is a children's pool, and a Shiva temple on the left bank: the third of the twelve shrines that pilgrims run between on the night of Shivaratri.",
        "Bathing is stopped when water released from the Pechiparai dam floods the falls.",
      ],
      facts: [
        { label: "Entry", value: "₹5; camera ₹5; video ₹75" },
        { label: "From Kulasekharam", value: "About 7 km" },
      ],
      mapQuery: "Thirparappu waterfalls",
    },
    {
      id: "thirunanthikarai",
      name: "Thirunanthikarai cave temple",
      image: "thirunanthikarai-cave",
      distance: "About 27 km",
      body: [
        "A Shiva shrine cut into a granite rock face in the 9th century, now protected by the Archaeological Survey of India. Inside are faded Kerala-style murals and inscriptions in the old Vatteluttu script, the earliest from around 800 CE.",
        "Historians disagree on who built it: the ASI credits the Ay king Vikramaditya Varaguna; others name the Pandya ruler Nedunjadaiyan.",
      ],
      facts: [{ label: "From Kulasekharam", value: "About 3 km, on the Pechiparai road" }],
      mapQuery: "Thirunanthikarai cave temple",
    },
    {
      id: "pechiparai",
      name: "Pechiparai reservoir",
      image: "pechiparai",
      distance: "About 32 km",
      body: [
        "A wide reservoir on the Kodayar below the Western Ghats, built by Travancore between 1897 and 1906 and raised in 1969. Kani hamlets on the far shore are still reached by boat.",
      ],
      mapQuery: "Pechiparai dam",
    },
    {
      id: "eco-camp",
      name: "Kalikesam eco camp",
      image: "eco-camp",
      distance: "At Kalikesam",
      body: [
        "Forest Department stays beside the riverbed, with a canteen that cooks lunch to order. There is also a Forest Department guest house near the Keeriparai check post. Forest Department stays are booked through TN Wildscapes.",
      ],
      mapQuery: "Kalikesam eco camp",
    },
  ],
};
