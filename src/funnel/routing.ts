import { optionOf, type Answers } from './questions';
import { totalScore } from './scoring';

export type Route = 'verde' | 'amarelo' | 'vermelho';

/**
 * Verde   — revenue ≥ R$ 800k AND decision-maker with urgency (q7 ≥ 3) AND total ≥ 14
 * Vermelho — revenue ≤ R$ 500k OR "not a priority" OR "just researching"
 * Amarelo  — everything else
 */
export function routeOf(a: Answers): Route {
  const rev = optionOf('q3', a.q3)?.tag;
  const q7 = optionOf('q7', a.q7);
  const q1 = optionOf('q1', a.q1)?.tag;
  const total = totalScore(a);
  if (rev === 'rev-500' || q7?.tag === 'dec-not-priority' || q1 === 'intent-research') return 'vermelho';
  const revOk = rev === 'rev-3m' || rev === 'rev-8m' || rev === 'rev-8m+';
  if (revOk && (q7?.score ?? 0) >= 3 && total >= 14) return 'verde';
  return 'amarelo';
}
