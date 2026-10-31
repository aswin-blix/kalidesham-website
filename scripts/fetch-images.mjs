#!/usr/bin/env node
// Downloads the site's photos from Wikimedia Commons into public/images and
// writes src/content/image-meta.json (dimensions + blur placeholders).
//
//   npm run images            fetch anything missing
//   npm run images -- --force re-download everything
//
// Runs automatically before `dev` and `build`. Existing files are skipped, so
// after the first run it does no network work. Set IMAGES_OPTIONAL=1 to let a
// build continue when images cannot be downloaded (offline CI, sandboxes).
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { syncImages, writeOpenGraphImage, localFile } from "./lib/images.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(await readFile(path.join(root, "src/content/images.json"), "utf8"));
const outDir = path.join(root, "public/images");
const metaPath = path.join(root, "src/content/image-meta.json");
const force = process.argv.includes("--force");
const optional = process.env.IMAGES_OPTIONAL === "1";

console.log(`Images: checking ${manifest.length} photos${force ? " (forced)" : ""}`);
const { fetched, skipped, failed } = await syncImages({ manifest, outDir, metaPath, force });

const ogWritten = await writeOpenGraphImage(
  localFile(outDir, "hero-stream"),
  path.join(root, "src/app/opengraph-image.jpg"),
);
if (ogWritten) {
  await writeFile(
    path.join(root, "src/app/opengraph-image.alt.txt"),
    "Water tumbling over boulders at Kalikesam in the Western Ghats, Kanyakumari district\n",
  );
}

console.log(
  `Images: ${fetched.length} downloaded, ${skipped.length} already present, ${failed.length} failed` +
    (ogWritten ? ", social card updated" : ""),
);

if (failed.length) {
  const message = `Could not download: ${failed.map((f) => f.id).join(", ")}. Check your internet connection and run "npm run images" again.`;
  if (optional) {
    console.warn(`Warning: ${message} Continuing because IMAGES_OPTIONAL=1.`);
  } else {
    console.error(`Error: ${message}`);
    process.exit(1);
  }
}
