import Lenis from 'lenis';

/** Smooth scroll with weight. Off on touch devices and under reduced motion. */
export function initLenis(): Lenis | null {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce || !fine) return null;
  const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
  return lenis;
}
