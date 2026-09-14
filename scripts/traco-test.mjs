// The three strokes must be fully visible after the reader has passed them,
// and must never be left masked if a trigger misfires.
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const out = '/tmp/claude-0/-home-user-code1/a050badf-db05-517f-9f9c-e89601cc58ea/scratchpad/shots/traco';
import { mkdir } from 'node:fs/promises'; await mkdir(out, { recursive: true });
for (const rm of ['no-preference', 'reduce']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: rm });
  const page = await ctx.newPage();
  await page.goto('http://localhost:4330/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  const ids = ['hero', 'tese', 'cta'];
  for (const id of ids) {
    await page.evaluate((i) => document.querySelector(`[data-traco="${i}"]`)?.scrollIntoView({ block: 'center', behavior: 'instant' }), id);
    await page.waitForTimeout(1600);
    const st = await page.evaluate((i) => {
      const svg = document.querySelector(`[data-traco="${i}"]`);
      const fill = svg.querySelector('.traco-fill');
      const r = svg.getBoundingClientRect();
      return { masked: fill.hasAttribute('mask'), w: Math.round(r.width), h: Math.round(r.height), color: getComputedStyle(svg).color };
    }, id);
    console.log(`${rm} ${id}:`, JSON.stringify(st));
    await page.screenshot({ path: `${out}/${id}-${rm}.png` });
  }
  await ctx.close();
}
await b.close();
