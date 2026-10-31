// Font registry. next/font needs literal options at module scope, so every
// typeface the theme can pick from is declared here once. To add a font:
// drop its .woff2 file(s) in this folder, add an entry below, then select it
// by key in src/config/theme.config.ts. Only the fonts the theme selects are
// attached to the page, so unused entries cost nothing.
import localFont from "next/font/local";

const arima = localFont({
  src: "./arima-latin-wght-normal.woff2",
  weight: "100 700",
  variable: "--font-arima",
  display: "swap",
});

/** Tamil glyphs for Arima. The unicode-range keeps it from downloading on English-only text. */
const arimaTamil = localFont({
  src: "./arima-tamil-wght-normal.woff2",
  weight: "100 700",
  variable: "--font-arima-tamil",
  display: "swap",
  adjustFontFallback: false,
  declarations: [{ prop: "unicode-range", value: "U+0B80-0BFF, U+200C-200D, U+25CC" }],
});

const hindMadurai = localFont({
  src: [
    { path: "./hind-madurai-latin-400-normal.woff2", weight: "400" },
    { path: "./hind-madurai-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-hind-madurai",
  display: "swap",
});

type FontEntry = { font: { variable: string }; cssVar: string; fallback: string; name: string; license: string };

export const fontRegistry = {
  arima: { font: arima, cssVar: "--font-arima", fallback: "Georgia, serif", name: "Arima", license: "SIL Open Font License" },
  arimaTamil: {
    font: arimaTamil,
    cssVar: "--font-arima-tamil",
    fallback: "sans-serif",
    name: "Arima",
    license: "SIL Open Font License",
  },
  hindMadurai: {
    font: hindMadurai,
    cssVar: "--font-hind-madurai",
    fallback: "system-ui, sans-serif",
    name: "Hind Madurai",
    license: "SIL Open Font License",
  },
} satisfies Record<string, FontEntry>;

export type FontKey = keyof typeof fontRegistry;
