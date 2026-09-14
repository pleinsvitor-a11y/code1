// Scroll through the built home and capture frames mid-transition; also test reduced-motion.
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
const root = 'dist';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); let file = join(root, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { if (!extname(file)) file = join(root, p + '.html'); }
  try { res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404); res.end('nf'); }
});
await new Promise((r) => server.listen(4322, r));
const out = '/tmp/claude-0/-home-user-code1/a050badf-db05-517f-9f9c-e89601cc58ea/scratchpad/shots/scroll';
await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const rm of ['no-preference', 'reduce']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + String(e)));
  await page.goto('http://localhost:4322/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: join(out, `hero-t150-${rm}.png`) });
  await page.waitForTimeout(1400);
  await page.screenshot({ path: join(out, `hero-done-${rm}.png`) });
  const cls = await page.evaluate(() => document.documentElement.className);
  console.log(rm, 'html class:', cls);
  // scroll in steps, capture viewport frames
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const frac of [0.12, 0.27, 0.33, 0.42, 0.5, 0.62, 0.72, 0.8, 0.9]) {
    await page.mouse.wheel(0, 0);
    await page.evaluate((y) => window.scrollTo(0, y), Math.round(H * frac));
    await page.waitForTimeout(900);
    await page.screenshot({ path: join(out, `f${Math.round(frac * 100)}-${rm}.png`) });
  }
  const mode = await page.evaluate(() => document.body.dataset.mode + ' | ' + getComputedStyle(document.body).backgroundColor);
  console.log(rm, 'end mode:', mode, errors.length ? '\nERRORS: ' + errors.join('\n') : 'no console errors');
  await ctx.close();
}
await browser.close(); server.close();
