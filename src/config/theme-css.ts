import type { ThemeConfig } from "./theme.config";

type FontVars = Record<string, { cssVar: string; fallback: string }>;

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** Reject values that could break out of the generated <style> block. */
function safe(value: string | number, path: string): string {
  const text = String(value);
  if (/[<>{};]/.test(text)) throw new Error(`Theme value at ${path} contains a forbidden character: ${text}`);
  return text;
}

/**
 * Turn the theme config into CSS custom properties on :root.
 * Names: --color-<key>, --font-display/body, --text-<step>, plus layout and motion values.
 */
export function buildThemeCss(theme: ThemeConfig, fonts: FontVars): string {
  const font = (key: string | null) => {
    if (!key) return null;
    const entry = fonts[key];
    if (!entry) throw new Error(`Theme font "${key}" is not in the font registry`);
    return entry;
  };
  const display = font(theme.fonts.display)!;
  const body = font(theme.fonts.body)!;
  const script = font(theme.fonts.script);
  const stack = (main: { cssVar: string; fallback: string }) =>
    [`var(${main.cssVar})`, script ? `var(${script.cssVar})` : null, main.fallback].filter(Boolean).join(", ");

  const vars: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(theme.colors)) vars[`--color-${kebab(key)}`] = value;
  vars["--font-display"] = stack(display);
  vars["--font-body"] = stack(body);
  for (const [key, value] of Object.entries(theme.type)) {
    if (key === "lineHeight") vars["--line-height"] = value;
    else vars[`--text-${kebab(key)}`] = value;
  }
  vars["--page"] = theme.layout.pageWidth;
  vars["--measure"] = theme.layout.measure;
  vars["--gutter"] = theme.layout.gutter;
  vars["--section-y"] = theme.layout.sectionSpace;
  vars["--radius"] = theme.layout.radius;
  vars["--header-height"] = theme.layout.headerHeight;
  vars["--motion-speed"] = theme.motion.enabled ? theme.motion.speed : 0;

  const body_ = Object.entries(vars)
    .map(([name, value]) => `${name}:${safe(value, name)}`)
    .join(";");
  return `:root{${body_}}`;
}

/** Font CSS variables (from next/font) the page needs: only the fonts the theme uses. */
export function selectedFontKeys(theme: ThemeConfig): string[] {
  return [...new Set([theme.fonts.display, theme.fonts.body, theme.fonts.script].filter((k): k is NonNullable<typeof k> => !!k))];
}

/** WCAG 2 contrast ratio between two #rrggbb colours. */
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
    if (!m) throw new Error(`contrastRatio expects #rrggbb, got "${hex}"`);
    const channels = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
    const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Colour pairs the components actually use, with the WCAG AA minimum each must meet. */
export function contrastPairs(colors: ThemeConfig["colors"]) {
  return [
    { use: "body text on page", fg: colors.text, bg: colors.light, min: 4.5 },
    { use: "secondary text on page", fg: colors.textSoft, bg: colors.light, min: 4.5 },
    { use: "secondary text on alternate sections", fg: colors.textSoft, bg: colors.lightDeep, min: 4.5 },
    { use: "brand links on page", fg: colors.primaryText, bg: colors.light, min: 4.5 },
    { use: "brand links on alternate sections", fg: colors.primaryText, bg: colors.lightDeep, min: 4.5 },
    { use: "text on dark", fg: colors.textOnDark, bg: colors.dark, min: 4.5 },
    { use: "secondary text on dark", fg: colors.textOnDarkSoft, bg: colors.dark, min: 4.5 },
    { use: "secondary text on raised dark panels", fg: colors.textOnDarkSoft, bg: colors.darkRaised, min: 4.5 },
    { use: "brand text on dark", fg: colors.primaryLight, bg: colors.dark, min: 4.5 },
    { use: "button text on accent", fg: colors.onAccent, bg: colors.accent, min: 4.5 },
    { use: "button text on accent hover", fg: colors.onAccent, bg: colors.accentDeep, min: 4.5 },
    { use: "highlight headings and focus ring on dark", fg: colors.highlight, bg: colors.dark, min: 3 },
    { use: "highlight links and numbers on dark (home forest)", fg: colors.highlight, bg: colors.dark, min: 4.5 },
    { use: "signposts on raised dark panels", fg: colors.highlight, bg: colors.darkRaised, min: 4.5 },
    { use: "text on highlight (trailhead, reached path markers)", fg: colors.text, bg: colors.highlight, min: 4.5 },
    { use: "focus ring on page", fg: colors.text, bg: colors.light, min: 3 },
  ];
}
