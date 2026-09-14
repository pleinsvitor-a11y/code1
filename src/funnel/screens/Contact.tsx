import { useEffect, useRef, useState } from 'react';
import type { Contact as ContactT } from '../questions';
import { companyError, emailError, maskPhone, nameError, phoneError } from '../validate';
import { Btn, Title } from './ui';

const EMPTY: ContactT = { nome: '', empresa: '', whatsapp: '', email: '', consent: false };

export function Contact({ title, hint, value, onChange, onNext }: {
  title: string; hint?: string; value?: ContactT; onChange: (c: ContactT) => void; onNext: () => void;
}) {
  const v = value ?? EMPTY;
  const first = useRef<HTMLInputElement>(null);
  const [errs, setErrs] = useState<Partial<Record<keyof ContactT, string>>>({});
  const [touched, setTouched] = useState(false);
  useEffect(() => { first.current?.focus(); }, []);

  const validate = (c: ContactT) => {
    const e: Partial<Record<keyof ContactT, string>> = {};
    const n = nameError(c.nome); if (n) e.nome = n;
    const em = companyError(c.empresa); if (em) e.empresa = em;
    const p = phoneError(c.whatsapp); if (p) e.whatsapp = p;
    const ml = emailError(c.email); if (ml) e.email = ml;
    if (!c.consent) e.consent = 'Para continuar, precisamos do seu consentimento para usar esses dados na conversa.';
    return e;
  };
  const set = (patch: Partial<ContactT>) => {
    const next = { ...v, ...patch };
    onChange(next);
    if (touched) setErrs(validate(next));
  };
  const submit = () => {
    const e = validate(v); setErrs(e); setTouched(true);
    if (Object.keys(e).length) {
      const firstKey = (Object.keys(e) as (keyof ContactT)[])[0]!;
      document.getElementById(`fx-${firstKey}`)?.focus();
      return;
    }
    onNext();
  };
  const field = (key: keyof ContactT, label: string, props: React.InputHTMLAttributes<HTMLInputElement>, ref?: React.RefObject<HTMLInputElement | null>) => (
    <div className="fx-field">
      <label className="fx-label" htmlFor={`fx-${key}`}>{label}</label>
      <input id={`fx-${key}`} ref={ref} className="fx-input" aria-invalid={!!errs[key]} aria-describedby={errs[key] ? `fx-${key}-err` : undefined} {...props} />
      {errs[key] && <p className="fx-error" id={`fx-${key}-err`} role="alert">{errs[key]}</p>}
    </div>
  );
  return (
    <form onSubmit={(e) => { e.preventDefault(); submit(); }} style={{ display: 'contents' }} noValidate>
      <Title id="fx-q">{title}</Title>
      {hint && <p className="fx-hint">{hint}</p>}
      <div className="fx-grid2">
        {field('nome', 'Seu nome', { type: 'text', value: v.nome, autoComplete: 'given-name', onChange: (e) => set({ nome: e.target.value }) }, first)}
        {field('empresa', 'Empresa', { type: 'text', value: v.empresa, autoComplete: 'organization', onChange: (e) => set({ empresa: e.target.value }) })}
        {field('whatsapp', 'WhatsApp', { type: 'tel', inputMode: 'tel', value: v.whatsapp, placeholder: '(00) 00000-0000', autoComplete: 'tel-national', onChange: (e) => set({ whatsapp: maskPhone(e.target.value) }) })}
        {field('email', 'E-mail', { type: 'email', inputMode: 'email', value: v.email, autoComplete: 'email', onChange: (e) => set({ email: e.target.value }) })}
      </div>
      <div className="fx-field">
        <label className="fx-consent">
          <input id="fx-consent" type="checkbox" checked={v.consent} aria-invalid={!!errs.consent} aria-describedby={errs.consent ? 'fx-consent-err' : undefined} onChange={(e) => set({ consent: e.target.checked })} />
          <span>Autorizo a VOLGUS a usar estes dados para entrar em contato sobre este diagnóstico. Nada de lista de e-mail, nada de repasse a terceiros. <a href="/privacidade" target="_blank" rel="noopener">Política de privacidade</a>.</span>
        </label>
        {errs.consent && <p className="fx-error" id="fx-consent-err" role="alert">{errs.consent}</p>}
      </div>
      <div className="fx-actions"><Btn type="submit">Ver minha leitura</Btn></div>
    </form>
  );
}
