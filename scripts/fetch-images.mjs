// Downloads the Fluent Emoji 3D illustrations (MIT licensed, © Microsoft) used by
// src/data/vocabulary.ts into public/vocab/. Existing files are kept.
// Usage: npm run fetch-images [-- --prune]   (--prune deletes images no word uses)
import { existsSync, readdirSync, unlinkSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { VOCABULARY, imageFile } from '../src/data/vocabulary.ts';

const BASE = 'https://cdn.jsdelivr.net/gh/microsoft/fluentui-emoji@main/assets';
const DIR = new URL('../public/vocab/', import.meta.url);
const fileSlug = (name) => name.toLowerCase().replace(/ /g, '_');

const candidates = (source) => [
  `${BASE}/${encodeURIComponent(source)}/3D/${fileSlug(source)}_3d.png`,
  `${BASE}/${encodeURIComponent(source)}/Default/3D/${fileSlug(source)}_3d_default.png`,
];

const sources = [...new Set(VOCABULARY.flatMap((w) => w.images))];
let failed = 0;

for (const source of sources) {
  const target = new URL(imageFile(source), DIR);
  if (existsSync(target)) continue;
  let ok = false;
  for (const url of candidates(source)) {
    const res = await fetch(url);
    if (!res.ok) continue;
    await writeFile(target, Buffer.from(await res.arrayBuffer()));
    console.log(`✓ ${source} → ${imageFile(source)}`);
    ok = true;
    break;
  }
  if (!ok) {
    failed++;
    console.error(`✗ no Fluent Emoji named "${source}"`);
  }
}

const used = new Set(sources.map(imageFile));
const unused = readdirSync(DIR).filter((f) => f.endsWith('.png') && !used.has(f));
if (unused.length && process.argv.includes('--prune')) {
  unused.forEach((f) => unlinkSync(new URL(f, DIR)));
  console.log(`Removed ${unused.length} unused image(s).`);
} else if (unused.length) {
  console.log(`${unused.length} unused image(s) in public/vocab (run with --prune to delete).`);
}

process.exit(failed ? 1 : 0);
