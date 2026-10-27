// Fails if any page in the static export links to a site-relative URL that
// doesn't exist in it. Run after `pnpm build`; external links aren't checked.
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';

const outDir = 'out';
const pages = await glob('**/*.html', { cwd: outDir });
const broken = [];

// GitHub Pages serves /a/ from a/index.html and redirects /a to /a/.
function exists(urlPath) {
  const file = path.join(outDir, decodeURIComponent(urlPath));
  const index = path.join(file, 'index.html');
  if (urlPath.endsWith('/')) return existsSync(index);
  return existsSync(file) || existsSync(`${file}.html`) || existsSync(index);
}

for (const page of pages) {
  const html = await readFile(path.join(outDir, page), 'utf8');
  for (const [, url] of html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)) {
    const urlPath = url.split(/[?#]/)[0];
    if (!exists(urlPath)) broken.push(`${page}: ${url}`);
  }
}

if (broken.length > 0) {
  console.error(`Broken internal links:\n  ${broken.join('\n  ')}`);
  process.exit(1);
}
console.log(`Checked ${pages.length} pages: no broken internal links.`);
