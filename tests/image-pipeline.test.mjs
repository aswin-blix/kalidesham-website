import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  MAX_EDGE,
  USER_AGENT,
  candidateUrls,
  download,
  fitWithin,
  syncImages,
  writeOpenGraphImage,
} from "../scripts/lib/images.mjs";

const jpeg = (width, height) =>
  sharp({ create: { width, height, channels: 3, background: "#2f6b4f" } }).jpeg().toBuffer();

const okResponse = (buffer) => ({ ok: true, status: 200, arrayBuffer: async () => buffer });
const errorResponse = (status) => ({ ok: false, status, arrayBuffer: async () => new ArrayBuffer(0) });

describe("candidateUrls", () => {
  it("adds the alternate Commons thumbnail host", () => {
    const thumb = "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/1920px-X.jpg";
    expect(candidateUrls(thumb)).toEqual([
      thumb,
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/1920px-X.jpg",
    ]);
  });

  it("leaves original-file URLs alone", () => {
    const original = "https://upload.wikimedia.org/wikipedia/commons/2/21/Kanikar.jpg";
    expect(candidateUrls(original)).toEqual([original]);
  });
});

describe("fitWithin", () => {
  it("scales the longest edge down to the limit", () => {
    expect(fitWithin(1844, 4096)).toEqual({ width: Math.round(1844 * (MAX_EDGE / 4096)), height: MAX_EDGE });
  });

  it("never upscales small images", () => {
    expect(fitWithin(380, 562)).toEqual({ width: 380, height: 562 });
  });

  it("rejects missing dimensions", () => {
    expect(() => fitWithin(0, 100)).toThrow(/Invalid size/);
  });
});

describe("download", () => {
  it("sends the identifying User-Agent", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(Buffer.from("x")));
    await download("https://example.test/a.jpg", { fetchImpl });
    expect(fetchImpl.mock.calls[0][1].headers["User-Agent"]).toBe(USER_AGENT);
  });

  it("retries rate limits, then succeeds", async () => {
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(errorResponse(429))
      .mockResolvedValueOnce(errorResponse(503))
      .mockResolvedValueOnce(okResponse(Buffer.from("ok")));
    const data = await download("https://example.test/a.jpg", { fetchImpl, backoffMs: 1 });
    expect(data.toString()).toBe("ok");
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });

  it("does not retry a 404", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(errorResponse(404));
    await expect(download("https://example.test/a.jpg", { fetchImpl, backoffMs: 1 })).rejects.toThrow(/404/);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("gives up after the retry budget on network errors", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("ECONNRESET"));
    await expect(download("https://example.test/a.jpg", { fetchImpl, retries: 2, backoffMs: 1 })).rejects.toThrow(
      "ECONNRESET",
    );
    expect(fetchImpl).toHaveBeenCalledTimes(3);
  });
});

describe("syncImages", () => {
  let dir;
  beforeEach(async () => {
    dir = await mkdtemp(path.join(os.tmpdir(), "kalikesam-images-"));
  });
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  const run = (manifest, fetchImpl, extra = {}) =>
    syncImages({
      manifest,
      outDir: path.join(dir, "images"),
      metaPath: path.join(dir, "meta.json"),
      fetchImpl,
      backoffMs: 1,
      delayMs: 0,
      log: () => {},
      ...extra,
    });

  it("downloads, caps size, and records dimensions and blur data", async () => {
    const big = await jpeg(1000, 3000);
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(big));
    const result = await run([{ id: "tall", src: "https://example.test/tall.jpg" }], fetchImpl);

    expect(result.fetched).toEqual(["tall"]);
    const meta = JSON.parse(await readFile(path.join(dir, "meta.json"), "utf8"));
    expect(meta.tall.height).toBe(MAX_EDGE);
    expect(meta.tall.width).toBe(800);
    expect(meta.tall.blurDataURL).toMatch(/^data:image\/webp;base64,/);
  });

  it("skips files already on disk unless forced", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(await jpeg(40, 30)));
    const manifest = [{ id: "a", src: "https://example.test/a.jpg" }];
    await run(manifest, fetchImpl);
    const second = await run(manifest, fetchImpl);
    expect(second.skipped).toEqual(["a"]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    await run(manifest, fetchImpl, { force: true });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("falls back to the alternate host when the first one fails", async () => {
    const image = await jpeg(40, 30);
    const fetchImpl = vi.fn(async (url) =>
      url.startsWith("https://thumb.wikimedia.org") ? errorResponse(404) : okResponse(image),
    );
    const result = await run(
      [{ id: "x", src: "https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/X.jpg/1920px-X.jpg" }],
      fetchImpl,
    );
    expect(result.fetched).toEqual(["x"]);
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it("reports failures and leaves them out of the metadata", async () => {
    const good = await jpeg(40, 30);
    const fetchImpl = vi.fn(async (url) => (url.includes("bad") ? errorResponse(404) : okResponse(good)));
    const result = await run(
      [
        { id: "good", src: "https://example.test/good.jpg" },
        { id: "bad", src: "https://example.test/bad.jpg" },
      ],
      fetchImpl,
    );
    expect(result.failed.map((f) => f.id)).toEqual(["bad"]);
    expect(Object.keys(result.meta)).toEqual(["good"]);
  });

  it("stops requesting after repeated consecutive failures", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new Error("offline"));
    const manifest = ["a", "b", "c", "d", "e"].map((id) => ({ id, src: `https://example.test/${id}.jpg` }));
    const result = await run(manifest, fetchImpl, { maxConsecutiveFailures: 2 });
    expect(result.failed.map((f) => f.id)).toEqual(["a", "b", "c", "d", "e"]);
    expect(result.failed[4].error).toMatch(/repeated failures/);
    expect(fetchImpl).toHaveBeenCalledTimes(2 * 3); // two images x (1 try + 2 retries)
  });

  it("rejects payloads that are not images", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(Buffer.from("<html>blocked</html>")));
    const result = await run([{ id: "html", src: "https://example.test/html.jpg" }], fetchImpl);
    expect(result.failed.map((f) => f.id)).toEqual(["html"]);
    await expect(stat(path.join(dir, "images", "html.jpg"))).rejects.toThrow();
  });
});

describe("writeOpenGraphImage", () => {
  it("writes a 1200x630 card when the hero exists, and skips otherwise", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "kalikesam-og-"));
    try {
      const hero = path.join(dir, "hero.jpg");
      const out = path.join(dir, "og.jpg");
      expect(await writeOpenGraphImage(hero, out)).toBe(false);
      await writeFile(hero, await jpeg(1920, 1440));
      expect(await writeOpenGraphImage(hero, out)).toBe(true);
      const { width, height } = await sharp(out).metadata();
      expect([width, height]).toEqual([1200, 630]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("hardening", () => {
  it("rejects ids that could escape the output folder", async () => {
    const { localFile } = await import("../scripts/lib/images.mjs");
    expect(() => localFile("/out", "../../etc/passwd")).toThrow(/Invalid image id/);
    expect(() => localFile("/out", "Hero Stream")).toThrow(/Invalid image id/);
    expect(localFile("/out", "hero-stream")).toMatch(/hero-stream\.jpg$/);
  });

  it("refuses responses that declare an oversized body", async () => {
    const cancel = vi.fn();
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-length": String(50 * 1024 * 1024) }),
      body: { cancel },
      arrayBuffer: async () => new ArrayBuffer(0),
    });
    await expect(download("https://example.test/big.jpg", { fetchImpl, retries: 0 })).rejects.toThrow(/over the/);
    expect(cancel).toHaveBeenCalled();
  });

  it("passes an abort signal so stalled requests time out", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(okResponse(Buffer.from("x")));
    await download("https://example.test/a.jpg", { fetchImpl });
    expect(fetchImpl.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it("leaves no partial files behind and removes corrupt ones so they are fetched again", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "kalikesam-corrupt-"));
    try {
      const outDir = path.join(dir, "images");
      const metaPath = path.join(dir, "meta.json");
      const opts = { outDir, metaPath, backoffMs: 1, delayMs: 0, log: () => {} };
      const fetchImpl = vi.fn().mockResolvedValue(okResponse(await jpeg(40, 30)));
      await syncImages({ ...opts, manifest: [{ id: "a", src: "https://example.test/a.jpg" }], fetchImpl });
      const { readdir } = await import("node:fs/promises");
      expect(await readdir(outDir)).toEqual(["a.jpg"]);

      await writeFile(path.join(outDir, "a.jpg"), "not a jpeg");
      const second = await syncImages({ ...opts, manifest: [{ id: "a", src: "https://example.test/a.jpg" }], fetchImpl });
      expect(second.failed[0].error).toMatch(/corrupt/);
      await expect(stat(path.join(outDir, "a.jpg"))).rejects.toThrow();
      const third = await syncImages({ ...opts, manifest: [{ id: "a", src: "https://example.test/a.jpg" }], fetchImpl });
      expect(third.fetched).toEqual(["a"]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
