import type { ReactNode } from 'react';

export function Btn({ children, onClick, disabled, ghost, type = 'button', href, autoFocus, ariaLabel }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; ghost?: boolean; type?: 'button' | 'submit'; href?: string; autoFocus?: boolean; ariaLabel?: string;
}) {
  const cls = `fx-btn${ghost ? ' fx-btn-ghost' : ''}`;
  const inner = (
    <>
      {!ghost && (
        <span className="fx-btn-circle" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4" /></svg>
        </span>
      )}
      <span>{children}</span>
    </>
  );
  if (href) return <a className={cls} href={href} target="_blank" rel="noopener" onClick={onClick} aria-label={ariaLabel}>{inner}</a>;
  return <button className={cls} type={type} onClick={onClick} disabled={disabled} autoFocus={autoFocus} aria-label={ariaLabel}>{inner}</button>;
}

export function Title({ children, id }: { children: ReactNode; id?: string }) {
  return <h1 className="fx-title" id={id}>{children}</h1>;
}
