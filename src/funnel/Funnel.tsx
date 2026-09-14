import { useCallback, useEffect, useMemo, useState } from 'react';
import { QUESTIONS, TOTAL_STEPS, type Answers, type Contact as ContactT } from './questions';
import { clearState, loadState, saveState } from './storage';
import { summarize } from './submit';
import { Intro } from './screens/Intro';
import { Single } from './screens/Single';
import { Multi } from './screens/Multi';
import { Text } from './screens/Text';
import { Contact } from './screens/Contact';
import { Processing } from './screens/Processing';
import { Result } from './screens/Result';
import { SIMBOLO_VIEWBOX, WORDMARK_VIEWBOX } from '@/lib/brand-paths';
import './funnel.css';

const STEP_PROCESSING = TOTAL_STEPS + 1;
const STEP_RESULT = TOTAL_STEPS + 2;

export default function Funnel() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [dir, setDir] = useState<1 | -1>(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadState();
    if (saved) { setAnswers(saved.answers); setStep(saved.step === STEP_PROCESSING ? TOTAL_STEPS : saved.step); }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) saveState({ step, answers }); }, [step, answers, hydrated]);

  const go = useCallback((n: number, d: 1 | -1 = 1) => { setDir(d); setStep(n); window.scrollTo({ top: 0 }); }, []);
  const next = useCallback(() => go(step + 1, 1), [go, step]);
  const back = useCallback(() => { if (step > 0 && step <= TOTAL_STEPS) go(step - 1, -1); }, [go, step]);
  const patch = useCallback((p: Partial<Answers>) => setAnswers((a) => ({ ...a, ...p })), []);
  const restart = useCallback(() => { clearState(); setAnswers({}); go(0, -1); }, [go]);

  const q = step >= 1 && step <= TOTAL_STEPS ? QUESTIONS[step - 1]! : null;

  // Keyboard: digits pick an option, Enter advances where valid, Esc goes back.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
      if (e.key === 'Escape') { back(); return; }
      if (!q || typing) return;
      if (/^[1-9]$/.test(e.key) && 'options' in q) {
        const opt = q.options[Number(e.key) - 1];
        if (!opt) return;
        e.preventDefault();
        if (q.kind === 'single') { patch({ [q.id]: opt.id } as Partial<Answers>); setTimeout(() => go(step + 1, 1), 200); }
        else {
          const cur = (answers[q.id] as string[] | undefined) ?? [];
          const has = cur.includes(opt.id);
          let nextIds = has ? cur.filter((x) => x !== opt.id) : [...cur, opt.id];
          if (!has && q.max && nextIds.length > q.max) nextIds = nextIds.slice(-q.max);
          patch({ [q.id]: nextIds } as Partial<Answers>);
        }
      }
      if (e.key === 'Enter' && q.kind === 'multi') {
        const cur = (answers[q.id] as string[] | undefined) ?? [];
        if (cur.length) { e.preventDefault(); go(step + 1, 1); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, step, answers, patch, go, back]);

  const surface = useMemo(() => {
    if (step !== STEP_RESULT) return 'preto';
    return summarize(answers).route === 'vermelho' ? 'preto' : 'claro';
  }, [step, answers]);

  const progress = step === 0 ? 0 : Math.min(1, step / TOTAL_STEPS);
  const enterCls = dir === 1 ? 'enter-forward' : 'enter-back';

  return (
    <div className="fx" data-surface={surface}>
      <div className="fx-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)} aria-label="Progresso do diagnóstico">
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
      <header className="fx-top">
        <a href="/" className="fx-logo" aria-label="VOLGUS — voltar para o início">
          <svg className="fx-logo-simbolo" viewBox={SIMBOLO_VIEWBOX} aria-hidden="true"><use href="#volgus-simbolo" /></svg>
          <svg viewBox={WORDMARK_VIEWBOX} aria-hidden="true" style={{ height: '0.95rem' }}><use href="#volgus-wordmark" /></svg>
        </a>
        {q && <span className="fx-count" aria-live="polite">{step} / {TOTAL_STEPS}</span>}
      </header>

      <main className="fx-main" id="conteudo">
        {step === STEP_RESULT ? (
          <Result answers={answers} onRestart={restart} />
        ) : (
          <div key={step} className={`fx-screen ${enterCls}`} aria-live="polite">
            {step === 0 && <Intro onStart={() => go(1, 1)} />}
            {q?.kind === 'single' && (
              <Single title={q.title} hint={q.hint} options={q.options} optional={q.optional} value={answers[q.id] as string | undefined}
                onPick={(id) => { patch({ [q.id]: id } as Partial<Answers>); setTimeout(() => go(step + 1, 1), 200); }}
                onSkip={() => { patch({ [q.id]: undefined } as Partial<Answers>); go(step + 1, 1); }} />
            )}
            {q?.kind === 'multi' && (
              <Multi title={q.title} hint={q.hint} options={q.options} max={q.max} value={(answers[q.id] as string[] | undefined) ?? []}
                onChange={(ids) => patch({ [q.id]: ids } as Partial<Answers>)} onNext={next} />
            )}
            {q?.kind === 'text' && (
              <Text title={q.title} hint={q.hint} placeholder={q.placeholder} maxLength={q.maxLength} value={answers.q2 ?? ''} onChange={(v) => patch({ q2: v })} onNext={next} />
            )}
            {q?.kind === 'contact' && (
              <Contact title={q.title} hint={q.hint} value={answers.q8} onChange={(c: ContactT) => patch({ q8: c })} onNext={next} />
            )}
            {step === STEP_PROCESSING && <Processing onDone={() => go(STEP_RESULT, 1)} />}
          </div>
        )}
      </main>

      <footer className="fx-bottom">
        {step > 0 && step <= TOTAL_STEPS ? (
          <button type="button" className="fx-back" onClick={back}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 8H3M7 4L3 8l4 4" /></svg>
            voltar
          </button>
        ) : <span />}
        {q && <span className="fx-keys" aria-hidden="true"><span><kbd>1</kbd>–<kbd>9</kbd> escolhe</span><span><kbd>Enter</kbd> avança</span><span><kbd>Esc</kbd> volta</span></span>}
      </footer>
    </div>
  );
}
