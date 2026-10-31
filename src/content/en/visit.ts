import type { Content } from "../types";

export const visit: Content["visit"] = {
  hours: {
    title: "Hours and entry",
    facts: [
      { label: "Open", value: "9 am to 3 pm" },
      { label: "Last tickets", value: "Before 3 pm, at the check post" },
      { label: "Adults", value: "₹30" },
      { label: "Children", value: "₹20" },
      { label: "Vehicles", value: "A separate vehicle fee applies" },
    ],
  },
  reach: {
    title: "Getting there",
    items: [
      {
        title: "By car or bike",
        body: "About 35 km from Nagercoil, or about 85 km from Thiruvananthapuram. After Keeriparai bridge, take the left branch. Your own vehicle is the easiest way in; low cars may struggle at the stream crossings.",
      },
      {
        title: "By bus",
        body: "Routes 4, 4A and 4AV from Vadasery and Anna bus stands in Nagercoil. Buses are infrequent and some stop short, so check the return times before you set off.",
      },
      {
        title: "By train or air",
        body: "The nearest railway station is Nagercoil Junction. The nearest airport is Thiruvananthapuram International, about 76 km away.",
      },
    ],
  },
  distances: {
    title: "Approximate distances",
    items: [
      { label: "Nagercoil", value: "35 km" },
      { label: "Kulasekharam", value: "25 km" },
      { label: "Thirparappu", value: "30 km" },
      { label: "Pechiparai", value: "32 km" },
      { label: "Kanyakumari", value: "63 km" },
      { label: "Thiruvananthapuram", value: "85 km" },
    ],
  },
  season: {
    title: "When to go",
    body: "January to May is the calmest time, when the river is low and clear. During heavy monsoon rain the water rises without warning, the road can flood, and the site may close.",
  },
  facilities: {
    title: "What's there",
    items: [
      "Changing rooms and restrooms near the river",
      "A small tea stall",
      "The eco camp canteen, which needs lunch booked in advance",
      "Weak mobile signal: tell someone your plans before you go in",
    ],
  },
  rules: {
    title: "Before you go in",
    items: [
      "No alcohol. Vehicles are checked at Keeriparai.",
      "The main waterfall is closed to visitors. Stay on marked paths.",
      "Bathe only where staff allow it. Pools are deep, the current is strong, and people have drowned here.",
      "Leave before dusk. Elephants and other wild animals use this forest.",
      "Carry food and water, and take all your rubbish home.",
      "Don't pick plants or feed animals.",
    ],
    image: "river-gate",
  },
  stay: {
    title: "Stay or trek",
    items: [
      { label: "Book the eco camp", link: "ecoCampBooking", note: "TN Wildscapes, the Tamil Nadu Forest Department's eco-tourism portal" },
      { label: "Book the Maramalai trek", link: "trekBooking", note: "Trek Tamil Nadu, the Forest Department's trekking programme" },
    ],
  },
  helpline: "Tamil Nadu Tourism helpline",
};
