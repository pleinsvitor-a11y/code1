import { Btn, Title } from './ui';

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <>
      <Title>Antes de marcar uma conversa, vamos entender onde seu comercial está.</Title>
      <p className="fx-lead">São 8 perguntas. Leva dois minutos. No final você recebe uma leitura do estágio da sua operação — e, se fizer sentido, a gente marca uma conversa.</p>
      <div className="fx-actions"><Btn onClick={onStart} autoFocus>Começar</Btn></div>
    </>
  );
}
