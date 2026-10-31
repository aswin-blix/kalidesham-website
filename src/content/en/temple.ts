import type { Content } from "../types";

export const temple: Content["temple"] = {
  shrine: {
    title: "The shrine at the end of the road",
    body: [
      "Kalikesam takes its name from its Kali temple, listed by Tamil Nadu Tourism as the Kali Amman temple. It stands on the bank of the river, where the forest road ends, with an open hall beside it.",
      "It is a working shrine, not a monument. On full-moon days and during Tamil festival seasons, extra buses run from Nagercoil for the people who come to worship.",
    ],
    image: "temple-hall",
  },
  visiting: {
    title: "Visiting the shrine",
    items: [
      "Access to the temple area has at times been restricted, with permission needed from the Forest Department in Nagercoil. Ask at the Keeriparai check post before you go in.",
      "As at most Hindu temples, remove your footwear before entering the shrine and dress modestly.",
      "Ask before photographing worshippers, priests or the inner shrine.",
      "Keep the riverbank around the temple clean. Take everything you bring back out with you.",
    ],
    image: "temple",
  },
  history: {
    title: "History of these hills",
    intro: "No reliable written history of the shrine itself has been published. The story of the land around it is better recorded.",
    timeline: [
      {
        when: "For generations",
        title: "The Kani people",
        body: "The Kani, also called Kanikkar, have lived in these hills since long before any written record. Around 7,000 Kani (2011 Census) live in more than forty settlements in the district's hills.",
      },
      {
        when: "Early 1900s",
        title: "Recorded by Edgar Thurston",
        body: "The ethnographer Edgar Thurston photographed and described the Kanikkar for his survey of the castes and tribes of southern India.",
      },
      {
        when: "1897 to 1906",
        title: "Pechiparai dam",
        body: "At the request of the Travancore Maharaja Sri Moolam Thirunal, the engineer Minchin built the Pechiparai dam on the Kodayar river, creating the reservoir that still lies below these hills.",
      },
      {
        when: "Until 1956",
        title: "Part of Travancore",
        body: "These forests belonged to the princely state of Travancore. On 1 November 1956 Kanyakumari district joined Madras State, now Tamil Nadu.",
      },
      {
        when: "From 1984",
        title: "Rubber and clove",
        body: "The state-run Arasu Rubber Corporation began work in October 1984 and runs a rubber factory at Keeriparai. Rubber estates still line the road in. Deeper in the hills, planters at Maramalai and Black Rock helped Kanyakumari clove earn a geographical indication tag in 2021.",
      },
      {
        when: "2008",
        title: "A wildlife sanctuary",
        body: "Kanyakumari Wildlife Sanctuary was declared, protecting about 402 km² of forest. Seven rivers rise in it, including the Thamirabarani and the Pahrali.",
      },
      {
        when: "Today",
        title: "Eco-tourism",
        body: "The Tamil Nadu Forest Department runs the check post, the eco camp and guided treks. The check post was set up to stop drinking and illegal activity in what had become a remote party spot.",
      },
    ],
  },
};
