/*
 * One-off asset-prep script: the source logo (public/logo.png) is delivered
 * on a flat, uniform #F7F7F7 canvas (verified: every sampled border pixel is
 * exactly [247,247,247,255], full opacity, no existing transparency). Used
 * as-is, that opaque light-gray rectangle would render as a visible box on
 * the dark footer. This script does NOT touch the mark's artwork (colors,
 * gradients, shape, proportions) — it only keys out the flat background via
 * flood fill from the canvas edges, with a short distance-based falloff at
 * the boundary to preserve the mark's existing anti-aliased edge instead of
 * leaving a hard cutout halo. Output is a new derived file; the original
 * public/logo.png is left untouched as delivered.
 */
const sharp = require("sharp");
const path = require("path");

const SRC = path.join(__dirname, "..", "public", "logo.png");
const OUT = path.join(__dirname, "..", "public", "logo-mark.png");

const BG = [247, 247, 247];
const HARD_T = 4; // distance below this: definitely background
const SOFT_T = 55; // distance above this: definitely mark, full alpha

function dist(r, g, b) {
  const dr = r - BG[0], dg = g - BG[1], db = b - BG[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

async function main() {
  const { data, info } = await sharp(SRC).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;

  const isBg = new Uint8Array(w * h); // 1 = flood-filled background
  const visited = new Uint8Array(w * h);
  const stack = [];

  function idxOf(x, y) {
    return y * w + x;
  }

  // Seed flood fill from every border pixel that is background-colored.
  for (let x = 0; x < w; x++) {
    for (const y of [0, h - 1]) {
      const i = idxOf(x, y);
      const p = i * 4;
      if (dist(data[p], data[p + 1], data[p + 2]) <= HARD_T) stack.push(i);
    }
  }
  for (let y = 0; y < h; y++) {
    for (const x of [0, w - 1]) {
      const i = idxOf(x, y);
      const p = i * 4;
      if (dist(data[p], data[p + 1], data[p + 2]) <= HARD_T) stack.push(i);
    }
  }

  while (stack.length) {
    const i = stack.pop();
    if (visited[i]) continue;
    visited[i] = 1;
    isBg[i] = 1;
    const x = i % w, y = (i / w) | 0;
    const neighbors = [
      [x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = idxOf(nx, ny);
      if (visited[ni]) continue;
      const p = ni * 4;
      if (dist(data[p], data[p + 1], data[p + 2]) <= HARD_T) stack.push(ni);
    }
  }

  // Second pass: soft falloff for pixels adjacent to the removed region.
  const out = Buffer.from(data); // copy
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = idxOf(x, y);
      const p = i * 4;
      if (isBg[i]) {
        out[p + 3] = 0;
        continue;
      }
      // is this pixel adjacent to a background pixel?
      let adjacentToBg = false;
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1], [x - 1, y - 1], [x + 1, y - 1], [x - 1, y + 1], [x + 1, y + 1]]) {
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        if (isBg[idxOf(nx, ny)]) { adjacentToBg = true; break; }
      }
      if (!adjacentToBg) continue; // interior mark pixel, leave fully opaque
      const d = dist(data[p], data[p + 1], data[p + 2]);
      if (d >= SOFT_T) continue; // far enough from bg color, keep opaque
      const alpha = Math.round(255 * Math.max(0, Math.min(1, (d - HARD_T) / (SOFT_T - HARD_T))));
      out[p + 3] = alpha;
    }
  }

  const transparent = sharp(out, { raw: { width: w, height: h, channels: 4 } }).png();
  const trimmed = await transparent.trim({ threshold: 0 }).toBuffer();
  await sharp(trimmed).toFile(OUT);

  const finalMeta = await sharp(OUT).metadata();
  console.log("wrote", OUT, finalMeta.width, "x", finalMeta.height);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
