/**
 * Keeps <body data-mode> in sync with the section under the navigation bar so
 * the nav button and logo can react. The colour tween itself lives in motion.ts.
 */
export function initSurfaceObserver(): void {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-surface]'));
  if (sections.length === 0) return;
  const body = document.body;
  const apply = (el: HTMLElement) => {
    const mode = el.dataset.surface ?? 'preto';
    if (body.dataset.mode !== mode) body.dataset.mode = mode;
  };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) apply(e.target as HTMLElement);
    },
    // A thin band at the top of the viewport, where the nav lives.
    { rootMargin: '-4% 0px -92% 0px', threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));
  apply(sections[0]!);
}
