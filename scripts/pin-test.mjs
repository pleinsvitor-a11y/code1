import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
const root = 'dist'; const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (req, res) => { let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); let file = join(root, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { if (!extname(file)) file = join(root, p + '.html'); }
  try { res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); } catch { res.writeHead(404); res.end(); } });
await new Promise((r) => server.listen(4323, r));
const out = '/tmp/claude-0/-home-user-code1/a050badf-db05-517f-9f9c-e89601cc58ea/scratchpad/shots/scroll'; await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.addInitScript(() => { Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 }); Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 }); });
await page.goto('http://localhost:4323/', { waitUntil: 'networkidle' }); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1600);
await page.screenshot({ path: join(out, 'hero2.png') });
const top = await page.evaluate(() => document.querySelector('#metodo').getBoundingClientRect().top + window.scrollY);
for (const [i, dy] of [[0, -108], [1, 500], [2, 1000], [3, 1500], [4, 1900]]) {
  await page.evaluate((y) => window.scrollTo(0, y), Math.round(top + dy)); await page.waitForTimeout(800);
  await page.screenshot({ path: join(out, `pin${i}.png`) });
}
await browser.close(); server.close();
