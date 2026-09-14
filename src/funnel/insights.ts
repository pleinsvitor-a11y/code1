/**
 * Three sentences read from the person's own answers, never generic,
 * plus "what usually happens if nothing changes" and free, useful guidance
 * for the vermelho route. All copy derives from the briefing's five symptoms
 * and the M.E.T.A. method.
 */
import { optionOf, optionsOf, type Answers } from './questions';
import type { Route } from './routing';

export function readings(a: Answers): string[] {
  const out: string[] = [];
  const gaps = optionsOf('q6', a.q6).map((o) => o.tag);
  const team = optionOf('q4', a.q4)?.tag;
  const src = optionsOf('q5', a.q5).map((o) => o.tag);
  const intent = optionOf('q1', a.q1)?.tag;
  const dec = optionOf('q7', a.q7)?.tag;

  if (gaps.includes('gap-funnel') && team && team !== 'team-1')
    out.push('Você tem time, mas não tem funil documentado. Isso significa que o resultado do seu comercial depende do dia que o vendedor está tendo.');
  else if (gaps.includes('gap-funnel'))
    out.push('Você não sabe em qual etapa perde a venda. Sem funil documentado, cada venda perdida é um mistério, e mistério não se corrige.');

  if (gaps.includes('gap-forecast'))
    out.push('Você não consegue prever o faturamento do próximo mês. Pipeline invisível é o sintoma mais caro: ele transforma planejamento em aposta.');

  if (gaps.includes('gap-ramp'))
    out.push('Vendedor novo demora para produzir porque o processo está na sua cabeça, não em um playbook. Cada contratação recomeça do zero.');

  if (gaps.includes('gap-crm'))
    out.push('O CRM existe mas ninguém usa direito. Quase sempre é porque a ferramenta veio antes do processo, e ferramenta sem processo vira cadastro abandonado.');

  if (gaps.includes('gap-referral') || (src.includes('src-referral') && src.length === 1))
    out.push('Boa parte da sua receita vem de indicação. Indicação é ótima e é passiva: você vende quando te indicam, não quando decide vender.');

  if (src.includes('src-unknown'))
    out.push('Você não sabe dizer com precisão de onde vêm as vendas. Sem origem rastreada, não dá para saber onde investir esforço nem o que cortar.');

  if (team === 'team-1' && out.length < 3)
    out.push('Hoje o comercial é você. Enquanto for assim, o crescimento tem o tamanho da sua agenda.');

  if (intent === 'intent-growth' && out.length < 3)
    out.push('A empresa cresceu e o comercial não acompanhou. É o momento em que o dono para de vender para entregar, e o caixa começa a oscilar.');

  if (dec === 'dec-now' && out.length < 3)
    out.push('Você decide e quer resolver em 30 dias. Isso muda a conversa: o primeiro mês do método é justamente o mapeamento dos gargalos.');

  if (out.length === 0)
    out.push('Suas respostas apontam para um comercial que funciona na base do esforço, sem um processo que sobreviva a uma semana ruim.');

  return out.slice(0, 3);
}

export function ifNothingChanges(a: Answers): string {
  const gaps = optionsOf('q6', a.q6).map((o) => o.tag);
  if (gaps.includes('gap-forecast')) return 'O padrão que se repete é este: alguns meses bons, outros inexplicáveis, e nenhuma forma de saber qual vem a seguir. O planejamento vira reação.';
  if (gaps.includes('gap-ramp')) return 'O padrão que se repete é este: contrata, espera meses, troca, contrata de novo. O custo de cada ciclo sai do lucro, e o processo continua na sua cabeça.';
  if (gaps.includes('gap-referral')) return 'O padrão que se repete é este: as indicações secam num trimestre e ninguém sabe de onde vem a próxima venda. O crescimento passa a depender de sorte.';
  return 'O padrão que se repete é este: mais esforço para o mesmo resultado, até o dono virar o gargalo da própria empresa.';
}

export function freeGuidance(a: Answers): string[] {
  const rev = optionOf('q3', a.q3)?.tag;
  const q1 = optionOf('q1', a.q1)?.tag;
  const dec = optionOf('q7', a.q7)?.tag;
  const gaps = optionsOf('q6', a.q6).map((o) => o.tag);
  const out: string[] = [];
  if (rev === 'rev-500')
    out.push('Antes de estruturar, valide: escreva em uma frase quem é o seu cliente ideal (segmento, porte e o problema que você resolve) e venda só para ele por 60 dias. Estrutura em cima de um ICP errado só organiza o erro.');
  out.push('Documente o seu funil em uma folha: as etapas por onde toda venda passa, da primeira conversa ao pagamento. Se você não consegue nomear as etapas, este é o primeiro trabalho, e ele não custa nada.');
  if (gaps.includes('gap-crm')) out.push('Não troque de CRM. Pegue o que você tem e cadastre apenas duas coisas por oportunidade: a etapa atual e a data do próximo contato. Rotina simples vale mais do que ferramenta completa.');
  else out.push('Escreva o script da sua conversa de venda como ela acontece de verdade: abertura, três perguntas que você sempre faz e como você apresenta o preço. Esse texto é o começo do seu playbook.');
  if (q1 === 'intent-research' || dec === 'dec-not-priority')
    out.push('Anote, por 30 dias, de onde veio cada lead e em qual etapa cada venda foi perdida. Quando isso for prioridade, você vai chegar na conversa com os dados na mão, e a estruturação começa pela metade.');
  return out.slice(0, 4);
}

export function nextStepCopy(route: Route): { titulo: string; texto: string } {
  switch (route) {
    case 'verde':
      return { titulo: 'Vamos marcar uma conversa de diagnóstico.', texto: 'Seu cenário é exatamente o que a VOLGUS resolve. São 45 minutos, sem apresentação de slide, só o mapeamento dos seus três maiores gargalos.' };
    case 'amarelo':
      return { titulo: 'Me manda uma mensagem.', texto: 'Tem coisa aqui que dá para resolver antes mesmo de contratar qualquer coisa. Me manda uma mensagem que eu te falo o que eu faria no seu lugar.' };
    case 'vermelho':
      return { titulo: 'Sendo honesto.', texto: 'Pelo momento da sua empresa, contratar estruturação comercial agora não seria o melhor uso do seu dinheiro. O que resolve o seu caso hoje é outra coisa, e está aqui embaixo, de graça.' };
  }
}
