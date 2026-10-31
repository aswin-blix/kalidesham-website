// Look and feel. Every value here becomes a CSS custom property on :root
// (see src/components/ThemeStyle.tsx), and all component styles read those
// properties, so changing a value here restyles the whole site.
import type { FontKey } from "@/fonts";

export type ThemeConfig = {
  colors: {
    /** Dark surfaces: hero, header, footer, dark sections. */
    dark: string;
    /** Slightly lifted panels on dark surfaces. */
    darkRaised: string;
    /** Rules and borders on dark surfaces. */
    darkLine: string;
    /** Page background. */
    light: string;
    /** Alternate light sections and borders on light surfaces. */
    lightDeep: string;
    /** Brand colour: the river line, markers, timeline. */
    primary: string;
    /** Brand colour on dark surfaces. */
    primaryLight: string;
    /** Brand colour for text and links on light surfaces (keep at least 4.5:1 contrast). */
    primaryText: string;
    /** Main call to action and the sacred stop (use sparingly). */
    accent: string;
    accentDeep: string;
    /** Text on the accent colour. */
    onAccent: string;
    /** Small highlights and the focus ring on dark surfaces. */
    highlight: string;
    text: string;
    textSoft: string;
    textOnDark: string;
    textOnDarkSoft: string;
  };
  fonts: {
    /** Headings and display type. */
    display: FontKey;
    /** Running text. */
    body: FontKey;
    /** Added after display/body so local-language glyphs always render. Null to skip. */
    script: FontKey | null;
  };
  /** Type scale. Any CSS length or clamp() works. */
  type: {
    small: string;
    base: string;
    lead: string;
    h3: string;
    h2: string;
    h1: string;
    hero: string;
    lineHeight: number;
  };
  layout: {
    /** Maximum content width. */
    pageWidth: string;
    /** Maximum line length for paragraphs. */
    measure: string;
    /** Side padding on small screens. */
    gutter: string;
    /** Vertical space between sections. */
    sectionSpace: string;
    radius: string;
    /** Height of the fixed header, used for anchor offsets. */
    headerHeight: string;
  };
  /** Encoding quality (1–100) for optimised photos. Both values are allowed in next.config.ts. */
  images: {
    quality: number;
    /** Hero photos sit under a dark gradient, so they can be lighter without visible loss. */
    heroQuality: number;
  };
  motion: {
    /** Master switch. Off behaves like the visitor's "reduce motion" setting. */
    enabled: boolean;
    /** Multiplies every CSS animation duration and delay (1 = default, 0.5 = twice as fast). */
    speed: number;
    heroLetters: boolean;
    heroParallax: boolean;
    riverLine: boolean;
    /** Home forest path: the path draws itself and stops rise in as you scroll. */
    trail: boolean;
    /** Home forest mosaic: smaller photos drift at different speeds as you scroll. */
    mosaicDrift: boolean;
    fieldGuide: boolean;
    exploreHover: boolean;
    gallery: boolean;
  };
};

export const theme: ThemeConfig = {
  colors: {
    dark: "#0f2a22", // canopy: evergreen shade under the forest
    darkRaised: "#173a2f",
    darkLine: "#2b5144",
    light: "#e3e6de", // riverstone: the pale boulders in the river
    lightDeep: "#d3d9cd",
    primary: "#5e8c86", // current: the river water
    primaryLight: "#9cc3bc",
    primaryText: "#36605a",
    accent: "#b3262e", // kumkum: the vermilion at the Kali shrine
    accentDeep: "#8f1d24",
    onAccent: "#ffffff",
    highlight: "#d9a11e", // turmeric and brass lamps
    text: "#14201b",
    textSoft: "#3d4b44",
    textOnDark: "#e3e6de",
    textOnDarkSoft: "#b7c4bb",
  },
  fonts: {
    display: "arima",
    body: "hindMadurai",
    script: "arimaTamil",
  },
  type: {
    small: "0.875rem",
    base: "1.0625rem",
    lead: "1.3rem",
    h3: "clamp(1.5rem, 1.3rem + 0.8vw, 1.9rem)",
    h2: "clamp(1.9rem, 1.4rem + 2vw, 2.9rem)",
    h1: "clamp(2.4rem, 1.5rem + 3.6vw, 4.4rem)",
    hero: "clamp(3.4rem, 1rem + 11vw, 11.5rem)",
    lineHeight: 1.6,
  },
  layout: {
    pageWidth: "74rem",
    measure: "36rem",
    gutter: "clamp(1rem, 0.5rem + 2.5vw, 2.5rem)",
    sectionSpace: "clamp(4.5rem, 3rem + 7vw, 9rem)",
    radius: "0.5rem",
    headerHeight: "4.5rem",
  },
  images: {
    quality: 75,
    heroQuality: 60,
  },
  motion: {
    enabled: true,
    speed: 1,
    heroLetters: true,
    heroParallax: true,
    riverLine: true,
    trail: true,
    mosaicDrift: true,
    fieldGuide: true,
    exploreHover: true,
    gallery: true,
  },
};
