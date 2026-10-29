// Builds every RHEMA brand asset from `bitmaps.mjs`: SVG masters, the app and
// tray PNGs, the Windows .ico, the mobile launcher icons, the favicon and the
// in-app wordmark paths.
//
//   cd brand && bun install && bun build.mjs
//
// Desktop .icns and the remaining Tauri icon sizes come from
// `bun tauri icon brand/png/icon-1024.png` run at the repo root; this script
// then overwrites icon.ico and the small PNGs with hand-tuned small glyphs.

import { Resvg } from "@resvg/resvg-js";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";
import {
  CLEANUP_BADGE,
  COLORS,
  LETTERS,
  MARK,
  MARK_SMALL,
  TRAY,
  WORD,
} from "./bitmaps.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const out = (rel) => {
  const p = join(ROOT, rel);
  mkdirSync(dirname(p), { recursive: true });
  return p;
};

// ── SVG building ─────────────────────────────────────────────────────────

const size = (bitmap) => ({ rows: bitmap.length, cols: bitmap[0].length });

/** Circles for a bitmap whose top-left cell starts at (x0, y0). */
function dots(
  bitmap,
  { x0, y0, pitch, radius, ink, red = COLORS.signal, unlit = false },
) {
  let s = "";
  bitmap.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const cx = +(x0 + pitch / 2 + x * pitch).toFixed(3);
      const cy = +(y0 + pitch / 2 + y * pitch).toFixed(3);
      if (ch === "#")
        s += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${ink}"/>`;
      else if (ch === "R")
        s += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${red}"/>`;
      else if (unlit)
        s += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${COLORS.unlit}" fill-opacity="${COLORS.unlitOpacity}"/>`;
    });
  });
  return s;
}

/** A bitmap centred in a w x h box, its grid `fill` of the shorter side. */
function centred(bitmap, w, h, { fill = 0.78, dot = 0.72, ...opts }) {
  const { rows, cols } = size(bitmap);
  const pitch = Math.min((w * fill) / cols, (h * fill) / rows);
  return dots(bitmap, {
    x0: (w - cols * pitch) / 2,
    y0: (h - rows * pitch) / 2,
    pitch,
    radius: +((pitch * dot) / 2).toFixed(3),
    ...opts,
  });
}

const svgDoc = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>\n`;

/** The app tile: black rounded square, full mark, faint unlit dots when big. */
function tileSvg(px, { round = false, bleed = false } = {}) {
  const small = px <= 32;
  const bitmap = small ? MARK_SMALL : MARK;
  const inset = bleed ? 0 : px * (32 / 1024);
  const side = px - inset * 2;
  const shape = round
    ? `<circle cx="${px / 2}" cy="${px / 2}" r="${side / 2}" fill="${COLORS.tile}"/>`
    : bleed
      ? `<rect width="${px}" height="${px}" fill="${COLORS.tile}"/>`
      : `<rect x="${inset}" y="${inset}" width="${side}" height="${side}" rx="${side * 0.22}" fill="${COLORS.tile}"/>`;
  const body = centred(bitmap, px, px, {
    fill: small ? 0.66 : round ? 0.62 : 0.74,
    dot: small ? 0.8 : 0.72,
    ink: COLORS.ink,
    unlit: px >= 128,
  });
  return svgDoc(px, px, shape + body);
}

/** A tray glyph on a transparent ground. */
function glyphSvg(px, bitmap, ink, { margin = 0.06 } = {}) {
  const body = centred(bitmap, px, px, { fill: 1 - margin * 2, dot: 0.8, ink });
  return svgDoc(px, px, body);
}

/** A glyph on a small black tile, for the coloured tray theme and macOS. */
function smallTileSvg(px, bitmap, { margin = 0 } = {}) {
  const side = px - margin * 2;
  const shape = `<rect x="${margin}" y="${margin}" width="${side}" height="${side}" rx="${side * 0.22}" fill="${COLORS.tile}"/>`;
  const body = centred(bitmap, px, px, {
    fill: 0.62 * (side / px),
    dot: 0.8,
    ink: COLORS.ink,
  });
  return svgDoc(px, px, shape + body);
}

/** Android adaptive-icon foreground: the mark inside the 66/108 safe zone. */
function foregroundSvg(px) {
  const safe = px * (66 / 108);
  const offset = (px - safe) / 2;
  const { rows, cols } = size(MARK);
  const pitch = (safe * 0.86) / cols;
  const body = dots(MARK, {
    x0: offset + (safe - cols * pitch) / 2,
    y0: offset + (safe - rows * pitch) / 2,
    pitch,
    radius: +(pitch * 0.36).toFixed(3),
    ink: COLORS.ink,
  });
  return svgDoc(px, px, body);
}

function puckBootSvg() {
  const px = 466;
  const body =
    `<rect width="${px}" height="${px}" fill="#000"/>` +
    centred(MARK, px, px, {
      fill: 0.7,
      dot: 0.7,
      ink: COLORS.ink,
      unlit: true,
    });
  return svgDoc(px, px, body);
}

// ── Wordmark geometry (shared by the SVG lockup and src wordmark.ts) ──────

const WM = {
  pitch: 8.4,
  radius: 3.4,
  icon: 88,
  gap: 18,
};

/** Circle path data for the word, baseline at y = 0, dots up to the cap. */
function wordmarkPath() {
  const { pitch, radius: r } = WM;
  let d = "";
  let col = 0;
  for (const letter of WORD) {
    const glyph = LETTERS[letter];
    glyph.forEach((row, y) => {
      [...row].forEach((ch, x) => {
        if (ch !== "#") return;
        const cx = r + (col + x) * pitch;
        const cy = -r - (glyph.length - 1 - y) * pitch;
        d += `M${(cx - r).toFixed(2)} ${cy.toFixed(2)}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
      });
    });
    col += glyph[0].length + 1;
  }
  const cols = col - 1;
  const width = 2 * r + (cols - 1) * pitch;
  const capHeight = 2 * r + 6 * pitch;
  return { d, width: +width.toFixed(3), capHeight: +capHeight.toFixed(3) };
}

function writeWordmarkTs() {
  const { d, width, capHeight } = wordmarkPath();
  const originX = WM.icon + WM.gap;
  const originY = +((WM.icon - capHeight) / 2 + capHeight).toFixed(3);
  const lockupWidth = +(originX + width).toFixed(3);
  const ts = `/**
 * The RHEMA wordmark as dot paths, generated by \`brand/build.mjs\` from the
 * 5 x 7 capitals in \`brand/bitmaps.mjs\`, so a card can set it in whatever
 * colour its ground needs. The icon is an ${WM.icon}-unit square at the origin and the
 * word's baseline starts at \`WORDMARK_ORIGIN\`; one unit is one pixel of the
 * lockup at ${WM.icon} px tall. Do not edit by hand.
 */

export const WORDMARK_ORIGIN = { x: ${originX}, y: ${originY} } as const;

/** The icon's size and the whole lockup's width, in lockup units. */
export const LOCKUP_ICON = ${WM.icon};
export const LOCKUP_WIDTH = ${lockupWidth};

/** The wordmark's own width and cap height, in lockup units. */
export const WORDMARK_WIDTH = ${width};
export const WORDMARK_CAP_HEIGHT = ${capHeight};

/** "${WORD}", baseline at y = 0. */
export const WORDMARK_PATH =
  "${d}";
`;
  writeFileSync(out("src/components/pages/insights/wordmark.ts"), ts);
  return { d, width, capHeight, originX, originY, lockupWidth };
}

function lockupSvg(ink, wm) {
  const h = WM.icon;
  const tile = tileSvg(1024)
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>\n$/, "");
  const body =
    `<svg x="0" y="0" width="${h}" height="${h}" viewBox="0 0 1024 1024">${tile}</svg>` +
    `<path transform="translate(${wm.originX} ${wm.originY})" fill="${ink}" d="${wm.d}"/>`;
  return svgDoc(Math.ceil(wm.lockupWidth), h, body);
}

// ── PNG / ICO encoding ─────────────────────────────────────────────────────

const CRC = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
function crc32(buf) {
  let c = -1;
  for (const b of buf) c = CRC[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
/** Encode RGBA pixels; `opaque` drops the alpha channel over black. */
function encodePng(rgba, w, h, { opaque = false } = {}) {
  const ch = opaque ? 3 : 4;
  const raw = Buffer.alloc((w * ch + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * ch + 1)] = 0;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const o = y * (w * ch + 1) + 1 + x * ch;
      if (opaque) {
        const a = rgba[i + 3] / 255;
        raw[o] = Math.round(rgba[i] * a);
        raw[o + 1] = Math.round(rgba[i + 1] * a);
        raw[o + 2] = Math.round(rgba[i + 2] * a);
      } else {
        raw[o] = rgba[i];
        raw[o + 1] = rgba[i + 1];
        raw[o + 2] = rgba[i + 2];
        raw[o + 3] = rgba[i + 3];
      }
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = opaque ? 2 : 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function render(svg, px) {
  const img = new Resvg(svg, { fitTo: { mode: "width", value: px } }).render();
  return { pixels: img.pixels, w: img.width, h: img.height };
}
function png(svg, px, opts) {
  const { pixels, w, h } = render(svg, px);
  return encodePng(pixels, w, h, opts);
}
function writePng(rel, svg, px, opts) {
  writeFileSync(out(rel), png(svg, px, opts));
}

function ico(sizes) {
  const images = sizes.map((s) => png(tileSvg(s), s));
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach((data, i) => {
    const s = sizes[i];
    const e = 6 + i * 16;
    header[e] = s >= 256 ? 0 : s;
    header[e + 1] = s >= 256 ? 0 : s;
    header[e + 2] = 0;
    header[e + 3] = 0;
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images]);
}

// ── Outputs ───────────────────────────────────────────────────────────────

const written = [];
const svgFile = (rel, svg) => {
  writeFileSync(out(rel), svg);
  written.push(rel);
};
const pngFile = (rel, svg, px, opts) => {
  writePng(rel, svg, px, opts);
  written.push(rel);
};

// Masters.
svgFile("brand/svg/mark.svg", tileSvg(1024));
svgFile(
  "brand/svg/glyph.svg",
  svgDoc(
    110,
    70,
    dots(MARK, { x0: 0, y0: 0, pitch: 10, radius: 3.6, ink: "currentColor" }),
  ),
);
svgFile("brand/svg/tray-16.svg", glyphSvg(16, TRAY.recording, COLORS.ink));
svgFile("brand/svg/puck-boot.svg", puckBootSvg());
const wm = writeWordmarkTs();
written.push("src/components/pages/insights/wordmark.ts");
svgFile("brand/svg/lockup-dark.svg", lockupSvg(COLORS.ink, wm));
svgFile("brand/svg/lockup-light.svg", lockupSvg(COLORS.inkOnLight, wm));

pngFile("brand/png/icon-1024.png", tileSvg(1024), 1024);
pngFile("brand/png/icon-256.png", tileSvg(256), 256);
pngFile(
  "brand/png/lockup-dark-h256.png",
  lockupSvg(COLORS.ink, wm),
  Math.ceil(wm.lockupWidth * (256 / WM.icon)),
);
pngFile(
  "brand/png/lockup-light-h256.png",
  lockupSvg(COLORS.inkOnLight, wm),
  Math.ceil(wm.lockupWidth * (256 / WM.icon)),
);
pngFile("brand/png/puck-boot.png", puckBootSvg(), 466);

// Web.
svgFile("public/favicon.svg", tileSvg(64));

// Desktop window and tray icons (sizes match the files they replace).
const R = "src-tauri/resources";
pngFile(`${R}/rhema.png`, tileSvg(128), 128);
pngFile(`${R}/window_icon_dark.png`, tileSvg(128), 128);
pngFile(`${R}/window_icon_light.png`, tileSvg(128), 128);
pngFile(`${R}/tray_idle.png`, glyphSvg(32, TRAY.idle, COLORS.ink), 32);
pngFile(
  `${R}/tray_idle_dark.png`,
  glyphSvg(32, TRAY.idle, COLORS.inkOnLight),
  32,
);
pngFile(
  `${R}/tray_recording.png`,
  glyphSvg(64, TRAY.recording, COLORS.ink),
  64,
);
pngFile(
  `${R}/tray_recording_dark.png`,
  glyphSvg(64, TRAY.recording, COLORS.inkOnLight),
  64,
);
pngFile(
  `${R}/tray_transcribing.png`,
  glyphSvg(64, TRAY.transcribing, COLORS.ink),
  64,
);
pngFile(
  `${R}/tray_transcribing_dark.png`,
  glyphSvg(64, TRAY.transcribing, COLORS.inkOnLight),
  64,
);
pngFile(`${R}/tray_idle_symbolic.png`, glyphSvg(64, TRAY.idle, COLORS.ink), 64);
pngFile(
  `${R}/tray_idle_macos.png`,
  smallTileSvg(36, TRAY.idle, { margin: 2 }),
  36,
);
pngFile(`${R}/recording.png`, smallTileSvg(64, TRAY.recording), 64);
pngFile(`${R}/transcribing.png`, smallTileSvg(64, TRAY.transcribing), 64);

// Bundled cleanup model badge (model picker).
pngFile(
  "src/assets/cleanup-mini.png",
  svgDoc(
    128,
    128,
    `<rect x="4" y="4" width="120" height="120" rx="26" fill="#000"/>` +
      centred(CLEANUP_BADGE, 128, 128, {
        fill: 0.7,
        dot: 0.72,
        ink: COLORS.ink,
        unlit: true,
      }),
  ),
  128,
);

// Mobile: Android launcher icons.
const A = "mobile/android/app/src/main/res";
for (const [dpi, s, layer] of [
  ["mdpi", 48, 108],
  ["hdpi", 72, 162],
  ["xhdpi", 96, 216],
  ["xxhdpi", 144, 324],
  ["xxxhdpi", 192, 432],
]) {
  pngFile(`${A}/mipmap-${dpi}/ic_launcher.png`, tileSvg(s), s);
  pngFile(
    `${A}/mipmap-${dpi}/ic_launcher_round.png`,
    tileSvg(s, { round: true }),
    s,
  );
  pngFile(
    `${A}/mipmap-${dpi}/ic_launcher_background.png`,
    svgDoc(
      layer,
      layer,
      `<rect width="${layer}" height="${layer}" fill="#000"/>`,
    ),
    layer,
  );
  pngFile(
    `${A}/mipmap-${dpi}/ic_launcher_foreground.png`,
    foregroundSvg(layer),
    layer,
  );
  // Tauri's own Android icon set (from `tauri icon`) needs the same background.
  pngFile(
    `src-tauri/icons/android/mipmap-${dpi}/ic_launcher_background.png`,
    svgDoc(
      layer,
      layer,
      `<rect width="${layer}" height="${layer}" fill="#000"/>`,
    ),
    layer,
  );
}

// Mobile: iOS app icons (full bleed, no alpha; iOS rounds the corners).
const I = "mobile/ios/Runner/Assets.xcassets/AppIcon.appiconset";
for (const [name, s] of [
  ["Icon-App-1024x1024@1x.png", 1024],
  ["Icon-App-20x20@1x.png", 20],
  ["Icon-App-20x20@2x.png", 40],
  ["Icon-App-20x20@3x.png", 60],
  ["Icon-App-29x29@1x.png", 29],
  ["Icon-App-29x29@2x.png", 58],
  ["Icon-App-29x29@3x.png", 87],
  ["Icon-App-40x40@1x.png", 40],
  ["Icon-App-40x40@2x.png", 80],
  ["Icon-App-40x40@3x.png", 120],
  ["Icon-App-60x60@2x.png", 120],
  ["Icon-App-60x60@3x.png", 180],
  ["Icon-App-76x76@1x.png", 76],
  ["Icon-App-76x76@2x.png", 152],
  ["Icon-App-83.5x83.5@2x.png", 167],
]) {
  pngFile(`${I}/${name}`, tileSvg(s, { bleed: true }), s, { opaque: true });
}

// Desktop .ico with hand-tuned small sizes (run after `tauri icon`).
writeFileSync(
  out("src-tauri/icons/icon.ico"),
  ico([16, 24, 32, 48, 64, 128, 256]),
);
written.push("src-tauri/icons/icon.ico");
for (const [name, s] of [
  ["32x32.png", 32],
  ["Square30x30Logo.png", 30],
  ["Square44x44Logo.png", 44],
  ["StoreLogo.png", 50],
]) {
  pngFile(`src-tauri/icons/${name}`, tileSvg(s), s);
}

console.log(`wrote ${written.length} files`);
