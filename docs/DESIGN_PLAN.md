# VOLGUS — PLANO DE DESIGN
### Fase 1 · Escrito antes de qualquer linha de código · Aguarda aprovação

> Fonte de tudo que está aqui: `VOLGUS_BRIEFING.md` e `Volgus_-_MIV.pdf` (57 páginas, lidas na íntegra, incluindo os mockups das páginas 47 a 54).
> A seção 8 deste documento registra a autocrítica: cada decisão que "serviria para qualquer consultoria B2B" foi revisada e o que mudou está anotado.

---

## 0. Estado do reconhecimento (Fase 0)

### O que já está resolvido sem depender de ninguém

| Ativo | Situação |
|---|---|
| Manual de identidade (MIV) | Lido inteiro. Texto extraído, páginas renderizadas, fontes embutidas listadas. |
| Logo em vetor | **Extraído diretamente do PDF do MIV** (os logos são caminhos vetoriais nas páginas 42 e 43). Gerados: `logo-principal.svg` (v01), `logo-empilhado.svg` (v02), `simbolo-lime.svg` (v03), `favicon.svg` + `.ico` (v04, conforme o manual), mais variantes preto/branco e wordmark isolado. Tudo em `public/brand/`. |
| Patterns do MIV | Redesenhados como tiles SVG de 8 a 32 px em `public/brand/patterns/` (grid, dots, linhas-v, linhas-h). Usam `currentColor`, então servem em preto e em claro. |
| Fontes | O MIV embute Roc Grotesk, The Seasons e LTC Francis apenas como **subsets de PDF** (inutilizáveis e sem licença web). Rota B confirmada: Bricolage Grotesque, Gloock, Fraunces, Nothing You Could Do e Work Sans, todos disponíveis via npm (`@fontsource`), auto-hospedados como `.woff2`. Nenhum `<link>` externo. |
| Stack | `astro@5.18.2` (último 5.x), `@astrojs/react@4`, `tailwindcss@4` + `@tailwindcss/vite`, `gsap@3.15`, `lenis@1.3`. Tudo resolvendo no registro npm. |
| ffmpeg | Disponível no ambiente de build (binário estático). Os comandos de tratamento do vídeo estão prontos. |

### O que o usuário respondeu (Fase 0, aprovada)

| Pergunta | Resposta | Onde entrou |
|---|---|---|
| WhatsApp comercial | +55 15 99705-6889 | `SITE.whatsapp = '5515997056889'` |
| Instagram da marca | @volgusms | `SITE.instagramMarca` |
| Instagram pessoal | @vitorpleins | `SITE.instagramPessoal` |
| Agenda | Será Calendly, link depois | `SITE.agendaUrl = ''` — o perfil Verde cai no WhatsApp até o link existir |

### O que ainda depende do usuário (não bloqueia o site)

1. **As 4 fotos.** Chegaram como imagens coladas na conversa, não como arquivos. Os slots existem, com máscara e tratamento prontos: basta colocar os JPEG em `src/assets/photos/` com os nomes da seção 5 do `DEPLOY.md`. Enquanto não existirem, as seções renderizam sem foto e sem quebrar nada.
2. **Os vídeos.** Estão no Drive compartilhado, mas o ambiente de build não alcança `drive.google.com` (host negado pela política de rede da sessão, não por falta de permissão). O caminho está pronto: MP4 original em `public/video/_source/` e `bash scripts/prepare-media.sh` gera loop, webm e poster.
3. **O `Volgus.zip` do Drive.** Mesmo bloqueio. Ficou sem consequência: o logo foi recuperado em vetor do próprio MIV. O zip só importaria se trouxesse licença de webfont das fontes comerciais.

---

## 1. Sistema de tokens

### 1.1 Cores — a paleta do MIV, sem nenhum hex fora dela

```css
@theme {
  --color-preto:        #000000;   /* superfície institucional. Puro. Nunca #0B0B0B */
  --color-lime:         #BAFF00;   /* ação · verdade · marca. Bisturi, não tinta */
  --color-verde:        #68E80C;   /* só no gradiente lime→verde do MIV, se usado; nunca como texto */
  --color-branco:       #FFFFFF;   /* superfície clara de máximo contraste */
  --color-cinza-claro:  #F0F0F0;   /* superfície clara de respiro (a "página de método") */
  --color-cinza-escuro: #383838;   /* texto secundário sobre claro; superfície de transição sobre preto */

  /* derivados — só para linhas de interface */
  --color-linha:        rgb(255 255 255 / 0.12);
  --color-linha-clara:  rgb(0 0 0 / 0.12);
}
```

**Pares de contraste validados (WCAG):**

| Texto | Fundo | Razão | Uso |
|---|---|---|---|
| `#FFFFFF` | `#000000` | 21 : 1 | corpo em modo preto |
| `#000000` | `#F0F0F0` | 18,4 : 1 | corpo em modo claro |
| `#383838` | `#F0F0F0` | 9,6 : 1 | secundário em modo claro |
| `#BAFF00` | `#000000` | 17,6 : 1 | verdade/ação em modo preto |
| `#000000` | `#BAFF00` | 17,6 : 1 | botão primário, marquee, CTA final |
| `#BAFF00` | `#383838` | 8,9 : 1 | número em lime sobre a faixa cinza-escuro dos sintomas |
| `#BAFF00` | `#F0F0F0` | 1,2 : 1 | **PROIBIDO** — lime nunca sobre claro |

### 1.2 O orçamento de lime — 8 aparições, contadas

O prompt fixa o teto em 8 por scroll completo. Este é o mapa, e ele é o contrato:

| # | Onde | Papel |
|---|---|---|
| 1 | Nav — botão "Diagnóstico" | ação |
| 2 | Hero — traço caligráfico cruzando "previsibilidade" | marca/arte |
| 3 | Hero — botão "Fazer o diagnóstico" | ação |
| 4 | Sintomas — os três números de mercado (um cluster, uma aparição) | verdade |
| 5 | Tese — segundo traço caligráfico, atravessando a linha que divide CIÊNCIA e ARTE | marca/arte |
| 6 | Método — a régua de progresso que "preenche" as quatro etapas | ação/estrutura |
| 7 | Marquee — faixa lime pleno | marca |
| 8 | CTA final — **seção inteira em lime pleno**, com o terceiro traço e o botão em preto sobre lime | ação |

O rodapé pede "uma linha fina lime no topo": a borda inferior da seção lime **é** essa linha — não conta a mais. O símbolo do logo na nav é lime por definição de marca (versão 03) e é fixo, então é contado dentro do item 1 como "cluster nav". A seção Vitor **não** tem lime: os três números ficam em branco puro, o que os torna mais sóbrios e libera orçamento.

### 1.3 Tipografia — cinco arquivos, nenhum a mais

| Papel | Fonte | Arquivo (subset latin) | Eixos usados | Onde |
|---|---|---|---|---|
| `--font-display` | Bricolage Grotesque | variável, 1 arquivo | `wght` 200–800, `wdth` 75–100, `opsz` | hero, títulos H1/H2, letras M/E/T/A, número 404 |
| `--font-editorial` | Gloock | regular, 1 arquivo | — | Tese ("Venda é a interseção…"), abertura do bloco Vitor, veredito do fluxo |
| `--font-narrativa` | Fraunces **Italic** | variável, 1 arquivo | `wght`, `opsz`, `SOFT` | a voz do dono (traduções dos sintomas), "É falta de processo.", frases de fechamento |
| `--font-mao` | Nothing You Could Do | 1 arquivo **subsetado** para os glifos de "Vitor Pleins" | — | assinatura, uma vez |
| `--font-corpo` | Work Sans | variável, 1 arquivo | `wght` 300–700 | corpo, botões, rótulos, formulário |

Decisões que valem registrar:
- **Fraunces só em itálico.** O briefing usa Fraunces para "contar histórias" e na peça de social ela aparece itálica como a voz humana. Carregar o upright custaria um sexto arquivo. O upright, quando necessário, é Gloock.
- **Work Sans sem itálico.** Nenhum lugar do site precisa de sans itálica. Ênfase em corpo é peso, não inclinação.
- **Nothing You Could Do subsetada** (`pyftsubset`) para ~2 KB. Ela existe para uma única palavra.
- **Bricolage `opsz`**: em display usa-se `opsz` alto (glifos mais contrastados, mais "Roc Grotesk Heavy"); nos títulos menores, `opsz` baixo. Isso é o que impede a mesma fonte de parecer "a fonte do template".

### 1.4 Escala tipográfica (fluida, `clamp`)

```css
--text-mega:  clamp(3.5rem, 12vw, 11rem);      /* hero. Bricolage 800, wdth 80→100 no scroll, tracking -0.04em, leading 0.9 */
--text-h1:    clamp(2.5rem, 6.5vw, 6rem);      /* títulos de seção. leading 0.95 */
--text-h2:    clamp(1.875rem, 4vw, 3.5rem);    /* subtítulos, Gloock na tese. leading 1.05 */
--text-h3:    clamp(1.375rem, 2.2vw, 2rem);    /* sintomas, itens da lista "não é". leading 1.15 */
--text-corpo: clamp(1.0625rem, 1.15vw, 1.25rem); /* leading 1.6; em Fraunces 1.7; max 68ch */
--text-micro: 0.8125rem;                        /* microtexto de CTA, anotações da régua, rodapé */
--text-letra: clamp(8rem, 22vw, 20rem);         /* as letras M/E/T/A e o "404" — só aqui */
```

### 1.5 Espaçamento (base 8 px)

```
--space-1:  0.5rem     --space-6:  3rem      --space-12: 8rem
--space-2:  1rem       --space-8:  4rem      --space-16: 12rem
--space-3:  1.5rem     --space-10: 6rem      --space-secao: clamp(6rem, 12vw, 14rem)
--space-4:  2rem
```

O espaço entre seções é o mesmo em todo o site (`--space-secao`). O que varia é a **densidade interna**: as seções pretas são densas e apertadas (o caos), as claras são arejadas (a estrutura). Contraste de densidade é uma exigência do MIV ("use as cores com bastante contraste") levada ao layout.

### 1.6 Grid

12 colunas, `max-width: 1440px`, gutter `clamp(1.25rem, 4vw, 5rem)`. Três seções sangram até a borda: **Hero** (a foto), **Marquee** (a faixa) e **CTA final** (o lime pleno). O Método também sangra em desktop quando pinado.

---

## 2. O conceito — "Caligrafia e Arquitetura", tornado concreto

O MIV diz: *o V caligráfico é o contato humano; as letras sem serifa são a modernidade e o lado corporativo.* O fundador diz: *venda é a interseção entre ciência e arte.* É a mesma frase. O site é essa frase em página.

### 2.1 Camada ARQUITETURA — a régua

A ciência não é decorada com "grid ao fundo". Ela é **instrumento de medição visível**. A página inteira tem, na margem esquerda do container, uma **régua vertical de 1 px** que percorre todo o scroll, com marcações a cada 8 rem e o número da seção alinhado à marca onde a seção começa (`§ 03` em Work Sans 500, 13 px, rotacionado 90°). Não é eyebrow em cima de título: é anotação de planta baixa, na margem, como carimbo de engenharia. Em mobile a régua encolhe para uma linha na borda sem os rótulos.

Essa régua faz três coisas que nenhum site de consultoria faz:
1. Dá uma **espinha contínua** ao scroll longo — a página vira uma prancha, não uma pilha.
2. Na página `/diagnostico`, a **mesma régua vira a barra de progresso** (lime), horizontal no topo. Home e fluxo compartilham o mesmo instrumento.
3. Marca as **três posições onde o traço caligráfico acontece**: nesses pontos a régua se interrompe, como se a mão tivesse passado por cima.

Os quatro patterns do MIV entram como **material de superfície**, cada um com um papel fixo, nunca intercambiável:

| Pattern | Onde | Opacidade | Por quê |
|---|---|---|---|
| Grid | Hero e bloco CIÊNCIA da tese | 8% | planta baixa: o problema já visto sob a malha do método |
| Linhas horizontais | Sintomas (entre os itens da lista, como pauta de caderno) | 10% | é onde o dono "escreve" o que sente |
| Pontos | Método (a trilha por onde as etapas avançam) | 10% | pontos = marcações de passo |
| Linhas verticais | A Ordem (o diagrama ICP→FUNIL→SCRIPTS→CRM) | 12% | verticais = colunas de um pipeline |

### 2.2 Camada CALIGRAFIA — o traço, três vezes, e é o **símbolo real**

O traço não é "um rabisco lime". É o próprio símbolo do logo, extraído em vetor do MIV, revelado como se estivesse sendo desenhado. Técnica: o path preenchido do símbolo fica sob uma `<mask>` cujo conteúdo é um path de linha central com `stroke-width` grosso; anima-se `stroke-dashoffset` da máscara. O resultado é o glifo verdadeiro aparecendo na ordem em que uma mão o escreveria (laço, descida, subida, floreio). Duração 900 ms, easing `power2.inOut`, dispara uma vez ao entrar 40% na viewport.

As três aparições, cada uma com escala e papel diferentes:

| # | Onde | Escala | O que faz |
|---|---|---|---|
| 1 | Hero | ~1,4× a altura da linha | Atravessa a palavra **previsibilidade**, como quem sublinha à mão o diagnóstico. Desenha por último na sequência de entrada. |
| 2 | Tese | ~40% da altura da seção, em preto sobre `#F0F0F0` | Cruza a linha vertical que separa CIÊNCIA de ARTE — a arte invadindo a coluna da ciência. É o único momento em que o símbolo aparece em preto. |
| 3 | CTA final | Gigante, cortado pela borda, preto sobre lime | Reproduz literalmente a página 47 do MIV (o V cortado em preto sobre lime). Ancoragem direta no manual. |

Onde o traço passa, a régua se interrompe. Onde tudo é grade, o traço interrompe. Esse é o único "efeito" do site, e por isso ele pesa.

### 2.3 A transição de modo — a narrativa é a cor de fundo

| Trecho | Superfície | Significado |
|---|---|---|
| Hero → Sintomas | `#000000` → `#383838` (a faixa dos números) | o problema, dito sem enfeite |
| Tese | `#F0F0F0` | a virada: o dono entende o que falta |
| Método → Ordem | `#F0F0F0` → `#FFFFFF` | a estrutura, cada vez mais clara |
| Não somos → Vitor | `#000000` | volta ao preto: franqueza, e o rosto de quem fala |
| Marquee | `#BAFF00` | a síntese |
| Para quem | `#F0F0F0` | o filtro, com calma |
| CTA final | `#BAFF00` | a ação |
| Rodapé | `#000000` | fecha como abriu |

O `<body>` tem `data-mode="preto|claro|lime"` atualizado por ScrollTrigger e `background-color`/`color` interpolados com `scrub: 0.4` na zona de 30 vh entre seções. Os componentes só usam `currentColor` e `var(--surface)` — nada de cor fixa por seção — para que a interpolação seja global e sem costura. O logo da nav usa `mix-blend-mode: difference` (branco sobre preto = branco; branco sobre `#F0F0F0` = quase preto). O botão da nav **não** usa blend (lime em difference sobre claro vira roxo): ele lê `data-mode` e troca entre lime/preto e preto/lime.

### 2.4 Onde a ousadia é gasta — e onde não é

**Gasto:** o hero. Bricolage Grotesque tem eixo de largura. O título entra em `wdth 80` (condensado, próximo ao "Roc Grotesk Condensed Black" que o MIV mostra na página 19) e **abre até `wdth 100`** nos primeiros 60 vh de scroll — a frase literalmente se expande à medida que o leitor desce. Custa uma propriedade por frame num único elemento; em mobile e em `reduced-motion` fica estático em `wdth 90`. Esse é o comportamento Compressed→Wide do manual, vivo.

**Não gasto:** todo o resto fica quieto. Sem fade-and-slide-up por seção. As seções entram cortadas — o texto simplesmente está lá quando você chega, como numa revista. O único movimento fora do hero é: a régua se preenchendo, o traço se desenhando (3×), a cor de fundo mudando e o método avançando.

### 2.5 Acabamento

- **Cursor** (desktop, `pointer: fine` apenas): círculo de 8 px em `difference`; sobre interativos cresce a 40 px e vira lime com o rótulo `→` interno em preto. Sobre o marquee vira `⏸`.
- `::selection` lime/preto. Foco: `outline: 2px solid #BAFF00; outline-offset: 4px` — em modo claro o offset ganha um segundo anel preto (`box-shadow`) para o lime não flutuar sobre `#F0F0F0`.
- Scrollbar: 6 px, `#383838`, sem track visível.
- **Botões**: pílula, como as da página 27 e 49 do MIV ("BOTÃO" com o círculo-seta à esquerda). O primário tem o círculo lime com seta preta **dentro** do círculo, à esquerda — não seta solta depois do texto. O hover troca fundo (preto↔lime) sem escala nem elevação.
- **Círculos tipográficos** (MIV p. 35: `fav`, `?!`, `ss`): usados exatamente uma vez, como marcadores das quatro etapas do método em mobile (`M`, `E`, `T`, `A` dentro de círculos lime/preto/branco). Em desktop as letras são gigantes e não precisam do círculo.

---

## 3. Home — seção a seção, com wireframes

Legenda dos wireframes: `█` superfície preta · `░` superfície clara · `▓` lime · `│` régua · `~` traço caligráfico · `▒` foto.

### 6.1 Nav

```
┌──────────────────────────────────────────────────────────────────┐
│ ⟋V              Sintomas   Método   Para quem       [● Diagnóstico] │  ← 64px, fica 48px ao rolar
└──────────────────────────────────────────────────────────────────┘
mobile: │ ⟋V                                           [Diagnóstico] │
```
Fundo transparente sempre; sem blur, sem borda. O logo em `difference`. As âncoras somem abaixo de 1024 px.

### 6.2 Hero — preto, sangra

```
█████████████████████████████████████████████████████████████████████
█│                                                        ▒▒▒▒▒▒▒▒▒█
█│ §01                                                 ▒▒▒▒▒▒▒▒▒▒▒▒█
█│                                                   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒█
█│  VOCÊ NÃO TEM                                   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█
█│  PROBLEMA DE VENDA.                            ▒▒▒▒ (P&B, mão   █
█│  VOCÊ TEM PROBLEMA                            ▒▒▒▒▒  no queixo) █
█│  DE PREVISIBILIDADE.                         ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒█
█│         ~~~~~~~~~~~~~~~ (traço 1 cruza "previsibilidade")  ▒▒▒▒█
█│                                                                  █
█│  A VOLGUS entra no comercial da sua empresa e constrói           █
█│  a estrutura que faz a venda acontecer sem depender de você.     █
█│                                                                  █
█│  [● Fazer o diagnóstico]     Entender como funciona              █
█│   2 minutos · sem compromisso · resposta na hora                 █
█│                                                          grid 8% █
█████████████████████████████████████████████████████████████████████
```
- Título em Bricolage 800, `wdth` 80→100 no scroll, caixa alta, 4 linhas em desktop (a frase tem duas sentenças; cada uma quebra em duas), leading 0.9, ocupando 8 das 12 colunas.
- A foto P&B (mão no queixo) entra pela direita, sangrando, com **máscara radial + levels** que empurram o cinza do estúdio para `#000`, então a foto "nasce" do preto sem recorte visível. Em mobile, a foto vai para baixo do título, altura 60 vh, com o mesmo tratamento.
- Entrada (≤ 1,2 s): linhas do título revelam por `clip-path` vertical, stagger 80 ms (4 linhas = 320 ms + 500 ms de duração); subtítulo e CTAs em opacidade 150 ms; traço desenha por último (900 ms, sobreposto). Total 1,2 s.
- O microtexto usa `·` como separador — **exceção deliberada** à regra do ponto médio, porque aqui é copy fixada pelo prompt. Em todo o resto do site não há ponto médio.

### 6.3 Sintomas — preto, termina em `#383838`

```
█│ §02                                                              █
█│  NÃO É FALTA DE PRODUTO.                                         █
█│  NÃO É FALTA DE MERCADO.                                         █
█│  É falta de processo.            ← Fraunces itálico, h2          █
█│                                                                  █
█│  ─────────────────────────────────────────────────────── (pauta) █
█│  Nenhum funil documentado        "Não sei em qual etapa          █
█│                                   eu perco a venda"              █
█│  ─────────────────────────────────────────────────────────────── █
█│  Pipeline invisível              "Não consigo prever o que       █
█│                                   vou faturar mês que vem"       █
█│  ─────────────────────────────────────────────────────────────── █
█│  ... (5 itens: sintoma em Bricolage h3 / tradução em Fraunces)   █
█│                                                                  █
█│  O PREÇO DO IMPROVISO É MAIS ALTO DO QUE VOCÊ IMAGINA.           █
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ (faixa #383838, não lime) ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
  74%                    68%                    58%    ← lime, display
  das PMEs não têm       dos donos dizem que    dos leads pagos
  processo comercial     vendas é o principal   nunca são
  estruturado            gargalo                respondidos
```
- Lista, não cards. Duas colunas (5/7) em desktop; empilhado em mobile com a tradução recuada.
- O pattern de linhas horizontais aparece **só entre os itens**, como pauta.
- A faixa `#383838` é a ponte para o claro que vem a seguir: o preto já começou a ceder.

### 6.4 Tese — a virada para `#F0F0F0`

```
░│ §03                                                              ░
░│                                                                  ░
░│              Venda é a interseção entre                          ░
░│                    ciência e arte.          ← Gloock, h1, centro ░
░│                                                                  ░
░│  CIÊNCIA                    │                 ARTE               ░
░│  grid 8% ao fundo           │                                    ░
░│  ICP. Funil. CRM. Scripts.  │   Escuta. Empatia. Leitura         ░
░│  Cadência. Indicadores.     ~~~~~~~ (traço 2, preto, cruza)      ░
░│  Rotina.                    │   de contexto. Timing. A conversa  ░
░│                             │   que abre a porta.                ░
░│  O que pode ser documentado,│                                    ░
░│  repetido, medido e ensinado│   O que não cabe em planilha.      ░
░│                             │                                    ░
░│  Quem vende ferramenta entrega ciência sem arte. Quem vende      ░
░│  motivação entrega arte sem ciência. A VOLGUS entrega os dois —  ░
░│  e é por isso que o processo sobrevive quando o dono sai da sala.░
```
- A linha vertical central **se desenha no scroll** (scaleY 0→1). O traço 2 a atravessa.
- CIÊNCIA em Work Sans 500 com o grid por trás; ARTE em Fraunces itálico, sem pattern. A diferença de fonte **é** o argumento.

### 6.5 Método M.E.T.A. — claro, pin em desktop

```
░│ §04   MÉTODO TEM NOME.                                           ░
░│                                                                  ░
░│  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░ ← régua lime preenche     ░
░│  M              E              T              A                  ░
░│                                                                  ░
░│  ██  ██                                                          ░
░│  ███ ███   MAPEAR                                                ░
░│  ██ █ ██   Entender onde a empresa está. Diagnóstico 360º do     ░
░│  ██   ██   pré ao pós-venda, análise de canais, funis,           ░
░│  ██   ██   comportamento e rotina. Leitura real dos gargalos,    ░
░│            não achismo.                                          ░
░│                                       (pontos 10% na trilha)     ░
```
- Desktop: seção pinada por 300 vh; a cada 25% o painel troca (letra gigante à esquerda em Bricolage 800 `opsz` máximo, texto à direita), a régua lime preenche. Numeração `01–04` aqui é legítima: é sequência.
- Mobile / reduced-motion / aparelho fraco (`navigator.hardwareConcurrency <= 4` ou `deviceMemory <= 4`): sem pin; quatro blocos empilhados, letra em círculo tipográfico (MIV p. 35).

### 6.6 A Ordem — branco `#FFFFFF`, curta

```
░│ §05                                                              ░
░│  A MAIORIA COMPRA A FERRAMENTA PRIMEIRO.                         ░
░│  POR ISSO A FERRAMENTA NÃO FUNCIONA.                             ░
░│                                                                  ░
░│  ┌─────┐      ┌───────┐      ┌─────────┐      ┌─────┐            ░
░│  │ ICP │──────│ FUNIL │──────│ SCRIPTS │──────│ CRM │            ░
░│  └─────┘      └───────┘      └─────────┘      └─────┘            ░
░│   linhas-v 12% dentro de cada caixa; a seta se desenha no scroll ░
░│                                                                  ░
░│  A VOLGUS nunca vende CRM. Instala o processo que torna          ░
░│  o CRM útil.                                                     ░
```
- O diagrama é um SVG único. As caixas são retângulos de 1 px com o pattern de linhas verticais; a última (CRM) fica **tracejada** — é a que a maioria compra primeiro e fica vazia.

### 6.7 O que a VOLGUS não é — preto

```
█│ §06   O QUE A GENTE NÃO FAZ.                                     █
█│                                                                  █
█│  Não é curso.                    Você não assiste aula, você     █
█│                                  constrói a operação.            █
█│  Não é palestra motivacional.    Ninguém sai animado e volta     █
█│                                  igual na segunda-feira.         █
█│  ... (5 linhas, sem régua entre elas — texto seco)               █
█│                                                                  █
█│  A gente entra na sua operação como diretor comercial: desenha   █
█│  o sistema, executa junto com o seu time e acompanha a evolução  █
█│  até rodar sozinho.                                              █
```
- Sem pattern, sem linha, sem traço. A seção mais nua do site — o vazio é a diferenciação.
- A foto "braços cruzados" **não** entra aqui (sem foto = mais seco). Ela vai para o Método, em duotone, apenas se as fotos chegarem e o teste visual aprovar; senão não entra em lugar nenhum.

### 6.8 Vitor — preto, editorial

```
█│ §07                                                              █
█│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  De vendedor para vendedor.                 █
█│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  De quem viveu o caos e venceu              █
█│  ▒▒ (sorrindo,   ▒▒▒  com estrutura.        ← Gloock, h2         █
█│  ▒▒  sentado)    ▒▒▒                                             █
█│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  Mais de 7 anos em vendas, B2C e B2B, no    █
█│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  Brasil e na Europa. Já estruturei ...      █
█│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                                             █
█│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  7+ anos      R$ 2,1 mi      10+ setores    █
█│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒  em vendas    em 9 meses     atendidos      █
█│                        Vitor Pleins  ← manuscrita, pequena       █
```
- Foto ocupa 7 colunas, altura total da seção, P&B, mesmo tratamento de levels do hero. Texto em primeira pessoa, 5 colunas, muito ar.
- Os números em branco puro, Bricolage 600, sem ícone, sem lime.

### 6.9 Marquee — lime, sangra, 96 px

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓ Vender uma vez é sorte. Vender todo mês é sistema.   ⟋V   Venda não é feeling. É método.   ⟋V   Seu negócio n
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```
- Separador entre frases: o **símbolo em preto** (não ponto médio). Texto em Bricolage 600 `wdth` 100, preto. 40 s por volta, pausa no hover, `reduced-motion` = lista estática de 5 linhas.

### 6.10 Para quem é — `#F0F0F0`

```
░│ §08                                                              ░
░│  Faz sentido conversar se:      │  Não faz sentido agora se:     ░
░│                                 │                                ░
░│  Sua empresa fatura entre       │  Você ainda está validando     ░
░│  R$ 800 mil e R$ 8 milhões      │  o produto ou o mercado        ░
░│  por ano                        │                                ░
░│  ...                            │  ...                           ░
░│                                 │                                ░
░│  Se você está no segundo grupo, tudo bem. O diagnóstico vai te   ░
░│  dizer isso em dois minutos, sem custo e sem conversa de vendas. ░
```
- Duas colunas separadas por uma régua vertical de 1 px. Sem ícones. A coluna "não" em `#383838`, a coluna "sim" em preto — a diferença de tom é o único sinal.

### 6.11 CTA final — lime pleno, sangra

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓│ §09                                          ██                  ▓
▓│                                            ████ ███              ▓
▓│  VAMOS ORGANIZAR                          ██  ██████             ▓
▓│  O SEU COMERCIAL?                        ██    ██ ██   (traço 3, ▓
▓│                                          ██   ██   ██   preto,   ▓
▓│  Comece pelo diagnóstico. São 8           ██████  ██   gigante,  ▓
▓│  perguntas, dois minutos, e você             ██  ██    cortado)  ▓
▓│  recebe na hora uma leitura do estágio        ████               ▓
▓│  em que a sua operação comercial está.                           ▓
▓│                                                                  ▓
▓│  [● Fazer o diagnóstico]  ← preto sobre lime                     ▓
▓│  Sem pressão. Sem firula. Só uma conversa honesta para te        ▓
▓│  ajudar a vender mais sem perder o controle.                     ▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```
- Decisão: **lime pleno**, não preto. Motivos: (1) é a página 47 do MIV literal; (2) fecha o arco preto→claro→lime = problema→método→ação; (3) consome uma única aparição de lime para a seção inteira, o que mantém o orçamento em 8.

### 6.12 Rodapé — preto

```
█████████████████████████████████████████████████████████████████████
█  ⟋VOLGUS          Maringá, PR                                      █
█                   vitor@volgus.com.br      Instagram               █
█                   WhatsApp                 Política de privacidade █
█                                                            © 2026  █
█████████████████████████████████████████████████████████████████████
```

---

## 4. `/diagnostico` — o fluxo

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ← régua/progresso, 2px, lime
█  ⟋V                                                                █
█                                                                    █
█   3 / 8                                                            █
█   Qual o faturamento anual                                         █
█   da empresa hoje?                    ← Bricolage h1               █
█                                                                    █
█   [1]  Até R$ 500 mil                                              █
█   [2]  R$ 500 mil a R$ 800 mil                                     █
█   [3]  R$ 800 mil a R$ 3 milhões                                   █
█   [4]  R$ 3 milhões a R$ 8 milhões                                 █
█   [5]  Acima de R$ 8 milhões                                       █
█                                                                    █
█   ← voltar                                          Enter ↵ avança █
█████████████████████████████████████████████████████████████████████
```
- Superfície preta sempre (o diagnóstico é a fase do problema). O veredito vira **claro** quando é Verde/Amarelo (a saída) e permanece preto quando é Vermelho (honestidade sem venda).
- As opções são linhas com o número em um quadrado de 1 px à esquerda — o atalho de teclado é visível, não escondido. Tocar/selecionar preenche o quadrado de lime (o único lime além da régua).
- Tela de veredito: estágio em `--text-letra` (o número), nome em Gloock, régua de 4 posições onde o marcador se move até a posição (a mesma linguagem da régua da home), três frases lidas das respostas, o próximo passo.
- Estado em `sessionStorage`; UTMs capturadas na primeira carga; `aria-live="polite"` no container da pergunta.

---

## 5. 404

Preto. `404` em `--text-letra`, Bricolage 800 `wdth` 75. Abaixo, em Fraunces itálico: *"Não é falta de conteúdo. É falta de endereço."* (derivado da frase-síntese). Botão: **Voltar para o início**. Só isso.

---

## 6. Princípios — o que torna esta página não confundível

1. **A régua.** Uma linha de medição que atravessa o site inteiro, numerada na margem, e que vira a barra de progresso do diagnóstico. Página e fluxo são o mesmo instrumento.
2. **O traço é o logo de verdade.** Não é ilustração de "traço manuscrito": é o símbolo do MIV, em vetor, sendo escrito. Três vezes. Nunca mais.
3. **A cor de fundo conta a história.** Preto é problema, claro é método, lime é ação. O leitor sente a virada sem ler.
4. **A fonte se abre.** O hero começa comprimido e expande no scroll. Nenhum site de consultoria brasileira faz isso, e é exatamente o eixo Compressed→Wide do manual.
5. **Lime como bisturi.** Oito aparições, mapeadas e contadas. O Vitor não tem lime. A seção "não somos" não tem nada.
6. **Densidade como contraste.** Preto é apertado, claro é arejado. Mesmo espaço entre seções, densidade oposta dentro delas.
7. **As duas fontes são o argumento.** Onde a página diz "ciência", o texto é sans. Onde diz "arte", é Fraunces itálico. O leitor vê a tese antes de lê-la.

---

## 7. Decisões técnicas que afetam o design

| Tema | Decisão |
|---|---|
| Astro | `5.18.2`, o último 5.x, como pede a stack "exata". (Astro 7 existe; a saída estática é idêntica. Se preferir a versão atual, é uma troca de 10 minutos e eu faço antes da Fase 2.) |
| Fontes | `@fontsource-variable/*` copiadas para `public/fonts/` como `.woff2`, subsetadas para latin; 5 arquivos; `font-display: swap` com `size-adjust` calibrado para zero CLS. |
| Fotos | Processadas em build (`sharp`): P&B, levels para fundir o cinza do estúdio ao `#000`, AVIF + WebP, 4 larguras. A foto dos tijolos entra **apenas** se, dessaturada, passar no teste visual; caso contrário fica fora. |
| Pin do Método | Ligado só quando `matchMedia('(min-width: 1024px)')`, `pointer: fine`, sem `reduced-motion` e `hardwareConcurrency > 4`. Fora disso, revelação sequencial simples. |
| Cursor | Só em `(hover: hover) and (pointer: fine)`. |
| Lenis | `lerp: 0.085`; desligado em `reduced-motion` e em touch (scroll nativo é melhor no celular). |
| Tracking | Nenhum script carrega enquanto `metaPixelId` e `ga4Id` estiverem vazios. Sem banner. |
| Vídeo | Loop de 6 s como fundo da seção **A Ordem** (é a seção mais curta e "técnica", onde um lettering em movimento faz sentido), `preload="none"`, poster. Sem arquivo → poster + `TODO`. |

---

## 8. Autocrítica — "isso é VOLGUS ou é qualquer consultoria B2B?"

O que estava no primeiro rascunho, foi reprovado nesse teste e mudou:

| Rascunho (genérico) | Por que reprovou | O que ficou (VOLGUS) |
|---|---|---|
| "Grid pattern sutil no fundo das seções escuras" | Qualquer landing tech faz isso | Cada um dos **quatro** patterns do MIV tem um papel fixo e nomeado (planta, pauta, passo, pipeline). Não se repetem. |
| Traço caligráfico como um rabisco lime desenhado à mão livre em SVG | Seria decoração, não marca | O traço é o **símbolo real do logo**, extraído em vetor do PDF, revelado como escrita. |
| Números do bloco Vitor em lime | "Seção de estatísticas" padrão | Vitor sem lime. Os números em branco, sem ícone. O lime economizado foi para a seção do CTA final inteira. |
| CTA final em preto com botão lime | O mesmo hero de novo | Lime pleno, com o V gigante cortado — é a página 47 do MIV. Fecha o arco de cores. |
| Botão com seta `→` depois do texto | Está na lista do "não fazer" e é o botão de todo site | Pílula com **círculo-seta à esquerda**, como o MIV desenha na página 27 e 49. |
| Marquee separando frases com `·` | Ponto médio é tell | Separador é o símbolo em preto. |
| Seções entrando com fade-and-slide-up | Lista do "não fazer" | Nada entra animado além do hero. As seções simplesmente estão lá. |
| Um "eyebrow" `SINTOMAS` em caps sobre cada título | Lista do "não fazer" | A numeração vai para a **régua da margem**, rotacionada, como carimbo de planta. Nunca acima do título. |
| Nav com fundo blur ao rolar | Glassmorphism, tell | Transparente sempre; o logo se inverte por `difference`. |
| Fraunces upright + italic + Work Sans italic | Passaria de 5 arquivos e nenhum papel exige | Fraunces só itálico; Work Sans só upright. Upright serifado é Gloock. |
| Círculos tipográficos (`fav`, `?!`) como "ícones de diferenciais" | Viraria seção de ícones | Usados uma vez, só em mobile, como marcadores de M/E/T/A. |
| Foto dos tijolos no hero em duotone lime | O laranja briga com o lime e o briefing avisa | Fora do hero. Só entra em P&B se passar em teste visual; provavelmente não entra. |

O que **não** mudou depois do teste, porque já era VOLGUS de origem: a tese com as duas fontes como argumento; a alternância preto/claro como narrativa; o hero tipográfico com o eixo de largura; o filtro honesto sem ícones de ✓/✗.

---

## 9. Pendências — respostas necessárias antes da Fase 5 (o fluxo) e da Fase 6

Nenhuma delas bloqueia a Fase 2 (fundação) nem a Fase 3 (home). Os valores ficam em `src/config/site.ts` e são trocados em um lugar só.

| # | Pergunta | Se não responder, o que acontece |
|---|---|---|
| 1 | Qual o número de WhatsApp comercial, com DDD? | O placeholder `5515997056889` do prompt fica marcado como `CONFIRMAR` e o botão abre esse número. |
| 2 | Qual o handle exato do Instagram da VOLGUS? | O rodapé mostra só o Instagram pessoal `@vitorpleins`. |
| 3 | Já existe link de agenda (Cal.com ou Calendly)? | O perfil Verde vai para WhatsApp com mensagem pré-preenchida. Sem quebra de layout. |
| 4 | O `Volgus.zip` contém arquivos de fonte (`.otf/.woff2`) de Roc Grotesk, The Seasons ou LTC Francis **com licença de webfont**? | Sigo com os substitutos livres (Bricolage, Gloock, Nothing You Could Do). Se a licença existir, é só colocar os `.woff2` em `public/fonts/` e trocar 3 linhas. |
| 5 | Logo em SVG? | **Resolvido**: extraído em vetor do próprio MIV. Se o zip tiver um SVG "oficial", substitui os meus sem mudar nada no código. |
| 6 | Tem foto de palestra, reunião ou sala de aula? | O bloco Vitor usa só o retrato de estúdio, que já é forte. |
| 7 | Qual hospedagem, e o acesso é FTP ou painel? | O `DEPLOY.md` sai genérico (FTP + painel cPanel/Hostinger/Locaweb), com nota sobre `.htaccess` para a 404 e cache das fontes. |
| 8 | **As 4 fotos como arquivo** (`.jpg`) em `public/photos/` ou anexadas na conversa. | Hero e Vitor sobem com a máscara e o espaço reservados; a página funciona, mas sem rosto. |
| 9 | **O vídeo**: um dos MP4 originais em `public/video/_source/`, ou pode ficar como poster + `TODO`? | Poster estático + `TODO` no `DEPLOY.md`. |

---

*Fim do plano. A Fase 2 começa quando este documento for aprovado — ou com as correções que você pedir.*


---

## 10. O que mudou da aprovação para a execução

Registro honesto das decisões que divergiram do plano aprovado, e por quê.

| Item do plano | O que foi construído | Motivo |
|---|---|---|
| Nav inverte com `mix-blend-mode: difference` | A nav lê a cor de tinta atual da superfície (`var(--ink)`) | Um `<header>` fixo com `z-index` é o próprio contexto de empilhamento: o `difference` não tinha fundo contra o que operar e o logo sumia nas seções claras. A troca é determinística e mede 17,4:1 no pior caso (seção lime) — verificado seção a seção. |
| Entrada do hero orquestrada em GSAP | A revelação das quatro linhas é CSS puro; o GSAP só desenha o traço | O hero é o elemento de LCP. Em CSS ele começa na primeira pintura, sem esperar o chunk de 138 KB do GSAP. O chunk passou a carregar em `requestIdleCallback`, e o Speed Index caiu de 3,1 s para 1,8 s. |
| Traço revelado por máscara desde o início | A máscara só é aplicada quando a animação começa, e é removida no fim | Se um gatilho de scroll falhasse, o símbolo ficava invisível. Agora o pior caso é "não animou, mas está lá". |
| Símbolo inline em cada ocorrência | Um sprite `<symbol>` por página, com `<use>` em cada ocorrência | O marquee repete o símbolo 10 vezes. Inline, o HTML da home tinha 110 KB; com sprite, 83 KB. |
| Rodapé com o símbolo em lime | Símbolo do rodapé em branco | Mantém o orçamento de lime em 7 de 8 e deixa o rodapé monocromático, como o plano pede. |
| Seções pintadas só pelo tween do `<body>` | As três seções que pintam o próprio fundo (faixa de dados, marquee e CTA) declaram também a própria tinta | Elas herdavam a tinta do body a meio da transição e podiam mostrar texto claro sobre lime. Era o único defeito real de contraste encontrado. |
| Bricolage Grotesque variável completa | Eixo `opsz` fixado em 96, `wght` e `wdth` preservados | 121 KB → 71 KB sem perder o comportamento Compressed→Wide, que é o efeito do hero. |

### Verificação final (medida, não estimada)

Servido como a hospedagem vai servir: pasta `dist/` estática com o gzip que o `.htaccess` liga.

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | Peso |
|---|---|---|---|---|---|---|---|
| Home | 98 | 100 | 100 | 100 | 2,3 s | 0 | 246 KiB |
| /diagnostico | 99 | 100 | 100 | 100 | 2,1 s | 0 | 208 KiB |
| /privacidade | 100 | 100 | 100 | 100 | 1,7 s | 0,007 | 179 KiB |

Metas do briefing: Performance ≥ 92 ✓ · Acessibilidade 100 ✓ · Boas práticas ≥ 95 ✓ · SEO 100 ✓ · CLS < 0,05 ✓ · peso da home < 900 KB ✓.

**A única meta não atingida é o LCP < 1,8 s: a home mede 2,3 s.** O caminho crítico é a fonte de display (71 KB, já reduzida pela metade), que o título do hero precisa para pintar. Baixar disso exigiria `font-display: optional` (o primeiro acesso veria a fonte de sistema) ou abandonar o eixo de largura variável, que é o efeito do hero e vem do próprio manual. Ficou como está, e fica registrado.

### Checklist de aceite — resultado

108 de 108 verificações automáticas passaram (`node scripts/qa.mjs`), cobrindo:

- Sem overflow horizontal e sem sobreposição de seções em 1920, 1440, 1280, 1024, 768, 430 e 390 px, nas quatro páginas
- Zero erro de console em todas as combinações
- Lime aparece 7 vezes no scroll completo (teto 8), traço caligráfico exatamente 3 vezes
- Contraste WCAG AA em todo texto, com cada seção medida enquanto está de fato na tela
- Um único `<h1>` por página, hierarquia de heading sem pulo, landmarks presentes
- Primeiro Tab revela o link de pular conteúdo, foco com anel lime visível
- Fluxo: autofoco por tela, Esc volta, `aria-live` na troca, todo campo com `<label>`
- Todos os links do rodapé, a 404 em rota inexistente, OG, favicon, robots e sitemap

Fluxo testado ponta a ponta nos três perfis (`node scripts/funnel-test.mjs`): Verde → estágio 4 Sistema, Amarelo → estágio 2 Esforço, Vermelho → estágio 1 Improviso, com UTM presente na mensagem, respostas preservadas ao voltar e progresso mantido após refresh.
