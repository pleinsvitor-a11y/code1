# PROMPT MESTRE — SITE VOLGUS
### Documento de execução (cópia fiel da instrução inicial do projeto)

---

## 0. LEIA ISTO ANTES DE ESCREVER UMA LINHA DE CÓDIGO

Você é o **diretor de design e engenheiro líder** deste projeto. Não é um gerador de boilerplate. O objetivo declarado do cliente é que este site tenha qualidade de inscrição em premiação internacional de web design (Awwwards, FWA, CSS Design Awards) — e que ao mesmo tempo seja uma máquina comercial que converte.

Essas duas coisas não são opostas. Os sites que ganham prêmio hoje ganham por três critérios simultâneos: **direção de arte com ponto de vista**, **motion com direção e propósito** e **performance real em aparelho mediano**. Um hero 3D que cai para 18fps em Android intermediário não ganha nada. Beleza a 60fps é a disciplina inteira.

### Antes de codar, execute este ritual em três passos

**Passo 1 — Leia todo o contexto.** Leia integralmente:
- `./docs/VOLGUS_BRIEFING.md` (documento-fonte da marca — leia inteiro, duas vezes)
- `./docs/Volgus_-_MIV.pdf` (manual de identidade visual, 57 páginas)
- Liste e inspecione `./public/brand/` e `./public/photos/`

**Passo 2 — Escreva um plano de design em `./docs/DESIGN_PLAN.md`** antes de qualquer código. O plano deve conter:
- Sistema de tokens: 5 a 6 cores nomeadas com hex, escala tipográfica completa, escala de espaçamento
- Conceito de layout descrito em prosa, com wireframes em ASCII de cada seção
- Os princípios que tornam esta página única e não confundível com nenhuma outra

**Passo 3 — Critique o próprio plano contra o briefing.** Para cada decisão, pergunte: "eu chegaria nisso para qualquer consultoria B2B, ou isso é especificamente VOLGUS?" Se a resposta for a primeira, revise e registre o que mudou e por quê. Só depois disso comece a escrever código.

**Não pule esses três passos.** Mostre o plano ao usuário e aguarde aprovação antes de construir.

---

## 1. RESTRIÇÕES INVIOLÁVEIS

1. **Sem GitHub e sem Vercel** como dependência de deploy. O build final é uma pasta estática (`dist/`) que sobe por FTP ou painel de hospedagem. Nada pode depender de build na nuvem, serverless function ou edge runtime.
2. **Sem backend próprio.** O formulário funciona 100% no cliente.
3. **Nenhum nome de cliente da VOLGUS aparece no site.** Sem logo, sem depoimento nominal, sem case identificado. Leia a seção 07 do briefing.
4. **Sem preço, sem tabela de planos, sem catálogo de serviços.** O site disserta sobre o serviço, não lista SKUs.
5. **Sem lorem ipsum, sem placeholder, sem texto inventado sobre a empresa.** Toda copy sai do briefing ou é derivada dele. Se faltar informação, pergunte ao usuário — não invente.
6. **Sem imagem de banco de imagens.** Só as 4 fotos reais fornecidas, os elementos da marca e o que você desenhar em SVG.
7. **Sem `localStorage` para dados sensíveis do lead** além do rascunho da própria sessão.
8. **Português do Brasil em toda a interface.** Código e comentários em inglês.
9. **Respeite `prefers-reduced-motion`** em absolutamente toda animação.
10. **Nenhuma dependência de CDN externo em runtime.** Tudo auto-hospedado, inclusive fontes. O site precisa funcionar em hospedagem compartilhada brasileira sem surpresa.

---

## 2. STACK TÉCNICA — EXATA

```
Astro 5              framework, saída estática pura
TypeScript           modo strict
Tailwind CSS 4       via @tailwindcss/vite, tokens em @theme
@astrojs/react       apenas para a ilha do fluxo de qualificação
GSAP 3 + ScrollTrigger  motion orquestrado
Lenis                smooth scroll com peso
```

### `astro.config.mjs`

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.volgus.com.br',
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto', assets: 'assets' },
  vite: { plugins: [tailwindcss()] },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
```

### Verificação obrigatória antes de entregar

```bash
npm run build && npx serve dist
```

O site precisa abrir e funcionar por completo servindo apenas a pasta `dist/`, sem nenhum processo Node rodando.

---

## 3. ESTRUTURA DE PASTAS

```
volgus-site/
├── docs/
│   ├── VOLGUS_BRIEFING.md          ← fonte da verdade, leia primeiro
│   ├── Volgus_-_MIV.pdf            ← manual de identidade
│   ├── DESIGN_PLAN.md              ← você escreve no passo 2
│   └── DEPLOY.md                   ← você escreve ao final
├── public/
│   ├── brand/
│   │   ├── logo-principal.svg      ← versão 01
│   │   ├── logo-empilhado.svg      ← versão 02
│   │   ├── simbolo-lime.svg        ← versão 03
│   │   ├── favicon.svg / .ico      ← versão 04
│   │   └── patterns/               ← grid, dots, linhas v, linhas h (SVG)
│   ├── fonts/                      ← .woff2 auto-hospedados
│   ├── photos/                     ← 4 fotos originais
│   ├── video/                      ← loop tratado, ver seção 10
│   ├── og/                         ← imagens Open Graph 1200x630
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── styles/global.css           ← tokens @theme + base
│   ├── layouts/Base.astro
│   ├── components/
│   │   ├── Nav.astro
│   │   ├── Hero.astro
│   │   ├── Sintomas.astro
│   │   ├── Tese.astro
│   │   ├── Metodo.astro
│   │   ├── Ordem.astro
│   │   ├── NaoSomos.astro
│   │   ├── Vitor.astro
│   │   ├── ParaQuem.astro
│   │   ├── CtaFinal.astro
│   │   ├── Footer.astro
│   │   └── ui/ (Botao, Marquee, Pattern, RevealText, Cursor)
│   ├── funnel/                     ← ilha React
│   │   ├── Funnel.tsx
│   │   ├── questions.ts
│   │   ├── scoring.ts
│   │   ├── routing.ts
│   │   ├── submit.ts
│   │   └── screens/
│   ├── lib/ (motion.ts, lenis.ts, analytics.ts)
│   ├── config/site.ts              ← TODAS as variáveis editáveis
│   └── pages/
│       ├── index.astro
│       ├── diagnostico.astro
│       ├── privacidade.astro
│       └── 404.astro
```

### `src/config/site.ts` — centralize tudo que o usuário vai querer trocar

```ts
export const SITE = {
  domain: 'https://www.volgus.com.br',
  whatsapp: '5515997056889',            // CONFIRMAR com o usuário
  email: 'vitor@volgus.com.br',
  instagramMarca: 'https://instagram.com/',   // CONFIRMAR
  instagramPessoal: 'https://instagram.com/vitorpleins',
  agendaUrl: '',                        // Cal.com ou Calendly — vazio = esconde o embed
  webhookUrl: '',                       // opcional, ver seção 8
  metaPixelId: '',
  ga4Id: '',
} as const;
```

Nada de valor hardcoded espalhado pelos componentes. Tudo importa daqui.

---

## 4. DESIGN SYSTEM — TOKENS

### Cores

```css
@theme {
  --color-preto:        #000000;
  --color-lime:         #BAFF00;
  --color-verde:        #68E80C;
  --color-branco:       #FFFFFF;
  --color-cinza-claro:  #F0F0F0;
  --color-cinza-escuro: #383838;

  /* derivados permitidos, só para estado de interface */
  --color-preto-sutil:  #0A0A0A;  /* USAR COM PARCIMÔNIA */
  --color-linha:        rgba(255,255,255,0.12);
  --color-linha-clara:  rgba(0,0,0,0.12);
}
```

**Regra de uso do lime.** O lime não é cor de fundo genérica nem de decoração. Ele aparece em exatamente três situações:

1. **Ação** — botões primários, o traço que marca o CTA, o indicador de progresso do fluxo
2. **Verdade** — a palavra ou número que carrega o argumento central de uma seção, nunca mais de um por tela
3. **Marca** — o símbolo caligráfico do logo

Em qualquer outro lugar, use preto, branco e os dois cinzas. Se ao olhar um scroll completo você contar mais de 8 aparições de lime, reduza.

**Aviso sobre preto tintado:** `#0B0B0B` e `#111` usados no lugar de preto puro são um tell de página gerada. O manual da VOLGUS define `#000000`. Use preto puro nas superfícies institucionais.

### Tipografia

| Papel | Fonte oficial | Substituto | Variável Tailwind |
|---|---|---|---|
| Display | Roc Grotesk | **Bricolage Grotesque** (eixo de largura) | `--font-display` |
| Serifa editorial | The Seasons | **Gloock** | `--font-editorial` |
| Apoio narrativo | Fraunces | **Fraunces** (idêntica) | `--font-narrativa` |
| Manuscrita | LTC Francis | **Nothing You Could Do** | `--font-mao` |
| Corpo | Work Sans | **Work Sans** (idêntica) | `--font-corpo` |

Baixe os `.woff2` e sirva localmente com `font-display: swap`. Nada de `<link>` para fonts.googleapis.com.

### Escala tipográfica

```css
--text-mega:  clamp(3.5rem, 12vw, 11rem);   /* hero, display, tracking -0.04em */
--text-h1:    clamp(2.5rem, 6.5vw, 6rem);
--text-h2:    clamp(1.875rem, 4vw, 3.5rem);
--text-h3:    clamp(1.375rem, 2.2vw, 2rem);
--text-corpo: clamp(1.0625rem, 1.15vw, 1.25rem);
--text-micro: 0.8125rem;
```

Corpo de texto: máximo **68 caracteres por linha**, `line-height: 1.6`. Em Fraunces (serifada), `line-height: 1.7`.

### Espaçamento

Escala base 8px. Espaço vertical entre seções: `clamp(6rem, 12vw, 14rem)`.

### Grid

12 colunas, `max-width: 1440px`, gutter `clamp(1.25rem, 4vw, 5rem)`. Pelo menos três seções devem sangrar até a borda.

---

## 5. CONCEITO CRIATIVO — A DIREÇÃO DE ARTE

### O conceito: "Caligrafia e Arquitetura"

**Camada ARQUITETURA (a ciência).** Os quatro patterns oficiais do manual — grid, dot grid, linhas verticais, linhas horizontais. SVG em `<pattern>`, opacidade entre 6% e 12%, nunca raster. Linhas-guia finas, réguas com marcações, numeração de seção alinhada à margem.

**Camada CALIGRAFIA (a arte).** Um traço manuscrito derivado do V do logo — aparece **três vezes no site inteiro**: hero, tese central, CTA final. SVG animado com `stroke-dasharray` / `stroke-dashoffset` ao entrar na viewport.

### Onde gastar a ousadia

**Em um lugar só: a tipografia do hero e a transição de modo entre as seções.** Bricolage Grotesque tem eixo de largura variável: o título do hero comprime ou expande conforme o scroll.

### Transição de modo claro/escuro entre seções

- **Preto** = o problema, o caos, o diagnóstico honesto
- **Claro** = o método, a estrutura, a saída

ScrollTrigger interpola a cor de fundo do `<body>` e as cores de texto; a nav inverte com `mix-blend-mode: difference` no logo.

### Lista do que NÃO fazer

- Cards arredondados idênticos com a mesma sombra
- Eyebrow em CAIXA ALTA com letter-spacing acima de cada título
- Uma palavra do título em cor diferente do resto
- Numeração `01 / 02 / 03` em conteúdo que não é sequência
- Seta `→` colada no texto de todo botão
- Fonte monoespaçada para rótulos pequenos
- Fade-and-slide-up em cada seção
- Hover com `translateY(-4px)` em todo card
- Metadados unidos por ponto médio `A · B · C`
- Gradiente decorativo de fundo sem significado
- Blob, mesh gradient, glassmorphism

### Acabamento

- Cursor customizado apenas em desktop; cresce e vira lime sobre interativos. Desligado em touch.
- `::selection { background: var(--color-lime); color: #000; }`
- Foco de teclado visível: anel lime 2px com offset.
- Scrollbar discreta.
- Marquee horizontal com frases-síntese, lento, pausa no hover. Uma vez só.
- Favicon = versão 04 do logo.

---

## 6. ARQUITETURA DA HOME — SEÇÃO A SEÇÃO COM COPY

Home: página única, scroll longo, um único CTA repetido: **Fazer o diagnóstico**.

### 6.1 — Navegação
Fixa, fina. Símbolo à esquerda, 2–3 âncoras no centro em telas grandes, botão lime "Diagnóstico" à direita. Encolhe ao rolar. Mobile: só logo e botão.

### 6.2 — HERO (fundo preto)
Tipográfico. Bricolage 800, condensada, toda a largura, 2–3 linhas. Foto P&B do Vitor com máscara. Grid 8%. Traço caligráfico cruzando a palavra-chave.

> **Você não tem problema de venda.**
> **Você tem problema de previsibilidade.**

Subtítulo (Work Sans, máx. 2 linhas):
> A VOLGUS entra no comercial da sua empresa e constrói a estrutura que faz a venda acontecer sem depender de você.

CTA primário: **Fazer o diagnóstico** — microtexto: `2 minutos · sem compromisso · resposta na hora`
CTA secundário: `Entender como funciona`

Animação de entrada: sequência única ≤ 1,2s. Linhas revelam por máscara vertical, stagger 80ms. Traço desenha por último.

### 6.3 — SINTOMAS (preto → cinza escuro)
> **Não é falta de produto. Não é falta de mercado.**
Subtítulo Fraunces itálico: > É falta de processo.

Lista tipográfica (não cards), régua fina entre itens:

| Sintoma | Tradução |
|---|---|
| Nenhum funil documentado | "Não sei em qual etapa eu perco a venda" |
| Pipeline invisível | "Não consigo prever o que vou faturar mês que vem" |
| Vendedor novo demora meses para produzir | "O processo está na minha cabeça, não tem playbook" |
| CRM comprado e abandonado | "Comprei a ferramenta antes de ter o processo" |
| Crescimento travado na indicação | "Eu vendo quando me indicam, não quando eu decido vender" |

Fechamento: > **O preço do improviso é mais alto do que você imagina.**
Dados: `74% das PMEs não têm processo comercial estruturado` · `68% dos donos dizem que vendas é o principal gargalo` · `58% dos leads pagos nunca são respondidos`

### 6.4 — A TESE (vira para `#F0F0F0`)
Gloock, grande, centralizado: > **Venda é a interseção entre ciência e arte.**

**CIÊNCIA** (grid ao fundo) — ICP. Funil. CRM. Scripts. Cadência. Indicadores. Rotina. O que pode ser documentado, repetido, medido e ensinado.
**ARTE** (traço manuscrito) — Escuta. Empatia. Leitura de contexto. Timing. A conversa que abre a porta. O que não cabe em planilha.

Fechamento: > Quem vende ferramenta entrega ciência sem arte. Quem vende motivação entrega arte sem ciência. A VOLGUS entrega os dois — e é por isso que o processo sobrevive quando o dono sai da sala.

Segunda aparição do traço.

### 6.5 — O MÉTODO M.E.T.A. (claro)
> **Método tem nome.**
Linha do tempo horizontal (desktop) / vertical (mobile), letra gigante M / E / T / A.

**M — MAPEAR.** Entender onde a empresa está. Diagnóstico 360º do pré ao pós-venda, análise de canais, funis, comportamento e rotina. Leitura real dos gargalos, não achismo.
**E — ESTRUTURAR.** Criar a fundação do comercial que funciona e se mantém. Plano de ação por canal, metas e indicadores, revisão de CRM, criação de scripts, funis e régua de abordagem.
**T — TREINAR.** O time precisa saber o que fazer e como. Treinamento ao vivo, abordagem, objeções, técnica e pitch, integrados à rotina comercial.
**A — ACOMPANHAR.** A diferença entre ter um plano e ter resultado. Reuniões 1:1, suporte ativo, relatórios de progresso e revisão contínua dos indicadores.

Pin com ScrollTrigger só se performar.

### 6.6 — A ORDEM (claro, curta)
> **A maioria compra a ferramenta primeiro. Por isso a ferramenta não funciona.**
Diagrama SVG: **ICP → FUNIL → SCRIPTS → CRM**
> A VOLGUS nunca vende CRM. Instala o processo que torna o CRM útil.

### 6.7 — O QUE A VOLGUS NÃO É (preto)
> **O que a gente não faz.**
- Não é curso. Você não assiste aula, você constrói a operação.
- Não é palestra motivacional. Ninguém sai animado e volta igual na segunda-feira.
- Não é relatório de consultoria. Diagnóstico que fica na gaveta não muda faturamento.
- Não é agência de marketing. Marketing traz lead. Sem processo, lead vira custo.
- Não é terceirização da venda. A operação é sua, e ela precisa funcionar sem a gente também.

> A gente entra na sua operação como diretor comercial: desenha o sistema, executa junto com o seu time e acompanha a evolução até rodar sozinho.

### 6.8 — VITOR (preto, foto em destaque)
> **De vendedor para vendedor. De quem viveu o caos e venceu com estrutura.**
> Mais de 7 anos em vendas, B2C e B2B, no Brasil e na Europa. Já estruturei operações que somaram mais de R$ 2,1 milhões em nove meses. Passei por fintech de grande porte no setor de meios de pagamento, liderando times e construindo sistemas comerciais do zero.
>
> Hoje eu faço isso dentro da empresa dos outros — e a régua é sempre a mesma: o comercial precisa funcionar quando ninguém está olhando.

`7+ anos em vendas` · `R$ 2,1 mi estruturados em 9 meses` · `Operações em mais de 10 setores`
Assinatura `Vitor Pleins` em fonte manuscrita, pequena.

### 6.9 — MARQUEE (faixa lime)
`Vender uma vez é sorte. Vender todo mês é sistema.` · `Venda não é feeling. É método.` · `Seu negócio não precisa de mais esforço. Precisa de estrutura.` · `Empresa que cresce não faz canal. Opera arquitetura.` · `Quem sabe vender domina o próprio destino.`

### 6.10 — PARA QUEM É E PARA QUEM NÃO É (claro)
**Faz sentido conversar se:**
- Sua empresa fatura entre R$ 800 mil e R$ 8 milhões por ano
- Você presta serviço B2B e vende de forma consultiva
- Tem de 1 a 6 pessoas no comercial, incluindo você
- O crescimento travou e boa parte da receita ainda vem de indicação
- Você quer estrutura, não atalho

**Não faz sentido agora se:**
- Você ainda está validando o produto ou o mercado
- Procura curso, palestra ou conteúdo motivacional
- Quer terceirizar a venda em vez de estruturar a operação
- Espera resultado sem envolver o time na mudança

> Se você está no segundo grupo, tudo bem. O diagnóstico vai te dizer isso em dois minutos, sem custo e sem conversa de vendas.

### 6.11 — CTA FINAL (preto ou lime pleno)
Terceira aparição do traço.
> **Vamos organizar o seu comercial?**
> Comece pelo diagnóstico. São 8 perguntas, dois minutos, e você recebe na hora uma leitura do estágio em que a sua operação comercial está.
Botão: **Fazer o diagnóstico**
Microtexto: `Sem pressão. Sem firula. Só uma conversa honesta para te ajudar a vender mais sem perder o controle.`

### 6.12 — RODAPÉ
Logo, Maringá, PR, e-mail, WhatsApp, Instagram, política de privacidade, ano. Linha fina lime no topo.

---

## 7. A PÁGINA `/diagnostico` — O FLUXO

### Regras de interface
- Tela cheia, uma pergunta por vez
- Sem navegação, sem rodapé. Só logo (volta para a home) e barra de progresso lime no topo
- Transição: deslize horizontal curto com fade, 280ms, `cubic-bezier(.22,1,.36,1)`
- Botão "voltar" discreto
- Teclado: números selecionam, Enter avança, Esc volta
- Estado em `sessionStorage`
- Autofoco no primeiro campo
- Mobile: botões ≥ 56px

### Tela 0
> **Antes de marcar uma conversa, vamos entender onde seu comercial está.**
> São 8 perguntas. Leva dois minutos. No final você recebe uma leitura do estágio da sua operação — e, se fizer sentido, a gente marca uma conversa.
Botão: **Começar**

### As perguntas (score entre parênteses)

**Q1 — Intenção** "O que te trouxe até aqui?"
- Meu comercial não tem processo e eu sei disso (+3)
- Tenho time, mas o resultado oscila demais (+3)
- Cresci e o comercial não acompanhou (+3)
- Estou pesquisando, sem urgência definida (+0)

**Q2 — Negócio** "O que a sua empresa faz?" — texto curto livre, sem score.

**Q3 — Porte** "Qual o faturamento anual da empresa hoje?"
- Até R$ 500 mil (−2) · R$ 500 mil a R$ 800 mil (+1) · R$ 800 mil a R$ 3 milhões (+4) · R$ 3 milhões a R$ 8 milhões (+4) · Acima de R$ 8 milhões (+2)

**Q4 — Time** "Quantas pessoas trabalham no comercial hoje, contando você?"
- Só eu (+2) · 2 a 3 (+4) · 4 a 6 (+4) · Mais de 6 (+2)

**Q5 — Origem da receita** (múltipla) "De onde vêm suas vendas hoje?"
- Indicação (+2) · Prospecção ativa (+1) · Tráfego pago ou redes sociais (+1) · Não sei dizer com precisão (+3)

**Q6 — Gargalo** (até duas) "O que mais trava hoje?"
- Não sei em qual etapa eu perco a venda (+3)
- Não consigo prever o faturamento do próximo mês (+3)
- Vendedor novo demora demais para produzir (+3)
- CRM existe mas ninguém usa direito (+3)
- Só vendo quando me indicam (+3)

**Q7 — Decisão e urgência** "Quem decide sobre isso, e para quando?"
- Eu decido, e quero resolver nos próximos 30 dias (+5)
- Eu decido, mas ainda estou avaliando (+3)
- Decido com sócio ou conselho (+2)
- Ainda não é prioridade (−3)

**Q8 — Contato** Nome · Empresa · WhatsApp (máscara BR) · E-mail · consentimento LGPD (não pré-marcado). Validação real com mensagens específicas.

**Q9 — opcional** "Você já tem ideia de quanto pretende investir para resolver isso?"
- Ainda não pensei nisso (+0) · Até R$ 2 mil por mês (+1) · R$ 2 mil a R$ 5 mil por mês (+3) · Acima de R$ 5 mil por mês (+4) · Prefiro não responder (+0)

### Estágio (`scoring.ts`)

| Pontuação | Estágio | Nome |
|---|---|---|
| até 8 | 1 | Improviso |
| 9 a 15 | 2 | Esforço |
| 16 a 22 | 3 | Estrutura parcial |
| 23+ | 4 | Sistema |

### Roteamento
- **Verde** — faturamento ≥ R$ 800 mil **E** Q7 ≥ 3 pontos **E** total ≥ 14
- **Vermelho** — faturamento ≤ R$ 500 mil **OU** Q7 = "ainda não é prioridade" **OU** Q1 = "estou pesquisando"
- **Amarelo** — todo o resto

### Tela final — o veredito
1. "Processando" ≤ 1,4s: "cruzando suas respostas com o padrão de mais de 10 setores"
2. Estágio em display grande, régua de 4 posições
3. Três frases específicas lidas das respostas
4. O que costuma acontecer se nada mudar
5. Próximo passo por perfil

**Verde:** > Seu cenário é exatamente o que a VOLGUS resolve. Vamos marcar uma conversa de diagnóstico — 45 minutos, sem apresentação de slide, só o mapeamento dos seus três maiores gargalos.
Agenda via `SITE.agendaUrl`; se vazio, botão WhatsApp. "O que levar para a conversa" — três itens.

**Amarelo:** > Tem coisa aqui que dá para resolver antes mesmo de contratar qualquer coisa. Me manda uma mensagem que eu te falo o que eu faria no seu lugar.
Botão WhatsApp com diagnóstico pré-preenchido.

**Vermelho:** > Sendo honesto: pelo momento da sua empresa, contratar estruturação comercial agora não seria o melhor uso do seu dinheiro. O que resolve o seu caso hoje é outra coisa — e está aqui embaixo, de graça.
3–4 orientações concretas baseadas nas respostas. Sem botão de venda.

---

## 8. ENVIO DOS DADOS — SEM BACKEND (`submit.ts`)

**Camada 1 — WhatsApp.** `https://wa.me/{SITE.whatsapp}?text={encodeURIComponent(msg)}`

```
Diagnóstico VOLGUS — {NOME} / {EMPRESA}
Estágio: {N} — {NOME_DO_ESTÁGIO} · Perfil: {VERDE|AMARELO|VERMELHO}

Negócio: {Q2}
Faturamento: {Q3}
Time comercial: {Q4}
Origem das vendas: {Q5}
Gargalos: {Q6}
Decisão: {Q7}
Investimento: {Q9 ou "não informado"}

Contato: {WHATSAPP} · {EMAIL}
Origem: {utm_source}/{utm_medium}/{utm_content}
```

**Camada 2 — Webhook opcional.** `POST` JSON com `fetch`, `try/catch`, timeout 6s via `AbortController`. Falha silenciosa.

**Camada 3 — `mailto:` de resgate** + bloco com botão "copiar".

**UTMs:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `fbclid` → `sessionStorage` → incluídos no envio.

---

## 9. MOTION

| Momento | Tratamento |
|---|---|
| Carga do hero | Sequência única, 1,2s, máscara + traço SVG |
| Scroll geral | Lenis `lerp: 0.085` |
| Transição preto→claro | `background-color` e `color` via ScrollTrigger |
| Nav | Encolhe ao rolar, `mix-blend-mode: difference` |
| Método M.E.T.A. | Pin sequencial — só se performar |
| Traço caligráfico | `stroke-dashoffset`, 3 ocorrências |
| Marquee | Loop em transform, pausa no hover |
| Fluxo | Slide horizontal 280ms |
| Botões | Mudança de cor, sem levantar, sem escala |

**Proibido:** fade-and-slide-up genérico, parallax gratuito, contador animado, partícula, WebGL sem motivo.

**Reduced motion:** desliga Lenis e pins, mostra estado final, só opacidade < 150ms.

---

## 10. VÍDEO

Nunca o MP4 original. Loop ≤ 6s, sem áudio, < 1,5 MB:

```bash
ffmpeg -i entrada.mp4 -t 6 -an -vf "scale=1280:-2" -c:v libx264 -crf 30 -preset slow -movflags +faststart loop.mp4
ffmpeg -i entrada.mp4 -t 6 -an -vf "scale=1280:-2" -c:v libvpx-vp9 -crf 40 -b:v 0 loop.webm
ffmpeg -i entrada.mp4 -ss 00:00:01 -vframes 1 -q:v 2 poster.jpg
```

Não no hero. Fundo de seção intermediária com `autoplay muted loop playsinline preload="none"` + poster, ou player sob demanda em modal. Sem vídeo no build → poster estático + `TODO` no código e no `DEPLOY.md`.

---

## 11. FOTOS

- **Retrato P&B (mão no queixo):** hero. Máscara, sangra na borda.
- **Retrato sério (braços cruzados):** método ou "o que não somos". Duotone preto/lime com moderação.
- **Retrato sorrindo sentado:** "Vitor" ou CTA final.
- **Parede de tijolos:** só em P&B ou fortemente dessaturada.

`<Image />` do Astro, `widths={[480, 768, 1200, 1800]}`, `loading="lazy"` exceto hero (`eager`, `fetchpriority="high"`). `alt` descritivo real.

---

## 12. PERFORMANCE, ACESSIBILIDADE, SEO, LGPD

**Performance:** Lighthouse mobile Performance ≥ 92, Accessibility 100, Best Practices ≥ 95, SEO 100. LCP < 1,8s (4G). CLS < 0,05. Home < 900 KB no primeiro carregamento incluindo fontes. Máximo 5 arquivos de fonte.

**Acessibilidade:** contraste 4.5:1 (lime nunca sobre branco), teclado completo, `aria-live="polite"` no fluxo, labels reais, skip link, landmarks, headings sem pulo.

**SEO:** `<title>`: `VOLGUS — Estruturação e gestão comercial para PMEs`. Description ≤ 155 chars. OG/Twitter completos, imagem 1200x630. JSON-LD `Organization` + `ProfessionalService` (`areaServed: Brasil`, `founder: Vitor Pleins`, `address: Maringá, PR`). `sitemap.xml`, `robots.txt`, `lang="pt-BR"`, canonical.

**LGPD:** consentimento explícito no Q8 não pré-marcado; `/privacidade` real; banner de cookies só se Pixel/GA4 configurados; tracking só após consentimento.

---

## 13. FASES DE EXECUÇÃO

- **Fase 0 — Reconhecimento.** Ler briefing e MIV. Listar o que falta. Perguntas da seção 15. Parar e aguardar.
- **Fase 1 — Plano de design.** `DESIGN_PLAN.md`. Parar e aguardar aprovação.
- **Fase 2 — Fundação.** Projeto Astro, tokens, fontes, layout base, Nav, Footer, patterns, botão, 404. Build OK.
- **Fase 3 — Home, seção por seção.** 6.2 → 6.12. Screenshot em 1440, 768 e 390 ao fim de cada seção.
- **Fase 4 — Motion.** GSAP, Lenis, transição de modo, traço caligráfico. Testar reduced-motion.
- **Fase 5 — `/diagnostico`.** Máquina de estados, perguntas, scoring, roteamento, veredito, envio.
- **Fase 6 — Integrações e conformidade.** UTMs, WhatsApp, webhook, LGPD, privacidade, SEO, JSON-LD, OG.
- **Fase 7 — QA e entrega.** Checklist, build final, `DEPLOY.md`.

---

## 14. CHECKLIST DE ACEITE

**Funcional**
- [ ] `npm run build` sem erro nem warning
- [ ] `npx serve dist` serve o site completo, com o fluxo funcionando
- [ ] Fluxo completo nos três perfis (verde, amarelo, vermelho)
- [ ] WhatsApp abre com a mensagem correta e completa
- [ ] UTMs capturados e presentes na mensagem
- [ ] Voltar e avançar no fluxo preservam as respostas
- [ ] Refresh no meio do fluxo não perde o progresso
- [ ] Todos os links do rodapé funcionam
- [ ] 404 existe e é bonita

**Visual**
- [ ] Sem quebra em 1920, 1440, 1280, 1024, 768, 430 e 390px
- [ ] Nenhum overflow horizontal
- [ ] Nenhuma sobreposição de seção
- [ ] Cores fiéis ao MIV, sem hex fora da paleta
- [ ] Lime no máximo 8 vezes no scroll completo
- [ ] Traço caligráfico exatamente 3 vezes
- [ ] Fontes sem FOUT visível
- [ ] Favicon é a versão 04 do logo

**Qualidade**
- [ ] Lighthouse mobile bate as metas
- [ ] Zero erro no console
- [ ] Reduced-motion testado
- [ ] Teclado completo, foco visível
- [ ] Contraste validado, lime nunca sobre branco
- [ ] Nenhum item da lista "o que NÃO fazer"
- [ ] Nenhum nome de cliente
- [ ] Nenhum preço

**Entrega**
- [ ] `DEPLOY.md` explicando FTP, domínio e `config/site.ts`
- [ ] Todos os `TODO` listados no `DEPLOY.md`

---

## 15. PERGUNTAS DA FASE 0

1. WhatsApp comercial, com DDD?
2. Handle exato do Instagram da VOLGUS?
3. Link de agenda (Cal.com ou Calendly)? Se não, verde vai para WhatsApp.
4. Fontes comerciais com licença de webfont no zip? Se não, substitutos livres.
5. Logo em SVG, PNG ou PDF?
6. Foto de palestra, reunião ou sala de aula?
7. Hospedagem e acesso (FTP ou painel)?

---

## 16. LEMBRETE FINAL

A régua é dupla e simultânea: **um jurado de Awwwards precisa parar no hero, e um dono de PME de R$ 2 milhões precisa entender em 5 segundos o que você faz e clicar no diagnóstico.** Quando estiver em dúvida entre impressionar e comunicar, escolha comunicar — mas encontre o jeito de fazer as duas coisas.
