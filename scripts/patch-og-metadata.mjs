#!/usr/bin/env node
/**
 * One-off: dopuni metadata export na /vodici/* i /alati/* stranicama.
 * Pokreni: node scripts/patch-og-metadata.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function walk(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (ent.name === 'page.tsx') acc.push(p);
  }
  return acc;
}

function patchFile(filePath, kind) {
  let src = fs.readFileSync(filePath, 'utf8');
  if (src.includes('buildVodicMetadata') || src.includes('buildAlatMetadata')) return false;
  if (src.includes('buildPublicPageMetadata')) return false;

  const slugMatch = src.match(/const SLUG = ['"]([^'"]+)['"]/);
  const titleMatch = src.match(/const TITLE = ['"]([^'"]+)['"]/);
  const descMatch =
    src.match(/const META_DESC =\s*\n?\s*['"]([^'"]+)['"]/s) ||
    src.match(/const DESC =\s*\n?\s*['"]([^'"]+)['"]/s);

  if (!descMatch) return false;

  const description = descMatch[1];
  const rel = path.relative(path.join(root, 'src/app'), filePath);
  const isLanding = rel === 'vodici/page.tsx' || rel === 'alati/page.tsx';

  if (isLanding) return false;

  let slug = slugMatch?.[1];
  if (!slug) {
    const dir = path.basename(path.dirname(filePath));
    if (dir === 'vodici' || dir === 'alati') return false;
    slug = dir;
  }

  const titleFromMeta = src.match(/export const metadata[^=]*=\s*\{[\s\S]*?title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch?.[1] ?? titleFromMeta?.[1];
  if (!title) return false;

  const importLine =
    kind === 'vodic'
      ? "import { buildVodicMetadata } from '@/lib/og-metadata';"
      : "import { buildAlatMetadata } from '@/lib/og-metadata';";

  if (!src.includes(importLine)) {
    src = src.replace(
      /import type \{ Metadata \} from 'next';/,
      `import type { Metadata } from 'next';\n\n${importLine}`,
    );
  }

  const ogTitleMatch = src.match(/openGraph:\s*\{[\s\S]*?title:\s*['"]([^'"]+)['"]/);
  const ogTitle = ogTitleMatch?.[1];

  const keywordsMatch = src.match(/keywords:\s*\[[\s\S]*?\],/);
  const hasKeywords = !!keywordsMatch;

  let replacement;
  if (kind === 'vodic') {
    replacement = ogTitle
      ? `export const metadata: Metadata = buildVodicMetadata(\n  SLUG,\n  '${title.replace(/'/g, "\\'")}',\n  META_DESC,\n  '${ogTitle.replace(/'/g, "\\'")}',\n);`
      : `export const metadata: Metadata = buildVodicMetadata(\n  SLUG,\n  '${title.replace(/'/g, "\\'")}',\n  META_DESC,\n);`;
  } else {
    const kwArg = hasKeywords ? `,\n  { keywords: ${keywordsMatch[0].replace(/,$/, '')} }` : '';
    replacement = `export const metadata: Metadata = buildAlatMetadata(\n  '${slug}',\n  TITLE,\n  DESC${kwArg}\n);`;
  }

  const metaRe = /export const metadata(?:: Metadata)? = \{[\s\S]*?\n\};/;
  if (!metaRe.test(src)) return false;

  src = src.replace(metaRe, replacement);
  fs.writeFileSync(filePath, src);
  return true;
}

let vCount = 0;
let aCount = 0;

for (const f of walk(path.join(root, 'src/app/vodici'))) {
  if (patchFile(f, 'vodic')) vCount++;
}

for (const f of walk(path.join(root, 'src/app/alati'))) {
  if (patchFile(f, 'alat')) aCount++;
}

console.log(`Patched vodici: ${vCount}, alati: ${aCount}`);
