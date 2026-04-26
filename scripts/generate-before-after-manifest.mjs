#!/usr/bin/env node
/**
 * Scans assets/imgs/gallery/pairs/ for gallery projects.
 *
 * Kitchen & bathroom:
 *   - If the folder contains only `before.*` + `after.*` (and no other images) → manifest `mode: "pair"`.
 *   - Otherwise (1+ photos, extra files, or missing before/after) → `mode: "gallery"` with all images.
 *
 * Basement suites, flooring, feature walls, exteriors — multiple photos per folder:
 *   pairs/<category>/<slug>/*.jpg (any names; sorted alphabetically)
 *   meta.json optional { "title": "..." }
 *
 * Legacy: top-level folders under pairs/ → try pair first, else multi-photo → category "feature-walls".
 *
 * Run: node scripts/generate-before-after-manifest.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const PAIRS_DIR = path.join(ROOT, "assets", "imgs", "gallery", "pairs");
const OUT_FILE = path.join(ROOT, "assets", "gallery", "before-after-manifest.json");

const CATEGORIES = new Set([
  "kitchen",
  "bathroom",
  "basement-suites",
  "flooring",
  "feature-walls",
  "exteriors",
]);

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

function findNamedFile(dir, baseName) {
  const want = baseName.toLowerCase();
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    const ext = path.extname(e.name);
    if (!IMAGE_EXT.test(ext)) continue;
    const stem = path.basename(e.name, ext).toLowerCase();
    if (stem === want) return e.name;
  }
  return null;
}

/** All image files in dir (excluding non-images), sorted for stable order */
function listGalleryImageFiles(dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isFile()) continue;
    if (!IMAGE_EXT.test(path.extname(e.name))) continue;
    files.push(e.name);
  }
  return files.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
}

function readMetaTitle(dir) {
  const metaPath = path.join(dir, "meta.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    const raw = fs.readFileSync(metaPath, "utf8");
    const j = JSON.parse(raw);
    return typeof j.title === "string" ? j.title : null;
  } catch {
    return null;
  }
}

function slugToTitle(slug) {
  return slug
    .split(/[-_]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function relPath(parts) {
  return parts.join("/").replace(/\\/g, "/");
}

function pushNestedGallery(projects, category, slug, dir) {
  const files = listGalleryImageFiles(dir);
  if (!files.length) return;

  const photos = files.map((f) =>
    relPath(["assets", "imgs", "gallery", "pairs", category, slug, f]),
  );

  projects.push({
    mode: "gallery",
    id: `${category}/${slug}`,
    category,
    title: readMetaTitle(dir) || slugToTitle(slug),
    photos,
  });
}

/**
 * Kitchen/bathroom and other nested categories: pair only when folder is exactly before+after.
 */
function pushNestedProject(projects, category, slug, dir) {
  const files = listGalleryImageFiles(dir);
  if (!files.length) return;

  const beforeFile = findNamedFile(dir, "before");
  const afterFile = findNamedFile(dir, "after");
  const isExactlyBeforeAfterPair =
    Boolean(beforeFile && afterFile && beforeFile !== afterFile) &&
    files.length === 2 &&
    files.includes(beforeFile) &&
    files.includes(afterFile);

  if (isExactlyBeforeAfterPair) {
    projects.push({
      mode: "pair",
      id: `${category}/${slug}`,
      category,
      title: readMetaTitle(dir) || slugToTitle(slug),
      before: relPath(["assets", "imgs", "gallery", "pairs", category, slug, beforeFile]),
      after: relPath(["assets", "imgs", "gallery", "pairs", category, slug, afterFile]),
    });
    return;
  }

  pushNestedGallery(projects, category, slug, dir);
}

function pushLegacyRootProject(projects, slug, dir) {
  const beforeFile = findNamedFile(dir, "before");
  const afterFile = findNamedFile(dir, "after");

  if (beforeFile && afterFile) {
    projects.push({
      mode: "pair",
      id: slug,
      category: "feature-walls",
      title: readMetaTitle(dir) || slugToTitle(slug),
      before: relPath(["assets", "imgs", "gallery", "pairs", slug, beforeFile]),
      after: relPath(["assets", "imgs", "gallery", "pairs", slug, afterFile]),
    });
    return;
  }

  const files = listGalleryImageFiles(dir);
  if (!files.length) return;

  const photos = files.map((f) =>
    relPath(["assets", "imgs", "gallery", "pairs", slug, f]),
  );

  projects.push({
    mode: "gallery",
    id: slug,
    category: "feature-walls",
    title: readMetaTitle(dir) || slugToTitle(slug),
    photos,
  });
}

function main() {
  const projects = [];

  if (!fs.existsSync(PAIRS_DIR)) {
    fs.mkdirSync(PAIRS_DIR, { recursive: true });
  }

  const topLevel = fs.readdirSync(PAIRS_DIR, { withFileTypes: true });

  for (const entry of topLevel) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;
    if (name.startsWith(".")) continue;

    const topPath = path.join(PAIRS_DIR, name);

    if (CATEGORIES.has(name)) {
      const slugDirs = fs.readdirSync(topPath, { withFileTypes: true });
      for (const sd of slugDirs) {
        if (!sd.isDirectory()) continue;
        const slug = sd.name;
        if (slug.startsWith(".")) continue;
        const dir = path.join(topPath, slug);

        pushNestedProject(projects, name, slug, dir);
      }
      continue;
    }

    pushLegacyRootProject(projects, name, topPath);
  }

  projects.sort((a, b) => {
    const c = a.category.localeCompare(b.category, undefined, { sensitivity: "base" });
    if (c !== 0) return c;
    return (a.title || "").localeCompare(b.title || "", undefined, { sensitivity: "base" });
  });

  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify({ projects }, null, 2) + "\n", "utf8");

  console.log(`Wrote ${projects.length} project(s) → ${path.relative(ROOT, OUT_FILE)}`);
}

main();
