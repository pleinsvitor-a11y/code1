/**
 * Tracking loads only when an ID is configured AND the visitor consented.
 * With both IDs empty nothing here ever runs and no banner is shown.
 */
import { SITE } from '@/config/site';

const KEY = 'volgus-consent';
export type Consent = 'granted' | 'denied' | null;

export function getConsent(): Consent {
  try { return (localStorage.getItem(KEY) as Consent) ?? null; } catch { return null; }
}
export function setConsent(v: Exclude<Consent, null>): void {
  try { localStorage.setItem(KEY, v); } catch { /* ignore */ }
  if (v === 'granted') loadTracking();
}

let loaded = false;
export function loadTracking(): void {
  if (loaded || getConsent() !== 'granted') return;
  loaded = true;
  if (SITE.ga4Id) {
    const s = document.createElement('script');
    s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${SITE.ga4Id}`;
    document.head.appendChild(s);
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = function () { w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', SITE.ga4Id, { anonymize_ip: true });
  }
  if (SITE.metaPixelId) {
    const w = window as unknown as { fbq?: ((...a: unknown[]) => void) & { queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown; callMethod?: unknown } };
    if (!w.fbq) {
      const n = function (...args: unknown[]) { if (n.callMethod) (n.callMethod as (...a: unknown[]) => void)(...args); else n.queue!.push(args); } as NonNullable<typeof w.fbq>;
      n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
      w.fbq = n;
      const s = document.createElement('script'); s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(s);
    }
    w.fbq!('init', SITE.metaPixelId);
    w.fbq!('track', 'PageView');
  }
}

/** Custom events, no-ops when tracking is off. */
export function track(event: string, params: Record<string, string | number> = {}): void {
  if (getConsent() !== 'granted') return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
  w.gtag?.('event', event, params);
  w.fbq?.('trackCustom', event, params);
}
