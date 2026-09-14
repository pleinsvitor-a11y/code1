import { optionOf, optionsOf, type Answers } from './questions';

export interface Stage { n: 1 | 2 | 3 | 4; nome: string; descricao: string }

export const STAGES: Stage[] = [
  { n: 1, nome: 'Improviso', descricao: 'A venda depende inteiramente do dono e da sorte. Não há processo nenhum.' },
  { n: 2, nome: 'Esforço', descricao: 'Há esforço e até time, mas sem processo documentado. O resultado oscila.' },
  { n: 3, nome: 'Estrutura parcial', descricao: 'Existem partes do processo, mas desconectadas. CRM sem rotina, ou rotina sem CRM.' },
  { n: 4, nome: 'Sistema', descricao: 'A operação roda com previsibilidade. Aqui a VOLGUS agrega em escala, não em fundação.' },
];

export function totalScore(a: Answers): number {
  let s = 0;
  s += optionOf('q1', a.q1)?.score ?? 0;
  s += optionOf('q3', a.q3)?.score ?? 0;
  s += optionOf('q4', a.q4)?.score ?? 0;
  s += optionsOf('q5', a.q5).reduce((n, o) => n + o.score, 0);
  s += optionsOf('q6', a.q6).reduce((n, o) => n + o.score, 0);
  s += optionOf('q7', a.q7)?.score ?? 0;
  s += optionOf('q9', a.q9)?.score ?? 0;
  return s;
}

export function stageOf(score: number): Stage {
  if (score <= 8) return STAGES[0]!;
  if (score <= 15) return STAGES[1]!;
  if (score <= 22) return STAGES[2]!;
  return STAGES[3]!;
}
