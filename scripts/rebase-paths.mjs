/**
 * Rewrites the root-absolute URLs in a built dist/ so the same build can be
 * served from a subfolder (GitHub Pages serves this repo at /<repo>/).
 * The normal `npm run build` is untouched and stays correct for FTP at a domain root.
 *
 * Usage: node scripts/rebase-paths.mjs /code1
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const arg = process.argv[2] ?? '';
// "relative" makes every internal URL relative, for a host whose base path is
// not known at build time. Otherwise the argument is the subfolder to prefix.
const RELATIVE = arg === 'relative';
const prefix = RELATIVE ? '' : arg.replace(/\/+$/, '');
if (!RELATIVE && !prefix.startsWith('/')) { console.error('usage: rebase-paths.mjs /subfolder | relative'); process.exit(1); }

// Only these roots are rewritten. Anything else keeps its leading slash, so
// absolute external URLs and unrelated strings are never touched.
const DIRS = ['assets', 'fonts', 'brand', 'og', 'video'];
const PAGES = ['diagnostico', 'privacidade', '404.html'];

const patterns = RELATIVE
  ? [
      ...DIRS.map((d) => [new RegExp(`(["'(\\s])/(${d}/)`, 'g'), `$1$2`]),
      [/(["'(])\/diagnostico(["')#?])/g, '$1diagnostico.html$2'],
      [/(["'(])\/privacidade(["')#?])/g, '$1privacidade.html$2'],
      [/(["'(])\/404\.html(["')#?])/g, '$1404.html$2'],
      [/(href=")\/(#|")/g, '$1./$2'],
    ]
  : [
      ...DIRS.map((d) => [new RegExp(`(["'(\\s])/(${d}/)`, 'g'), `$1${prefix}/$2`]),
      ...PAGES.map((p) => [new RegExp(`(["'(])/(${p})(["')#?])`, 'g'), `$1${prefix}/$2$3`]),
      // bare root links: href="/" and href="/#anchor"
      [/(href=")\/(#|")/g, `$1${prefix}/$2`],
    ];

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else yield p;
  }
}

let touched = 0;
for await (const file of walk('dist')) {
  if (!['.html', '.css', '.js', '.xml', '.txt'].includes(extname(file))) continue;
  const before = await readFile(file, 'utf8');
  let after = before;
  for (const [re, to] of patterns) after = after.replace(re, to);
  if (after !== before) { await writeFile(file, after); touched++; }
}
// The subfolder copy is a preview of a site whose real home is the customer's
// domain, so keep it out of search results.
await writeFile('dist/robots.txt', 'User-agent: *\nDisallow: /\n');
for (const page of ['index.html', '404.html', 'diagnostico/index.html', 'privacidade/index.html']) {
  const f = `dist/${page}`;
  try {
    const html = await readFile(f, 'utf8');
    if (!html.includes('name="robots"')) {
      await writeFile(f, html.replace('<meta name="viewport"', '<meta name="robots" content="noindex, nofollow" />\n    <meta name="viewport"'));
    }
  } catch { /* page not built */ }
}
console.log(`rebased ${touched} files ${RELATIVE ? 'to relative paths' : `under ${prefix}`}; marked noindex`);
