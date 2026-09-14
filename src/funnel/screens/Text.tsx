import { useEffect, useRef, useState } from 'react';
import { Btn, Title } from './ui';

export function Text({ title, hint, placeholder, maxLength, value, onChange, onNext }: {
  title: string; hint?: string; placeholder: string; maxLength: number; value: string; onChange: (v: string) => void; onNext: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { ref.current?.focus(); }, [title]);
  const submit = () => {
    if (value.trim().length < 3) { setErr('Conta em poucas palavras o que a empresa faz. É o que mais ajuda na conversa.'); ref.current?.focus(); return; }
    onNext();
  };
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="fx-screen-form" style={{ display: 'contents' }}>
      <Title id="fx-q">{title}</Title>
      {hint && <p className="fx-hint">{hint}</p>}
      <div className="fx-field">
        <label className="sr-only" htmlFor="fx-q2">{title}</label>
        <input id="fx-q2" ref={ref} className="fx-input" type="text" value={value} maxLength={maxLength} placeholder={placeholder} autoComplete="organization-title" aria-invalid={!!err} aria-describedby={err ? 'fx-q2-err' : undefined} onChange={(e) => { onChange(e.target.value); if (err) setErr(null); }} />
        {err && <p className="fx-error" id="fx-q2-err" role="alert">{err}</p>}
      </div>
      <div className="fx-actions"><Btn type="submit">Continuar</Btn></div>
    </form>
  );
}
