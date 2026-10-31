// Single entry point for visitor-facing text. Components import `content`
// from here, never from ./en directly, so adding a language later only means
// adding ./ta (same `Content` type) and choosing between them here.
import { en } from "./en";
import { getImage, type ImageId } from "./images";
import type { Content } from "./types";

export const content: Content = en;

/** Alt text and title for a photo in the current language (falls back to images.json). */
export function imageText(id: ImageId): { alt: string; title: string } {
  const base = getImage(id);
  const local = content.imageText?.[id];
  return { alt: local?.alt ?? base.alt, title: local?.title ?? base.title };
}

/** Replace {name} placeholders in a content template. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export type { Content } from "./types";
