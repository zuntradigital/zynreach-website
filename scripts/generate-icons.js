/*
 * Generates favicon/app-icon assets from the background-keyed logo mark
 * (public/logo-mark.png, produced by process-logo.js). The mark's artwork
 * is never altered here — only resized onto square canvases with padding,
 * which is standard icon-asset prep, not a redraw/recolor of the logo.
 *
 * Outputs (Next.js App Router file-convention icons, auto-wired into
 * <head> without any metadata.icons config needed):
 *   src/app/icon.png        512x512, transparent bg  (favicon, PWA icon)
 *   src/app/apple-icon.png  180x180, opaque brand-charcoal bg (iOS requires
 *                            an opaque background; transparent renders black)
 *   src/app/favicon.ico     16/32/48 multi-size, PNG-in-ICO container,
 *                            transparent bg (legacy fallback; overwrites the
 *                            generic pre-rebrand Next.js default icon)
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const MARK = path.join(ROOT, "public", "logo-mark.png");

async function squareCanvas(size, { background = { r: 0, g: 0, b: 0, alpha: 0 }, paddingRatio = 0.16 } = {}) {
  const inner = Math.round(size * (1 - paddingRatio * 2));
  const resized = await sharp(MARK).resize({ width: inner, height: inner, fit: "inside" }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: resized, gravity: "center" }])
    .png()
    .toBuffer();
}

function buildIco(pngBuffers, sizes) {
  const count = pngBuffers.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const dirEntries = [];
  for (let i = 0; i < count; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bit count
    entry.writeUInt32LE(buf.length, 8); // bytes in resource
    entry.writeUInt32LE(offset, 12); // image offset
    dirEntries.push(entry);
    offset += buf.length;
  }
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4); // count
  return Buffer.concat([header, ...dirEntries, ...pngBuffers]);
}

async function main() {
  const icon512 = await squareCanvas(512);
  await sharp(icon512).toFile(path.join(ROOT, "src", "app", "icon.png"));
  console.log("wrote src/app/icon.png (512x512)");

  const apple180 = await squareCanvas(180, {
    background: { r: 0x11, g: 0x11, b: 0x11, alpha: 1 },
    paddingRatio: 0.14,
  });
  await sharp(apple180).toFile(path.join(ROOT, "src", "app", "apple-icon.png"));
  console.log("wrote src/app/apple-icon.png (180x180, charcoal bg)");

  const sizes = [48, 32, 16];
  const pngs = [];
  for (const size of sizes) {
    pngs.push(await squareCanvas(size, { paddingRatio: 0.08 }));
  }
  const ico = buildIco(pngs, sizes);
  fs.writeFileSync(path.join(ROOT, "src", "app", "favicon.ico"), ico);
  console.log("wrote src/app/favicon.ico (16/32/48 multi-size)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
