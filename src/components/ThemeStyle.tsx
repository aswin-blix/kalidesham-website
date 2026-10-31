import { config } from "@/config";
import { buildThemeCss } from "@/config/theme-css";
import { fontRegistry } from "@/fonts";

const css = buildThemeCss(config.theme, fontRegistry);

/** Theme tokens from src/config/theme.config.ts as CSS variables. React hoists this into <head>. */
export function ThemeStyle() {
  return (
    <style href="theme-tokens" precedence="high">
      {css}
    </style>
  );
}
