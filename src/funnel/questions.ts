/**
 * The eight questions of the diagnostic (plus the optional budget question).
 * Every option carries a score and a tag; scoring.ts and routing.ts read them.
 */
export type OptionTag =
  | 'intent-process' | 'intent-team' | 'intent-growth' | 'intent-research'
  | 'rev-500' | 'rev-800' | 'rev-3m' | 'rev-8m' | 'rev-8m+'
  | 'team-1' | 'team-2-3' | 'team-4-6' | 'team-6+'
  | 'src-referral' | 'src-outbound' | 'src-paid' | 'src-unknown'
  | 'gap-funnel' | 'gap-forecast' | 'gap-ramp' | 'gap-crm' | 'gap-referral'
  | 'dec-now' | 'dec-evaluating' | 'dec-partner' | 'dec-not-priority'
  | 'bud-none' | 'bud-2k' | 'bud-5k' | 'bud-5k+' | 'bud-skip';

export interface Option { id: string; label: string; score: number; tag: OptionTag }

export type Question =
  | { id: 'q1' | 'q3' | 'q4' | 'q7' | 'q9'; kind: 'single'; title: string; hint?: string; optional?: boolean; options: Option[] }
  | { id: 'q5' | 'q6'; kind: 'multi'; title: string; hint?: string; max?: number; options: Option[] }
  | { id: 'q2'; kind: 'text'; title: string; hint?: string; placeholder: string; maxLength: number }
  | { id: 'q8'; kind: 'contact'; title: string; hint?: string };

export const QUESTIONS: Question[] = [
  {
    id: 'q1', kind: 'single', title: 'O que te trouxe até aqui?',
    options: [
      { id: 'a', label: 'Meu comercial não tem processo e eu sei disso', score: 3, tag: 'intent-process' },
      { id: 'b', label: 'Tenho time, mas o resultado oscila demais', score: 3, tag: 'intent-team' },
      { id: 'c', label: 'Cresci e o comercial não acompanhou', score: 3, tag: 'intent-growth' },
      { id: 'd', label: 'Estou pesquisando, sem urgência definida', score: 0, tag: 'intent-research' },
    ],
  },
  {
    id: 'q2', kind: 'text', title: 'O que a sua empresa faz?',
    hint: 'Em uma frase. É o dado mais importante para a conversa.',
    placeholder: 'Ex.: escritório de contabilidade para clínicas', maxLength: 160,
  },
  {
    id: 'q3', kind: 'single', title: 'Qual o faturamento anual da empresa hoje?',
    options: [
      { id: 'a', label: 'Até R$ 500 mil', score: -2, tag: 'rev-500' },
      { id: 'b', label: 'R$ 500 mil a R$ 800 mil', score: 1, tag: 'rev-800' },
      { id: 'c', label: 'R$ 800 mil a R$ 3 milhões', score: 4, tag: 'rev-3m' },
      { id: 'd', label: 'R$ 3 milhões a R$ 8 milhões', score: 4, tag: 'rev-8m' },
      { id: 'e', label: 'Acima de R$ 8 milhões', score: 2, tag: 'rev-8m+' },
    ],
  },
  {
    id: 'q4', kind: 'single', title: 'Quantas pessoas trabalham no comercial hoje, contando você?',
    options: [
      { id: 'a', label: 'Só eu', score: 2, tag: 'team-1' },
      { id: 'b', label: '2 a 3', score: 4, tag: 'team-2-3' },
      { id: 'c', label: '4 a 6', score: 4, tag: 'team-4-6' },
      { id: 'd', label: 'Mais de 6', score: 2, tag: 'team-6+' },
    ],
  },
  {
    id: 'q5', kind: 'multi', title: 'De onde vêm suas vendas hoje?', hint: 'Marque todas que se aplicam.',
    options: [
      { id: 'a', label: 'Indicação', score: 2, tag: 'src-referral' },
      { id: 'b', label: 'Prospecção ativa', score: 1, tag: 'src-outbound' },
      { id: 'c', label: 'Tráfego pago ou redes sociais', score: 1, tag: 'src-paid' },
      { id: 'd', label: 'Não sei dizer com precisão', score: 3, tag: 'src-unknown' },
    ],
  },
  {
    id: 'q6', kind: 'multi', title: 'O que mais trava hoje?', hint: 'Escolha até duas.', max: 2,
    options: [
      { id: 'a', label: 'Não sei em qual etapa eu perco a venda', score: 3, tag: 'gap-funnel' },
      { id: 'b', label: 'Não consigo prever o faturamento do próximo mês', score: 3, tag: 'gap-forecast' },
      { id: 'c', label: 'Vendedor novo demora demais para produzir', score: 3, tag: 'gap-ramp' },
      { id: 'd', label: 'CRM existe mas ninguém usa direito', score: 3, tag: 'gap-crm' },
      { id: 'e', label: 'Só vendo quando me indicam', score: 3, tag: 'gap-referral' },
    ],
  },
  {
    id: 'q7', kind: 'single', title: 'Quem decide sobre isso, e para quando?',
    options: [
      { id: 'a', label: 'Eu decido, e quero resolver nos próximos 30 dias', score: 5, tag: 'dec-now' },
      { id: 'b', label: 'Eu decido, mas ainda estou avaliando', score: 3, tag: 'dec-evaluating' },
      { id: 'c', label: 'Decido com sócio ou conselho', score: 2, tag: 'dec-partner' },
      { id: 'd', label: 'Ainda não é prioridade', score: -3, tag: 'dec-not-priority' },
    ],
  },
  {
    id: 'q8', kind: 'contact', title: 'Para onde a gente manda a leitura?',
    hint: 'O resultado aparece aqui na tela. O contato serve para continuar a conversa, se fizer sentido.',
  },
  {
    id: 'q9', kind: 'single', optional: true, title: 'Você já tem ideia de quanto pretende investir para resolver isso?',
    hint: 'Opcional. Pode pular.',
    options: [
      { id: 'a', label: 'Ainda não pensei nisso', score: 0, tag: 'bud-none' },
      { id: 'b', label: 'Até R$ 2 mil por mês', score: 1, tag: 'bud-2k' },
      { id: 'c', label: 'R$ 2 mil a R$ 5 mil por mês', score: 3, tag: 'bud-5k' },
      { id: 'd', label: 'Acima de R$ 5 mil por mês', score: 4, tag: 'bud-5k+' },
      { id: 'e', label: 'Prefiro não responder', score: 0, tag: 'bud-skip' },
    ],
  },
];

export const TOTAL_STEPS = QUESTIONS.length;

export interface Contact { nome: string; empresa: string; whatsapp: string; email: string; consent: boolean }

export interface Answers {
  q1?: string; q2?: string; q3?: string; q4?: string;
  q5?: string[]; q6?: string[]; q7?: string; q8?: Contact; q9?: string;
}

export function optionOf(qid: Question['id'], optId: string | undefined): Option | undefined {
  if (!optId) return undefined;
  const q = QUESTIONS.find((x) => x.id === qid);
  if (!q || !('options' in q)) return undefined;
  return q.options.find((o) => o.id === optId);
}
export function optionsOf(qid: Question['id'], ids: string[] | undefined): Option[] {
  return (ids ?? []).map((id) => optionOf(qid, id)).filter((o): o is Option => !!o);
}
