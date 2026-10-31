// Image pipeline used by scripts/fetch-images.mjs.
// Downloads the Wikimedia Commons photos listed in src/content/images.json,
// re-encodes them for self-hosting, and records real dimensions plus a tiny
// blur placeholder in src/content/image-meta.json.
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Wikimedia rejects anonymous server-side requests; identify the client.
// https://meta.wikimedia.org/wiki/User-Agent_policy
export const USER_AGENT =
  "KalikesamSiteImageFetcher/1.0 (static site build script; images used under their Commons licences)";

/** Longest edge kept on disk. next/image resizes down from this. */
export const MAX_EDGE = 2400;

/** Commons originals used here are a few MB; refuse anything absurd. */
export const MAX_DOWNLOAD_BYTES = 40 * 1024 * 1024;
export const REQUEST_TIMEOUT_MS = 30_000;

const SAFE_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const UPLOAD_THUMB = "https://upload.wikimedia.org/wikipedia/commons/thumb/";
const THUMB_HOST = "https://thumb.wikimedia.org/wikipedia/commons/thumb/";

/** The URL from the manifest first, then the same thumbnail on the other Commons host. */
export function candidateUrls(src) {
  if (src.startsWith(THUMB_HOST)) return [src, src.replace(THUMB_HOST, UPLOAD_THUMB)];
  if (src.startsWith(UPLOAD_THUMB)) return [src, src.replace(UPLOAD_THUMB, THUMB_HOST)];
  return [src];
}

/** Size that fits inside MAX_EDGE without upscaling. */
export function fitWithin(width, height, maxEdge = MAX_EDGE) {
  if (!(width > 0 && height > 0)) throw new Error(`Invalid size ${width}x${height}`);
  const scale = Math.min(1, maxEdge / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function localFile(outDir, id) {
  // Ids become file names; never let one escape the output folder.
  if (!SAFE_ID.test(id)) throw new Error(`Invalid image id "${id}" (use lowercase letters, digits and dashes)`);
  return path.join(outDir, `${id}.jpg`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** GET a URL, retrying on 429 and 5xx with backoff. Returns a Buffer. */
export async function download(
  url,
  { fetchImpl = fetch, retries = 2, backoffMs = 1000, timeoutMs = REQUEST_TIMEOUT_MS, maxBytes = MAX_DOWNLOAD_BYTES } = {},
) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetchImpl(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(timeoutMs), // a stalled connection must not hang dev/build
      });
      if (res.ok) {
        const declared = Number(res.headers?.get?.("content-length") ?? 0);
        if (declared > maxBytes) {
          await res.body?.cancel?.();
          throw new Error(`Refusing ${url}: ${declared} bytes is over the ${maxBytes}-byte limit`);
        }
        const data = Buffer.from(await res.arrayBuffer());
        if (data.length > maxBytes) throw new Error(`Refusing ${url}: response over the ${maxBytes}-byte limit`);
        return data;
      }
      await res.body?.cancel?.(); // release the connection
      lastError = new Error(`HTTP ${res.status} for ${url}`);
      if (res.status !== 429 && res.status < 500) break; // 4xx other than 429 will not recover
    } catch (error) {
      lastError = error;
    }
    if (attempt < retries) await sleep(backoffMs * 2 ** attempt);
  }
  throw lastError;
}

/** Re-encode to a progressive mozjpeg capped at MAX_EDGE. */
export async function optimise(input) {
  const { data, info } = await sharp(input)
    .rotate()
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

/** ~16px WebP data URL for next/image's placeholder="blur". */
export async function blurDataUrl(input) {
  const data = await sharp(input).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${data.toString("base64")}`;
}

async function exists(file) {
  try {
    await stat(file);
    return true;
  } catch {
    return false;
  }
}

/**
 * Fetch every manifest image that is not already on disk (or all with force),
 * then rebuild the metadata file from what is on disk.
 */
export async function syncImages({
  manifest,
  outDir,
  metaPath,
  force = false,
  fetchImpl = fetch,
  backoffMs = 1000,
  delayMs = 250,
  maxConsecutiveFailures = 3,
  log = console.log,
}) {
  await mkdir(outDir, { recursive: true });
  const result = { fetched: [], skipped: [], failed: [] };
  let consecutiveFailures = 0;

  for (const image of manifest) {
    const file = localFile(outDir, image.id);
    if (!force && (await exists(file))) {
      result.skipped.push(image.id);
      continue;
    }
    // Several failures in a row means we are offline or blocked: stop hammering.
    if (consecutiveFailures >= maxConsecutiveFailures) {
      result.failed.push({ id: image.id, error: "skipped after repeated failures" });
      continue;
    }
    let saved = false;
    let lastError;
    for (const url of candidateUrls(image.src)) {
      try {
        const original = await download(url, { fetchImpl, backoffMs });
        const { data } = await optimise(original);
        // Write then rename, so an interrupted run never leaves a truncated JPEG that later runs would skip.
        const temp = `${file}.part`;
        await writeFile(temp, data);
        await rename(temp, file);
        saved = true;
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (saved) {
      consecutiveFailures = 0;
      result.fetched.push(image.id);
      log(`  ✓ ${image.id}`);
    } else {
      consecutiveFailures++;
      result.failed.push({ id: image.id, error: String(lastError?.message ?? lastError) });
      log(`  ✗ ${image.id}: ${lastError?.message ?? lastError}`);
    }
    if (delayMs) await sleep(delayMs);
  }

  const meta = {};
  for (const image of manifest) {
    const file = localFile(outDir, image.id);
    if (!(await exists(file))) continue;
    try {
      const buffer = await readFile(file);
      const { width, height } = await sharp(buffer).metadata();
      meta[image.id] = { width, height, blurDataURL: await blurDataUrl(buffer) };
    } catch (error) {
      // Unreadable file on disk: remove it so the next run downloads it again.
      await rm(file, { force: true });
      result.failed.push({ id: image.id, error: `corrupt file removed: ${error.message}` });
      log(`  ✗ ${image.id}: corrupt file removed, run again to re-download`);
    }
  }
  await writeFile(metaPath, `${JSON.stringify(meta, null, 2)}\n`);
  return { ...result, meta };
}

/** 1200x630 social card cropped from the hero photo. */
export async function writeOpenGraphImage(heroFile, outFile) {
  if (!(await exists(heroFile))) return false;
  const data = await sharp(await readFile(heroFile))
    .resize(1200, 630, { fit: "cover", position: "attention" })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer();
  await writeFile(outFile, data);
  return true;
}
