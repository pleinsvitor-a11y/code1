import { useEffect, useMemo, useState } from 'react';
import { SITE } from '@/config/site';
import type { Answers } from '../questions';
import { STAGES } from '../scoring';
import { freeGuidance, ifNothingChanges, nextStepCopy, readings } from '../insights';
import { buildMessage, mailtoUrl, postWebhook, summarize, whatsappUrl } from '../submit';
import { Btn } from './ui';

export function Result({ answers, onRestart }: { answers: Answers; onRestart: () => void }) {
  const { stage, route } = useMemo(() => summarize(answers), [answers]);
  const msg = useMemo(() => buildMessage(answers), [answers]);
  const wa = whatsappUrl(msg);
  const mail = mailtoUrl(msg, answers);
  const next = nextStepCopy(route);
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => { void postWebhook(answers); }, [answers]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(msg); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { setShowFallback(true); }
  };
  const nome = answers.q8?.nome?.split(' ')[0] ?? '';

  return (
    <div className="fx-screen fx-result enter-forward" aria-live="polite">
      <div className="fx-stage">
        <span className="fx-stage-n" aria-hidden="true">{stage.n}</span>
        <div>
          <p className="fx-count">Estágio {stage.n} de 4</p>
          <h1 className="fx-stage-nome">{stage.nome}</h1>
        </div>
        <p className="fx-stage-desc">{stage.descricao}</p>
        <div className="fx-regua" role="img" aria-label={`Régua de quatro estágios. Sua operação está no estágio ${stage.n}, ${stage.nome}.`}>
          {STAGES.map((s) => (
            <span key={s.n} className={s.n < stage.n ? 'is-on' : s.n === stage.n ? 'is-here' : ''}><em>{s.n}. {s.nome}</em></span>
          ))}
        </div>
      </div>

      <ol className="fx-leituras" aria-label="Leitura das suas respostas">
        {readings(answers).map((r) => <li key={r}>{r}</li>)}
      </ol>

      <p className="fx-alerta">{ifNothingChanges(answers)}</p>

      <div className="fx-next">
        <h2 className="fx-next-titulo">{next.titulo}</h2>
        <p className="fx-lead">{route === 'amarelo' && nome ? next.texto.replace('Me manda', `${nome}, me manda`) : next.texto}</p>

        {route === 'verde' && (
          SITE.agendaUrl ? (
            <iframe className="fx-embed" src={SITE.agendaUrl} title="Agenda para a conversa de diagnóstico" loading="lazy" />
          ) : (
            <div className="fx-actions"><Btn href={wa}>Marcar a conversa no WhatsApp</Btn></div>
          )
        )}
        {route === 'verde' && (
          <>
            <p className="fx-label">O que levar para a conversa:</p>
            <ol className="fx-lista">
              <li><span>1</span><span>Quantas vendas você fechou nos últimos três meses, e de onde cada uma veio.</span></li>
              <li><span>2</span><span>O que existe hoje de processo: planilha, CRM, script, qualquer coisa escrita.</span></li>
              <li><span>3</span><span>A meta de faturamento para os próximos 12 meses, mesmo que seja um chute.</span></li>
            </ol>
          </>
        )}

        {route === 'amarelo' && (
          <div className="fx-actions"><Btn href={wa}>Mandar mensagem no WhatsApp</Btn></div>
        )}

        {route === 'vermelho' && (
          <>
            <ol className="fx-lista" aria-label="O que fazer agora, sem custo">
              {freeGuidance(answers).map((g, i) => <li key={g}><span>{i + 1}</span><span>{g}</span></li>)}
            </ol>
            <p className="fx-hint">Quando a empresa passar de R$ 800 mil por ano, ou quando isso virar prioridade, a porta continua aberta. Se quiser acompanhar o que a VOLGUS publica sobre processo comercial: <a className="fx-link" href={SITE.instagramMarca} target="_blank" rel="noopener">{SITE.instagramMarcaHandle}</a>.</p>
          </>
        )}

        {route !== 'vermelho' && (
          <div className="fx-fallback">
            <p>Se o WhatsApp não abrir, <a className="fx-link" href={mail}>mande por e-mail</a> ou <button type="button" className="fx-link" onClick={copy}>{copied ? 'copiado' : 'copie o diagnóstico'}</button> e envie por onde preferir.</p>
            {showFallback && <div className="fx-copy"><pre>{msg}</pre></div>}
          </div>
        )}
      </div>

      <div className="fx-actions">
        <button type="button" className="fx-back" onClick={onRestart}>Refazer o diagnóstico</button>
      </div>
    </div>
  );
}
