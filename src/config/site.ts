/**
 * Every value the owner may want to change lives here.
 * Nothing below is hardcoded anywhere else in the codebase.
 */
export const SITE = {
  name: 'VOLGUS',
  domain: 'https://www.volgus.com.br',
  title: 'VOLGUS — Estruturação e gestão comercial para PMEs',
  description:
    'A VOLGUS entra no comercial da sua empresa e constrói a estrutura que faz a venda acontecer sem depender de você. Método, processo e acompanhamento.',
  /** Digits only, with country code. +55 15 99705-6889 */
  whatsapp: '5515997056889',
  email: 'vitor@volgus.com.br',
  instagramMarca: 'https://instagram.com/volgusms',
  instagramMarcaHandle: '@volgusms',
  instagramPessoal: 'https://instagram.com/vitorpleins',
  instagramPessoalHandle: '@vitorpleins',
  city: 'Maringá, PR',
  founder: 'Vitor Pleins',
  /** Calendly / Cal.com URL. Empty string hides the embed and falls back to WhatsApp. */
  agendaUrl: '',
  /** Optional POST endpoint (Formspree, n8n, Make, Zapier, Tally). Empty = disabled. */
  webhookUrl: '',
  /** Tracking. Both empty = no script is loaded and no cookie banner is shown. */
  metaPixelId: '',
  ga4Id: '',
} as const;

export type SiteConfig = typeof SITE;
