/** Captures campaign parameters on first load and keeps them for the session. */
const KEY = 'volgus-utm';
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid'] as const;
export type Utm = Partial<Record<(typeof PARAMS)[number], string>> & { landing?: string; referrer?: string };

export function captureUtm(): void {
  try {
    const url = new URL(window.location.href);
    const found: Utm = {};
    for (const p of PARAMS) { const v = url.searchParams.get(p); if (v) found[p] = v.slice(0, 120); }
    const existing = getUtm();
    if (Object.keys(found).length === 0 && Object.keys(existing).length > 0) return;
    const merged: Utm = { ...existing, ...found };
    if (!merged.landing) merged.landing = url.pathname;
    if (!merged.referrer && document.referrer) merged.referrer = document.referrer.slice(0, 200);
    sessionStorage.setItem(KEY, JSON.stringify(merged));
  } catch { /* storage unavailable: nothing to do */ }
}

export function getUtm(): Utm {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Utm; } catch { return {}; }
}
