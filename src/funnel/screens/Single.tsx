import { useEffect, useRef } from 'react';
import type { Option } from '../questions';
import { Btn, Title } from './ui';

export function Single({ title, hint, options, value, optional, onPick, onSkip }: {
  title: string; hint?: string; options: Option[]; value?: string; optional?: boolean; onPick: (id: string) => void; onSkip?: () => void;
}) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, [title]);
  return (
    <>
      <Title id="fx-q">{title}</Title>
      {hint && <p className="fx-hint">{hint}</p>}
      <div className="fx-options" role="group" aria-labelledby="fx-q">
        {options.map((o, i) => (
          <button key={o.id} ref={i === 0 ? first : undefined} type="button" className="fx-option" aria-pressed={value === o.id} onClick={() => onPick(o.id)}>
            <span className="fx-option-key" aria-hidden="true">{i + 1}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
      {optional && onSkip && <div className="fx-actions"><Btn ghost onClick={onSkip}>Pular esta pergunta</Btn></div>}
    </>
  );
}
