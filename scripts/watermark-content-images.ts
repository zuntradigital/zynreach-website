/**
 * Applies the site's one watermark service (src/lib/services/image-watermark.ts
 * — the same one that will process article-upload images once that flow
 * exists) to every static content/visual image already shipped in the repo.
 *
 * These images aren't uploaded at request time — they're static assets in
 * public/images/**, referenced by path from content-data files (industries,
 * customer stories, mega-menu promos) and rendered via next/image. There is
 * no per-request pipeline to hook the service into for them, so this script
 * is the equivalent of "uploading" each one through the existing service
 * once and persisting the watermarked result — after this runs, the files
 * on disk *are* the watermarked versions next/image serves, so no component
 * or content-data changes are needed and no layout/dimensions change.
 *
 * Deliberately scoped to public/images/** only — never public/logo.png,
 * public/logo-mark.png, favicons, or any icon/SVG, all of which are
 * branding/UI assets, not content imagery.
 *
 * Re-run this whenever a new content image is added under public/images/.
 * Usage: npx tsx scripts/watermark-content-images.ts
 */
import path from "node:path";
import { readdir, readFile, writeFile, rename } from "node:fs/promises";
import { imageWatermarkService } from "../src/lib/services/image-watermark";

const CONTENT_IMAGE_ROOT = path.join(process.cwd(), "public", "images");
const IMAGE_EXTENSION_PATTERN = /\.(jpe?g|png|webp)$/i;

async function collectImageFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectImageFiles(entryPath);
      return IMAGE_EXTENSION_PATTERN.test(entry.name) ? [entryPath] : [];
    })
  );
  return files.flat();
}

async function watermarkFile(filePath: string): Promise<void> {
  const original = await readFile(filePath);
  const watermarked = await imageWatermarkService.applyWatermark(original);
  // Write to a temp path then rename over the original — avoids reading
  // and writing the same path through overlapping sharp pipelines.
  const tmpPath = `${filePath}.watermarking.tmp`;
  await writeFile(tmpPath, watermarked);
  await rename(tmpPath, filePath);
  const relPath = path.relative(process.cwd(), filePath);
  console.log(`watermarked ${relPath} (${(watermarked.length / 1024).toFixed(0)}KB)`);
}

async function main() {
  const files = await collectImageFiles(CONTENT_IMAGE_ROOT);
  if (files.length === 0) {
    console.log("No content images found under public/images/.");
    return;
  }
  for (const file of files) {
    await watermarkFile(file);
  }
  console.log(`Done — watermarked ${files.length} image(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
