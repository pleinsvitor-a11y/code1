/** Brazilian phone mask and real validation with specific messages. */
export function onlyDigits(v: string): string { return v.replace(/\D+/g, ''); }

export function maskPhone(v: string): string {
  let d = onlyDigits(v);
  if (d.startsWith('55') && d.length > 11) d = d.slice(2);
  d = d.slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function phoneError(v: string): string | null {
  const d = onlyDigits(v).replace(/^55(?=\d{10,11}$)/, '');
  if (d.length === 0) return 'Precisamos do seu WhatsApp para continuar a conversa.';
  if (d.length < 10) return 'Faltam dígitos: o número precisa ter DDD e 8 ou 9 dígitos.';
  if (d.length > 11) return 'Número longo demais: use DDD e o número, sem o +55.';
  if (/^(\d)\1+$/.test(d)) return 'Esse número não parece real. Confere para a gente?';
  return null;
}

export function emailError(v: string): string | null {
  const s = v.trim();
  if (!s) return 'Precisamos de um e-mail para enviar a leitura.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s)) return 'Esse e-mail está sem @ ou sem domínio. Ex.: nome@empresa.com.br';
  return null;
}

export function nameError(v: string): string | null {
  if (v.trim().length < 2) return 'Como a gente te chama?';
  return null;
}
export function companyError(v: string): string | null {
  if (v.trim().length < 2) return 'Qual o nome da empresa?';
  return null;
}
