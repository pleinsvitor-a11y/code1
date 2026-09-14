import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
const root = 'dist'; const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png' };
const server = createServer(async (req, res) => { let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); let file = join(root, p);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { if (!extname(file)) file = join(root, p + '.html'); }
  try { res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' }); res.end(await readFile(file)); } catch { res.writeHead(404); res.end(); } });
await new Promise((r) => server.listen(4324, r));
const out = '/tmp/claude-0/-home-user-code1/a050badf-db05-517f-9f9c-e89601cc58ea/scratchpad/shots/funnel'; await mkdir(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

const profiles = {
  verde:    { q1: 1, q3: 3, q4: 2, q5: [1, 2], q6: [1, 2], q7: 1, q9: 3 },
  amarelo:  { q1: 2, q3: 2, q4: 1, q5: [1], q6: [5], q7: 2, q9: null },
  vermelho: { q1: 4, q3: 1, q4: 1, q5: [4], q6: [1], q7: 4, q9: 1 },
};
const results = {};
for (const [name, p] of Object.entries(profiles)) {
  for (const width of name === 'verde' ? [1440, 390] : [1440]) {
    const ctx = await browser.newContext({ viewport: { width, height: width === 390 ? 780 : 900 } });
    const page = await ctx.newPage();
    const errors = []; page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); }); page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('http://localhost:4324/diagnostico?utm_source=instagram&utm_medium=bio&utm_content=post42', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    if (width === 1440 && name === 'verde') await page.screenshot({ path: join(out, 'intro.png') });
    await page.getByRole('button', { name: 'Começar' }).click(); await page.waitForTimeout(350);
    // Q1 via keyboard
    await page.keyboard.press(String(p.q1)); await page.waitForTimeout(450);
    if (width === 1440 && name === 'verde') await page.screenshot({ path: join(out, 'q2.png') });
    // Q2 text
    await page.fill('#fx-q2', 'Escritório de contabilidade para clínicas'); await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    if (name === 'verde') await page.screenshot({ path: join(out, `q3-${width}.png`) });
    // Q3 by click
    await page.locator('.fx-option').nth(p.q3 - 1).click(); await page.waitForTimeout(450);
    // back/forward preservation check
    if (name === 'verde' && width === 1440) {
      await page.keyboard.press('Escape'); await page.waitForTimeout(350);
      const pressed = await page.locator('.fx-option[aria-pressed="true"]').count();
      results.backPreserved = pressed === 1;
      await page.locator('.fx-option').nth(p.q3 - 1).click(); await page.waitForTimeout(450);
    }
    await page.keyboard.press(String(p.q4)); await page.waitForTimeout(450);
    for (const k of p.q5) await page.keyboard.press(String(k));
    await page.keyboard.press('Enter'); await page.waitForTimeout(350);
    for (const k of p.q6) await page.locator('.fx-option').nth(k - 1).click();
    await page.getByRole('button', { name: 'Continuar' }).click(); await page.waitForTimeout(350);
    await page.keyboard.press(String(p.q7)); await page.waitForTimeout(450);
    // refresh mid-flow (at contact) must keep progress
    if (name === 'amarelo') { await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(400); results.refreshKept = (await page.locator('#fx-nome').count()) === 1; }
    if (name === 'verde') await page.screenshot({ path: join(out, `contato-${width}.png`) });
    // validation: submit empty first
    await page.getByRole('button', { name: 'Ver minha leitura' }).click(); await page.waitForTimeout(200);
    if (name === 'verde' && width === 1440) { results.errorsShown = await page.locator('.fx-error').count(); await page.screenshot({ path: join(out, 'contato-erros.png') }); }
    await page.fill('#fx-nome', 'Ana Souza'); await page.fill('#fx-empresa', 'Contabilix'); await page.fill('#fx-whatsapp', '15999999999'); await page.fill('#fx-email', 'ana@contabilix.com.br');
    await page.check('#fx-consent');
    await page.getByRole('button', { name: 'Ver minha leitura' }).click(); await page.waitForTimeout(350);
    // q9
    if (p.q9) { await page.keyboard.press(String(p.q9)); } else { await page.getByRole('button', { name: 'Pular esta pergunta' }).click(); }
    await page.waitForTimeout(500);
    await page.screenshot({ path: join(out, `processando-${name}.png`) });
    await page.waitForTimeout(1700);
    await page.screenshot({ path: join(out, `resultado-${name}-${width}.png`), fullPage: true });
    const stage = await page.locator('.fx-stage-nome').textContent();
    const wa = await page.locator('a.fx-btn').first().getAttribute('href').catch(() => null);
    const msg = wa ? decodeURIComponent(wa.split('text=')[1]) : null;
    results[name] = { width, stage, hasWa: !!wa, hasVermelhoGuidance: await page.locator('.fx-lista li').count(), msgHead: msg?.split('\n').slice(0, 2).join(' | '), utmOk: msg?.includes('instagram/bio/post42'), surface: await page.locator('.fx').getAttribute('data-surface'), errors };
    await ctx.close();
  }
}
console.log(JSON.stringify(results, null, 1));
await browser.close(); server.close();
