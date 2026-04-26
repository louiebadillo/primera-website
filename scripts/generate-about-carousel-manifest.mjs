#!/usr/bin/env node
/**
 * Generates assets/gallery/about-carousel-manifest.json from:
 *   assets/imgs/about/about-carousel/*
 *
 * Run:
 *   node scripts/generate-about-carousel-manifest.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

const IN_DIR = path.join(ROOT, "assets", "imgs", "about", "about-carousel");
const OUT_FILE = path.join(ROOT, "assets", "gallery", "about-carousel-manifest.json");

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((name) => IMAGE_EXT.test(path.extname(name)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  return files.map((name) =>
    ["assets", "imgs", "about", "about-carousel", name].join("/").replace(/\\/g, "/"),
  );
}

function main() {
  const photos = listImages(IN_DIR);
  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(OUT_FILE, JSON.stringify({ photos }, null, 2) + "\n", "utf8");
  console.log(`Wrote ${photos.length} photo(s) → ${path.relative(ROOT, OUT_FILE)}`);
}

main();

