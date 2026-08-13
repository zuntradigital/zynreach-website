import path from "node:path";
import { describe, expect, it } from "vitest";
import sharp from "sharp";
import { ImageWatermarkService } from "./image-watermark";

async function createSolidImage(width: number, height: number, format: "jpeg" | "png" = "jpeg"): Promise<Buffer> {
  const image = sharp({
    create: { width, height, channels: 3, background: { r: 20, g: 40, b: 60 } },
  });
  return format === "jpeg" ? image.jpeg().toBuffer() : image.png().toBuffer();
}

/** A flat solid color compresses too well for JPEG quality to move the file size — this gives quality something to act on. */
async function createNoisyJpegImage(width: number, height: number): Promise<Buffer> {
  const channels = 3;
  const pixels = Buffer.alloc(width * height * channels);
  for (let i = 0; i < pixels.length; i += 1) pixels[i] = Math.floor(Math.random() * 256);
  return sharp(pixels, { raw: { width, height, channels } }).jpeg().toBuffer();
}

describe("ImageWatermarkService", () => {
  it("preserves the original image dimensions and format", async () => {
    const service = new ImageWatermarkService();
    const original = await createSolidImage(800, 600, "jpeg");

    const result = await service.applyWatermark(original);
    const resultMeta = await sharp(result).metadata();

    expect(resultMeta.width).toBe(800);
    expect(resultMeta.height).toBe(600);
    expect(resultMeta.format).toBe("jpeg");
  });

  it("preserves aspect ratio and dimensions for a portrait image", async () => {
    const service = new ImageWatermarkService();
    const original = await createSolidImage(600, 900, "png");

    const result = await service.applyWatermark(original);
    const resultMeta = await sharp(result).metadata();

    expect(resultMeta.width).toBe(600);
    expect(resultMeta.height).toBe(900);
  });

  it("never mutates the input buffer and always returns a new buffer", async () => {
    const service = new ImageWatermarkService();
    const original = await createSolidImage(400, 300, "jpeg");
    const originalCopy = Buffer.from(original);

    const result = await service.applyWatermark(original);

    expect(Buffer.compare(original, originalCopy)).toBe(0);
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(Buffer.compare(result, original)).not.toBe(0);
  });

  it("composites the watermark within its expected bottom-right bounding box, leaving the top-left untouched", async () => {
    const service = new ImageWatermarkService();
    const width = 1000;
    const height = 800;
    const scale = 0.2;
    const padding = 0.02;
    const original = await createSolidImage(width, height, "png");

    const result = await service.applyWatermark(original, { scale, padding, opacity: 0.9 });

    const { data, info } = await sharp(result).raw().toBuffer({ resolveWithObject: true });
    const pixelAt = (x: number, y: number) => {
      const idx = (y * info.width + x) * info.channels;
      return [data[idx], data[idx + 1], data[idx + 2]];
    };

    const backgroundPixel = [20, 40, 60];
    expect(pixelAt(5, 5)).toEqual(backgroundPixel);

    // Independently resize the real logo the same way the service does, to
    // learn its exact placed bounding box without duplicating the service's
    // internal constants. `.metadata()` on a pipeline with a queued
    // `.resize()` returns the *source* dimensions, not the resized output —
    // `toBuffer({ resolveWithObject: true })` is what actually reflects it.
    const shorterEdge = Math.min(width, height);
    const { info: logoInfo } = await sharp(path.join(process.cwd(), "public", "logo-mark.png"))
      .resize({ width: Math.round(shorterEdge * scale) })
      .toBuffer({ resolveWithObject: true });
    // Padding is relative to each edge's own dimension (see WatermarkOptions.padding).
    const boxLeft = width - logoInfo.width - Math.round(width * padding);
    const boxTop = height - logoInfo.height - Math.round(height * padding);

    let changedPixelCount = 0;
    for (let y = boxTop; y < boxTop + logoInfo.height; y += 4) {
      for (let x = boxLeft; x < boxLeft + logoInfo.width; x += 4) {
        if (JSON.stringify(pixelAt(x, y)) !== JSON.stringify(backgroundPixel)) changedPixelCount += 1;
      }
    }
    expect(changedPixelCount).toBeGreaterThan(0);
  });

  it("accepts a Buffer produced from an ArrayBuffer/Uint8Array input", async () => {
    const service = new ImageWatermarkService();
    const original = await createSolidImage(500, 400, "jpeg");
    const uint8 = new Uint8Array(original);

    const result = await service.applyWatermark(uint8);
    const resultMeta = await sharp(result).metadata();

    expect(resultMeta.width).toBe(500);
    expect(resultMeta.height).toBe(400);
  });

  it("rejects out-of-range options", async () => {
    const service = new ImageWatermarkService();
    const original = await createSolidImage(200, 200, "jpeg");

    await expect(service.applyWatermark(original, { scale: 0 })).rejects.toThrow(RangeError);
    await expect(service.applyWatermark(original, { opacity: 1.5 })).rejects.toThrow(RangeError);
    await expect(service.applyWatermark(original, { padding: -1 })).rejects.toThrow(RangeError);
  });

  it("rejects an out-of-range quality option", async () => {
    const service = new ImageWatermarkService();
    const original = await createSolidImage(200, 200, "jpeg");

    await expect(service.applyWatermark(original, { quality: 0 })).rejects.toThrow(RangeError);
    await expect(service.applyWatermark(original, { quality: 101 })).rejects.toThrow(RangeError);
  });

  it("honors a configured quality for lossy re-encodes", async () => {
    const service = new ImageWatermarkService();
    const original = await createNoisyJpegImage(600, 400);

    const lowQuality = await service.applyWatermark(original, { quality: 20 });
    const highQuality = await service.applyWatermark(original, { quality: 95 });

    expect(highQuality.length).toBeGreaterThan(lowQuality.length);
  });

  it("applies the default quality (92) when none is specified", async () => {
    const service = new ImageWatermarkService();
    const original = await createNoisyJpegImage(600, 400);

    const defaultQuality = await service.applyWatermark(original);
    const explicitDefault = await service.applyWatermark(original, { quality: 92 });

    expect(defaultQuality.length).toBe(explicitDefault.length);
  });
});
