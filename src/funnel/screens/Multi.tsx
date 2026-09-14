import { useEffect, useRef } from 'react';
import type { Option } from '../questions';
import { Btn, Title } from './ui';

export function Multi({ title, hint, options, value, max, onChange, onNext }: {
  title: string; hint?: string; options: Option[]; value: string[]; max?: number; onChange: (ids: string[]) => void; onNext: () => void;
}) {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, [title]);
  const toggle = (id: string) => {
    if (value.includes(id)) return onChange(value.filter((x) => x !== id));
    if (max && value.length >= max) return onChange([...value.slice(1), id]);
    onChange([...value, id]);
  };
  return (
    <>
      <Title id="fx-q">{title}</Title>
      {hint && <p className="fx-hint">{hint}</p>}
      <div className="fx-options" role="group" aria-labelledby="fx-q">
        {options.map((o, i) => (
          <button key={o.id} ref={i === 0 ? first : undefined} type="button" className="fx-option" role="checkbox" aria-checked={value.includes(o.id)} onClick={() => toggle(o.id)}>
            <span className="fx-option-key" aria-hidden="true">{i + 1}</span>
            <span>{o.label}</span>
          </button>
        ))}
      </div>
      <div className="fx-actions"><Btn onClick={onNext} disabled={value.length === 0}>Continuar</Btn></div>
    </>
  );
}
