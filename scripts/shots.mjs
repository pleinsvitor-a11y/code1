// Screenshot pages from the built dist/ at three widths. Usage: node scripts/shots.mjs [path ...]
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const root = 'dist';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.webm': 'video/webm', '.txt': 'text/plain', '.xml': 'application/xml' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(root, p);
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
  } catch {
    if (!extname(file)) file = join(root, p + '.html');
  }
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    const nf = await readFile(join(root, '404.html')).catch(() => Buffer.from('404'));
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(nf);
  }
});
await new Promise((r) => server.listen(4321, r));

const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/'];
const widths = [1440, 768, 390];
const out = process.env.SHOTS_DIR ?? '/tmp/claude-0/-home-user-code1/a050badf-db05-517f-9f9c-e89601cc58ea/scratchpad/shots';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.PW_CHROME ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const path of paths) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: Math.round(w * 0.62) }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('http://localhost:4321' + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const name = (path === '/' ? 'home' : path.replace(/\W+/g, '_')) + `-${w}.png`;
    await page.screenshot({ path: join(out, name), fullPage: process.env.FULL !== '0' });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    console.log(name, 'scrollWidth', sw, sw > w ? '!! OVERFLOW' : 'ok', errors.length ? 'ERRORS: ' + errors.join(' | ') : '');
    await page.close();
  }
}
await browser.close();
server.close();
