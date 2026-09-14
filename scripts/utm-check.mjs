import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => { let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); let file = join('dist', p);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { if (!extname(file)) file = join('dist', p + '.html'); }
  try { res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); } catch { res.writeHead(404); res.end(); } });
await new Promise((r) => server.listen(4326, r));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const pg = await b.newPage({ viewport: { width: 1440, height: 900 } }); const errs = []; pg.on('pageerror', (e) => errs.push(String(e))); pg.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
await pg.goto('http://localhost:4326/diagnostico?utm_source=instagram&utm_medium=bio&utm_content=post42', { waitUntil: 'networkidle' }); await pg.waitForTimeout(400);
console.log('utm:', await pg.evaluate(() => sessionStorage.getItem('volgus-utm')));
console.log('lenis on funnel?', await pg.evaluate(() => document.documentElement.className));
// walk to processing quickly and measure the logo
await pg.getByRole('button', { name: 'Começar' }).click(); await pg.waitForTimeout(300);
await pg.keyboard.press('1'); await pg.waitForTimeout(400); await pg.fill('#fx-q2', 'Teste'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
await pg.keyboard.press('3'); await pg.waitForTimeout(400); await pg.keyboard.press('2'); await pg.waitForTimeout(400);
await pg.keyboard.press('1'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300); await pg.keyboard.press('1'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(300);
await pg.keyboard.press('1'); await pg.waitForTimeout(400);
await pg.fill('#fx-nome', 'Ana'); await pg.fill('#fx-empresa', 'X'); await pg.fill('#fx-whatsapp', '15999999999'); await pg.fill('#fx-email', 'a@b.co'); await pg.check('#fx-consent');
await pg.getByRole('button', { name: 'Ver minha leitura' }).click(); await pg.waitForTimeout(300); await pg.keyboard.press('1'); await pg.waitForTimeout(500);
console.log('processing logo:', await pg.evaluate(() => { const a = document.querySelector('.fx-logo'); const s = a.querySelector('svg'); return JSON.stringify({ a: a.getBoundingClientRect().height, svg: s.getBoundingClientRect().height, cls: a.className, step: document.querySelector('.fx-screen')?.className }); }));
await pg.waitForTimeout(1600);
const wa = await pg.locator('a.fx-btn').first().getAttribute('href'); console.log('msg tail:', decodeURIComponent(wa.split('text=')[1]).split('\n').slice(-2).join(' | '));
console.log('errs', errs); await b.close(); server.close();
