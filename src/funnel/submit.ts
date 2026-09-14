import { SITE } from '@/config/site';
import { getUtm } from '@/lib/utm';
import { optionOf, optionsOf, type Answers } from './questions';
import { stageOf, totalScore } from './scoring';
import { routeOf, type Route } from './routing';

export interface Summary { score: number; stage: ReturnType<typeof stageOf>; route: Route }

export function summarize(a: Answers): Summary {
  const score = totalScore(a);
  return { score, stage: stageOf(score), route: routeOf(a) };
}

const label = (qid: Parameters<typeof optionOf>[0], id?: string) => optionOf(qid, id)?.label ?? 'não informado';
const labels = (qid: Parameters<typeof optionsOf>[0], ids?: string[]) => { const l = optionsOf(qid, ids).map((o) => o.label); return l.length ? l.join(', ') : 'não informado'; };

/** The structured WhatsApp message: everything Vitor needs before the first conversation. */
export function buildMessage(a: Answers): string {
  const { stage, route } = summarize(a);
  const c = a.q8;
  const utm = getUtm();
  const origem = [utm.utm_source, utm.utm_medium, utm.utm_content].map((x) => x ?? '-').join('/');
  return [
    `Diagnóstico VOLGUS — ${c?.nome ?? '-'} / ${c?.empresa ?? '-'}`,
    `Estágio: ${stage.n} — ${stage.nome} · Perfil: ${route.toUpperCase()}`,
    '',
    `Negócio: ${a.q2?.trim() || 'não informado'}`,
    `Faturamento: ${label('q3', a.q3)}`,
    `Time comercial: ${label('q4', a.q4)}`,
    `Origem das vendas: ${labels('q5', a.q5)}`,
    `Gargalos: ${labels('q6', a.q6)}`,
    `Decisão: ${label('q7', a.q7)}`,
    `Investimento: ${a.q9 ? label('q9', a.q9) : 'não informado'}`,
    '',
    `Contato: ${c?.whatsapp ?? '-'} · ${c?.email ?? '-'}`,
    `Origem: ${origem}`,
  ].join('\n');
}

export function whatsappUrl(msg: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;
}
export function mailtoUrl(msg: string, a: Answers): string {
  const subject = `Diagnóstico VOLGUS — ${a.q8?.nome ?? ''} / ${a.q8?.empresa ?? ''}`.trim();
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`;
}

/** Optional webhook. Silent on failure; the person never sees an error because of this. */
export async function postWebhook(a: Answers): Promise<void> {
  if (!SITE.webhookUrl) return;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const { score, stage, route } = summarize(a);
    await fetch(SITE.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: a, score, stage: stage.n, stageName: stage.nome, route, utm: getUtm(), message: buildMessage(a), sentAt: new Date().toISOString() }),
      signal: ctrl.signal,
      keepalive: true,
    });
  } catch { /* silent by design */ } finally { clearTimeout(t); }
}
