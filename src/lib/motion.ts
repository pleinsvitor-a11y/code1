/**
 * Every animation on the site, in one place, each with a reason to exist:
 *  - surface: body colour tween between sections (the narrative)
 *  - hero: one orchestrated entrance, then the width axis opens on scroll
 *  - traco: the symbol is written, three times on the whole site
 *  - tese: the dividing line draws itself
 *  - metodo: pinned sequence, desktop only and only on capable devices
 * Reduced motion: nothing here runs; CSS shows final states.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initLenis } from './lenis';

type Surface = { surface: string; ink: string; ink2: string; linha: string };
const SURFACES: Record<string, Surface> = {
  preto: { surface: '#000000', ink: '#ffffff', ink2: 'rgba(255,255,255,0.62)', linha: 'rgba(255,255,255,0.12)' },
  cinza: { surface: '#383838', ink: '#ffffff', ink2: 'rgba(255,255,255,0.7)', linha: 'rgba(255,255,255,0.16)' },
  claro: { surface: '#f0f0f0', ink: '#000000', ink2: '#383838', linha: 'rgba(0,0,0,0.12)' },
  branco: { surface: '#ffffff', ink: '#000000', ink2: '#383838', linha: 'rgba(0,0,0,0.12)' },
  lime: { surface: '#baff00', ink: '#000000', ink2: '#000000', linha: 'rgba(0,0,0,0.22)' },
};

const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = () => window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches;
const capable = () => (navigator.hardwareConcurrency ?? 8) > 4 && ((navigator as { deviceMemory?: number }).deviceMemory ?? 8) > 4;

export function initMotion(): void {
  if (reduce()) return;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add('motion');

  const lenis = initLenis();
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    // Anchor links go through Lenis so the scroll keeps its weight
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const hash = a.getAttribute('href')!.replace(/^\//, '');
        const target = hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -24 });
        history.pushState(null, '', hash);
      });
    });
  }

  // The pin must exist before any other trigger so their positions account for the pin spacing.
  initMetodo();
  initSurface();
  initHero();
  initTracos();
  initTese();
  ScrollTrigger.refresh();
}

/* ------------------------------------------------------------------ */
function initSurface(): void {
  const body = document.body;
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-surface]'));
  const setVars = (s: Surface) => {
    body.style.setProperty('--surface', s.surface);
    body.style.setProperty('--ink', s.ink);
    body.style.setProperty('--ink-2', s.ink2);
    body.style.setProperty('--linha', s.linha);
  };
  const first = SURFACES[sections[0]?.dataset.surface ?? 'preto']!;
  setVars(first);
  const state = { ...first };

  sections.forEach((el, i) => {
    if (i === 0) return;
    const from = SURFACES[sections[i - 1]!.dataset.surface ?? 'preto']!;
    const to = SURFACES[el.dataset.surface ?? 'preto']!;
    if (from.surface === to.surface) return;
    gsap.fromTo(
      state,
      { ...from },
      {
        ...to,
        ease: 'none',
        immediateRender: false,
        onUpdate: () => setVars(state),
        scrollTrigger: { trigger: el, start: 'top 72%', end: 'top 38%', scrub: 0.35 },
      },
    );
  });
}

/* ------------------------------------------------------------------ */
function initHero(): void {
  const hero = document.querySelector<HTMLElement>('#hero');
  if (!hero) return;
  const lines = hero.querySelectorAll<HTMLElement>('.hero-line > span');
  const rest = hero.querySelectorAll<HTMLElement>('.hero-sub, .hero-ctas');
  const title = hero.querySelector<HTMLElement>('.hero-title');
  const traco = hero.querySelector<SVGSVGElement>('[data-traco="hero"]');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo(lines, { clipPath: 'inset(-0.15em 0 100% 0)', y: '0.35em' }, { clipPath: 'inset(-0.15em 0 -0.05em 0)', y: 0, duration: 0.42, stagger: 0.07, onComplete: () => lines.forEach((l) => { l.style.clipPath = 'none'; }) }, 0.05)
    .fromTo(rest, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'none' }, 0.5);
  if (traco) tl.add(drawTraco(traco, 0.6), 0.62);

  // The width axis opens as the reader scrolls: Compressed → Wide, the MIV's own family.
  if (title && desktop()) {
    const w = { v: 80 };
    gsap.to(w, {
      v: 94,
      ease: 'none',
      onUpdate: () => { title.style.fontVariationSettings = `"opsz" 96, "wdth" ${w.v.toFixed(1)}`; },
      scrollTrigger: { trigger: hero, start: 'top top', end: '60% top', scrub: 0.6 },
    });
  }
}

/* ------------------------------------------------------------------ */
export function drawTraco(svg: SVGSVGElement, duration = 0.9): gsap.core.Timeline {
  const a = svg.querySelector<SVGPathElement>('[data-traco-a]')!;
  const b = svg.querySelector<SVGPathElement>('[data-traco-b]')!;
  const la = a.getTotalLength();
  const lb = b.getTotalLength();
  const fill = svg.querySelector<SVGPathElement>('.traco-fill')!;
  fill.setAttribute('mask', fill.dataset.mask ?? '');
  const tl = gsap.timeline({ onComplete: () => fill.removeAttribute('mask') });
  gsap.set(a, { strokeDasharray: la, strokeDashoffset: la });
  gsap.set(b, { strokeDasharray: lb, strokeDashoffset: lb });
  const share = la / (la + lb);
  tl.to(a, { strokeDashoffset: 0, duration: duration * share, ease: 'power2.inOut' })
    .to(b, { strokeDashoffset: 0, duration: duration * (1 - share), ease: 'power2.inOut' }, '>-0.05');
  return tl;
}

function initTracos(): void {
  document.querySelectorAll<SVGSVGElement>('[data-traco]').forEach((svg) => {
    if (svg.dataset.traco === 'hero') return;
    const tl = drawTraco(svg, 0.9).pause();
    ScrollTrigger.create({ trigger: svg, start: 'top 80%', once: true, onEnter: () => tl.play() });
  });
}

/* ------------------------------------------------------------------ */
function initTese(): void {
  const linha = document.querySelector<HTMLElement>('#tese [data-linha]');
  if (!linha) return;
  gsap.fromTo(linha, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#tese .tese-colunas', start: 'top 85%', end: 'bottom 60%', scrub: 0.4 } });
}

/* ------------------------------------------------------------------ */
function initMetodo(): void {
  const root = document.querySelector<HTMLElement>('[data-metodo]');
  if (!root || !desktop() || !capable()) return;
  const etapas = Array.from(root.querySelectorAll<HTMLElement>('[data-metodo-etapa]'));
  const marcas = Array.from(root.querySelectorAll<HTMLElement>('[data-metodo-marca]'));
  const fill = root.querySelector<HTMLElement>('[data-metodo-fill]');
  if (etapas.length < 4 || !fill) return;
  root.classList.add('is-pinned');

  const progress = { p: 0 };
  const apply = () => {
    const step = Math.min(3, Math.floor(progress.p * 4));
    etapas.forEach((el, i) => el.classList.toggle('is-active', i <= step));
    marcas.forEach((el, i) => el.classList.toggle('is-active', i <= step));
    fill.style.transform = `scaleX(${(0.125 + progress.p * 0.75).toFixed(4)})`;
  };
  gsap.set(fill, { scaleX: 0.125 });
  apply();
  gsap.to(progress, {
    p: 1,
    ease: 'none',
    onUpdate: apply,
    scrollTrigger: { trigger: root, start: 'top 12%', end: '+=180%', pin: true, pinSpacing: true, scrub: 0.3, anticipatePin: 1 },
  });
}
