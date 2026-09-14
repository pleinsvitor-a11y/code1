/**
 * Acceptance checks against the built dist/, served like the real host.
 * Breakpoints, overflow, overlap, contrast, keyboard, lime budget, console.
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:4330';
const EXEC = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const WIDTHS = [1920, 1440, 1280, 1024, 768, 430, 390];
const browser = await chromium.launch({ executablePath: EXEC });
const out = [];
const fail = [];
const ok = (cond, msg) => { out.push(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fail.push(msg); };

// ---------- 1. breakpoints: overflow + section overlap ----------
for (const path of ['/', '/diagnostico', '/privacidade', '/404']) {
  for (const width of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE + path, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(700);
    const r = await page.evaluate(() => {
      const de = document.documentElement;
      const wide = [...document.querySelectorAll('body *')]
        .filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.right > de.clientWidth + 1 || b.left < -1); })
        .filter((el) => !el.closest('[data-marquee]') && !el.classList.contains('traco') && !el.closest('.traco') && !el.classList.contains('sprite') && !el.classList.contains('cursor') && !el.classList.contains('skip-link'))
        .map((el) => `${el.tagName}.${el.className}`.slice(0, 60));
      // sections must not overlap vertically
      const secs = [...document.querySelectorAll('[data-surface]')].map((s) => { const b = s.getBoundingClientRect(); return { id: s.id || s.className.slice(0, 20), top: b.top + scrollY, bottom: b.bottom + scrollY }; });
      const overlaps = [];
      for (let i = 1; i < secs.length; i++) if (secs[i].top < secs[i - 1].bottom - 2) overlaps.push(`${secs[i - 1].id} / ${secs[i].id}`);
      return { scrollW: de.scrollWidth, clientW: de.clientWidth, wide: [...new Set(wide)].slice(0, 4), overlaps };
    });
    ok(r.scrollW <= r.clientW + 1, `${path} @${width}: sem overflow horizontal (scrollWidth ${r.scrollW} / ${r.clientW})${r.wide.length ? ' culpados: ' + r.wide.join(', ') : ''}`);
    ok(r.overlaps.length === 0, `${path} @${width}: seções não se sobrepõem${r.overlaps.length ? ' -> ' + r.overlaps.join(' | ') : ''}`);
    ok(errors.length === 0, `${path} @${width}: zero erro no console${errors.length ? ' -> ' + errors.join(' | ') : ''}`);
    await ctx.close();
  }
}

// ---------- 2. lime budget + stroke count on the home ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const r = await page.evaluate(() => {
    const LIME = 'rgb(186, 255, 0)';
    const hits = [];
    for (const el of document.querySelectorAll('body *')) {
      if (el.closest('.sprite') || el.tagName === 'use' || el.tagName === 'path') continue;
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
      if (el.classList.contains('skip-link') || el.classList.contains('cursor')) continue; // offscreen affordances
      const hit = [cs.backgroundColor, cs.color, cs.borderTopColor, cs.fill].some((v) => v === LIME);
      if (!hit) continue;
      // An "aparição" is a visual cluster, not a DOM node: skip anything nested
      // inside an already-counted hit, and collapse siblings of one parent into one.
      let p = el.parentElement, nested = false;
      while (p && p !== document.body) { if (hits.includes(p)) { nested = true; break; } p = p.parentElement; }
      if (nested) continue;
      hits.push(el);
    }
    // An "aparição" is a visual region, not a DOM node: merge hits that sit in the
    // same section and within 200px of each other (the three market numbers are one
    // row; the CTA button lives inside the lime CTA section).
    const regions = [];
    for (const el of hits) {
      const sec = el.closest('[data-surface]') ?? document.body;
      const top = el.getBoundingClientRect().top + scrollY;
      const near = regions.find((r) => r.sec === sec && Math.abs(r.top - top) < 200);
      if (near) { near.els.push(el); continue; }
      regions.push({ sec, top, els: [el] });
    }
    return {
      lime: regions.map((r) => `${(r.sec.id || r.sec.className.split(' ')[0])}:${r.els.map((e) => String(e.className.baseVal ?? e.className).split(' ')[0]).join('+')}`),
      tracos: document.querySelectorAll('[data-traco]').length,
      h1: document.querySelectorAll('h1').length,
      headingJump: (() => {
        const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1]);
        for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) return `${hs[i - 1]}->${hs[i]}`;
        return null;
      })(),
      landmarks: ['header', 'main', 'footer', 'nav'].filter((t) => document.querySelector(t)).join(','),
    };
  });
  ok(r.lime.length <= 8, `home: lime aparece ${r.lime.length} vezes (teto 8) -> ${r.lime.join(', ')}`);
  ok(r.tracos === 3, `home: traço caligráfico aparece ${r.tracos} vezes (exatamente 3)`);
  ok(r.h1 === 1, `home: exatamente um <h1> (${r.h1})`);
  ok(r.headingJump === null, `home: hierarquia de heading sem pulo${r.headingJump ? ' -> ' + r.headingJump : ''}`);
  ok(r.landmarks === 'header,main,footer,nav', `home: landmarks presentes (${r.landmarks})`);
  await ctx.close();
}

// ---------- 3. contrast: lime never on light, text pairs ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const measure = () => page.evaluate(() => {
    const lum = (c) => { const [r, g, b] = c.match(/\d+/g).slice(0, 3).map(Number).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const bgOf = (el) => { let p = el; while (p && p !== document.documentElement) { const c = getComputedStyle(p).backgroundColor; if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c; p = p.parentElement; } return getComputedStyle(document.body).backgroundColor; };
    const out = [];
    for (const el of document.querySelectorAll('p,li,span,a,h1,h2,h3,dt,dd,button,em,strong')) {
      if (!el.textContent?.trim() || el.children.length) continue;
      const b = el.getBoundingClientRect(); if (b.width === 0 || b.height === 0) continue;
      const cs = getComputedStyle(el); const bg = bgOf(el);
      // mix-blend-mode inverts against the backdrop; a flat colour comparison is meaningless
      let bl = el, blended = false;
      while (bl && bl !== document.body) { if (getComputedStyle(bl).mixBlendMode !== 'normal') { blended = true; break; } bl = bl.parentElement; }
      if (blended) continue;
      const size = parseFloat(cs.fontSize); const weight = +cs.fontWeight || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      const r = ratio(cs.color, bg);
      if (r < (large ? 3 : 4.5)) out.push(`${el.tagName}.${String(el.className).split(' ')[0]} ${cs.color} on ${bg} = ${r.toFixed(2)} (${size}px/${weight})`);
    }
    return [...new Set(out)];
  });
  // Each section is measured while it is actually on screen, which is when the
  // body colour tween has settled on that section's surface.
  const bad = [];
  const ids = await page.evaluate(() => [...document.querySelectorAll('[data-surface]')].map((s, i) => s.id || `s${i}`));
  for (const id of ids) {
    await page.evaluate((i) => { const el = document.getElementById(i) ?? document.querySelectorAll('[data-surface]')[Number(i.replace('s', ''))]; el?.scrollIntoView({ block: 'center', behavior: 'instant' }); }, id);
    await page.waitForTimeout(700);
    bad.push(...(await measure()));
  }
  ok(bad.length === 0, `home: contraste de texto dentro do WCAG AA${bad.length ? ' -> ' + bad.slice(0, 5).join(' | ') : ''}`);
  await ctx.close();
}

// ---------- 4. keyboard: skip link, focus visible, whole funnel ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(250);
  const skip = await page.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { cls: a.className, text: a.textContent?.trim(), visible: a.getBoundingClientRect().top >= 0, outline: cs.outlineWidth + ' ' + cs.outlineColor }; });
  ok(skip.cls === 'skip-link' && skip.visible, `home: primeiro Tab revela "Pular para o conteúdo" (${skip.text})`);
  ok(skip.outline.includes('rgb(186, 255, 0)'), `home: foco de teclado tem anel lime (${skip.outline})`);

  await page.goto(BASE + '/diagnostico', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');           // Começar is autofocused
  await page.waitForTimeout(350);
  await page.keyboard.press('1'); await page.waitForTimeout(450);
  const onQ2 = await page.evaluate(() => document.activeElement?.id);
  ok(onQ2 === 'fx-q2', `fluxo: autofoco no primeiro campo de cada tela (${onQ2})`);
  await page.keyboard.type('Teste'); await page.keyboard.press('Enter'); await page.waitForTimeout(350);
  await page.keyboard.press('Escape'); await page.waitForTimeout(350);
  const backTo = await page.evaluate(() => document.querySelector('.fx-count')?.textContent);
  ok(backTo === '2 / 9', `fluxo: Esc volta uma tela (${backTo})`);
  const live = await page.evaluate(() => document.querySelector('.fx-screen')?.getAttribute('aria-live'));
  ok(live === 'polite', `fluxo: troca de tela anunciada com aria-live (${live})`);
  const labels = await page.evaluate(() => { return [...document.querySelectorAll('.fx-input')].every((i) => !!document.querySelector(`label[for="${i.id}"]`)); });
  ok(labels, 'fluxo: todo campo tem <label> de verdade');
  await ctx.close();
}

// ---------- 5. footer links + 404 + og + favicon ----------
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const links = await page.evaluate(() => [...document.querySelectorAll('footer a')].map((a) => a.getAttribute('href')));
  for (const href of links) {
    if (href.startsWith('mailto:') || href.startsWith('https://wa.me') || href.startsWith('https://instagram')) { ok(true, `rodapé: ${href.slice(0, 44)} (externo)`); continue; }
    const res = await page.request.get(BASE + href);
    ok(res.ok(), `rodapé: ${href} responde ${res.status()}`);
  }
  const nf = await page.request.get(BASE + '/uma-pagina-que-nao-existe');
  ok(nf.status() === 404 && (await nf.text()).includes('404'), `404: rota inexistente devolve a página 404 (${nf.status()})`);
  for (const asset of ['/og/volgus.png', '/brand/favicon.svg', '/brand/favicon.ico', '/robots.txt', '/sitemap.xml']) {
    const r = await page.request.get(BASE + asset);
    ok(r.ok(), `asset: ${asset} (${r.status()})`);
  }
  await ctx.close();
}

await browser.close();
console.log(out.join('\n'));
console.log(`\n${out.length - fail.length}/${out.length} checks passaram.`);
if (fail.length) { console.log('\nFALHAS:\n- ' + fail.join('\n- ')); process.exitCode = 1; }
