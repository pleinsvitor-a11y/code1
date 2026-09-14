import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const out = '/tmp/claude-0/-home-user-code1/a050badf-db05-517f-9f9c-e89601cc58ea/scratchpad/shots/nav';
await mkdir(out, { recursive: true });
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4330/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(1500);
const lum = (c) => { const [r,g,bb] = c.match(/[\d.]+/g).slice(0,3).map(Number).map(v => { v/=255; return v<=0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4; }); return 0.2126*r+0.7152*g+0.0722*bb; };
for (const id of ['hero','sintomas','tese','metodo','ordem','nao-somos','vitor','para-quem','cta']) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ block: 'start', behavior: 'instant' }), id);
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const logo = document.querySelector('.nav-logo');
    const cta = document.querySelector('.nav-cta');
    return { mode: document.body.dataset.mode, logo: getComputedStyle(logo).color, bodyBg: getComputedStyle(document.body).backgroundColor,
             ctaBg: getComputedStyle(cta).backgroundColor, ctaFg: getComputedStyle(cta).color };
  });
  const ratio = (a,bg) => { const [x,y]=[lum(a),lum(bg)].sort((m,n)=>n-m); return ((x+0.05)/(y+0.05)).toFixed(1); };
  console.log(`${id.padEnd(10)} mode=${(r.mode??'').padEnd(7)} logo ${ratio(r.logo, r.bodyBg)}:1   botão ${ratio(r.ctaFg, r.ctaBg)}:1`);
  await page.screenshot({ path: `${out}/${id}.png`, clip: { x: 0, y: 0, width: 1440, height: 80 } });
}
await b.close();
