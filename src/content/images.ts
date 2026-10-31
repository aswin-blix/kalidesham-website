import manifest from "./images.json";
import imageMeta from "./image-meta.json";

export type ImageCategory = "place" | "temple" | "wildlife" | "people" | "nearby";

export type ImageRecord = {
  id: string;
  /** Alt text in the site's default language. */
  alt: string;
  title: string;
  /** Remote source on Wikimedia Commons, used only by scripts/fetch-images.mjs. */
  src: string;
  width: number;
  height: number;
  author: string;
  license: string;
  licenseUrl: string;
  page: string;
  category: ImageCategory;
  /** Show on the gallery page. Illustrative photos taken elsewhere can opt out. */
  inGallery: boolean;
};

type Meta = { width: number; height: number; blurDataURL: string };

const records = manifest as ImageRecord[];
const meta = imageMeta as Record<string, Meta | undefined>;

export type ImageId = string;

export const images: readonly ImageRecord[] = records;

export const imageCategories: ImageCategory[] = ["place", "temple", "wildlife", "people", "nearby"];

export type ResolvedImage = ImageRecord & {
  /** Path of the self-hosted copy in /public. */
  localSrc: string;
  blurDataURL?: string;
};

/**
 * Manifest entry merged with what the fetch script measured on disk.
 * Falls back to the manifest's dimensions if the image has not been fetched yet.
 */
export function getImage(id: ImageId): ResolvedImage {
  const record = records.find((r) => r.id === id);
  if (!record) throw new Error(`Unknown image id "${id}"`);
  const measured = meta[id];
  return {
    ...record,
    width: measured?.width ?? record.width,
    height: measured?.height ?? record.height,
    blurDataURL: measured?.blurDataURL,
    localSrc: `/images/${record.id}.jpg`,
  };
}
