// Renders the Open Graph image (1200x630) with the site's own fonts and brand vectors.
import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const simbolo = await readFile('public/brand/simbolo-lime.svg', 'utf8');
const wordmark = await readFile('public/brand/wordmark-branco.svg', 'utf8');
const font = async (f) => `data:font/woff2;base64,${(await readFile(`public/fonts/${f}`)).toString("base64")}`;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
@font-face{font-family:B;src:url(${await font('bricolage.woff2')}) format('woff2');font-weight:200 800;font-stretch:75% 100%}
@font-face{font-family:W;src:url(${await font('work-sans.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:F;src:url(${await font('fraunces-italic.woff2')}) format('woff2');font-style:italic;font-weight:100 900}
html,body{margin:0}body{width:1200px;height:630px;background:#000;color:#fff;font-family:W;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:40px 40px}
.logo{position:absolute;top:56px;left:64px;display:flex;align-items:center;gap:12px}.logo svg:first-child{height:34px;width:auto}.logo svg:last-child{height:18px;width:auto}
h1{position:absolute;left:64px;top:170px;margin:0;font-family:B;font-weight:800;font-size:86px;line-height:.92;letter-spacing:-.04em;text-transform:uppercase;font-variation-settings:"opsz" 96,"wdth" 82;max-width:1000px}
h1 em{font-style:normal;color:#baff00}
p{position:absolute;left:64px;bottom:64px;margin:0;font-size:26px;color:rgba(255,255,255,.72);max-width:760px;line-height:1.35}
.regua{position:absolute;left:34px;top:0;bottom:0;width:1px;background:rgba(255,255,255,.22)}
</style></head><body><div class="grid"></div><div class="regua"></div>
<div class="logo">${simbolo.replace('<svg ', '<svg style="height:34px;width:auto" ')}${wordmark}</div>
<h1>Você não tem problema de venda.<br>Você tem problema de <em>previsibilidade.</em></h1>
<p>Estruturação e gestão comercial para PMEs. Método, processo e acompanhamento até o comercial rodar sem o dono.</p>
</body></html>`;
await mkdir('public/og', { recursive: true });
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
await page.screenshot({ path: 'public/og/volgus.png', type: 'png' });
await browser.close();
console.log('og ok');
