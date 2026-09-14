import type { Answers } from './questions';

export interface FunnelState { step: number; answers: Answers }
const KEY = 'volgus-diagnostico';

/** Session-only draft so a refresh never loses progress. Nothing goes to localStorage. */
export function loadState(): FunnelState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FunnelState;
    if (typeof parsed.step !== 'number' || typeof parsed.answers !== 'object') return null;
    return parsed;
  } catch { return null; }
}
export function saveState(s: FunnelState): void {
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
export function clearState(): void {
  try { sessionStorage.removeItem(KEY); } catch { /* ignore */ }
}
