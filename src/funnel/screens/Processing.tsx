import { useEffect } from 'react';

export function Processing({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = setTimeout(onDone, reduce ? 300 : 1400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fx-processing" role="status" aria-live="polite">
      <p className="fx-title">Cruzando suas respostas com o padrão de mais de 10 setores.</p>
      <div className="fx-processing-bar" aria-hidden="true"><span /></div>
    </div>
  );
}
