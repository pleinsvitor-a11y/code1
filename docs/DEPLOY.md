# Como colocar o site no ar

Há três caminhos. O **1** já está pronto e só depende de um clique seu. O **2** é o mais rápido se você já tem hospedagem. O **3** é o destino final, com o volgus.com.br.

---

## 1. GitHub Pages — um clique, hospedagem grátis e permanente

O site já está publicado no branch `gh-pages` do repositório. Falta só ligar o Pages:

1. Abra https://github.com/pleinsvitor-a11y/code1/settings/pages
2. Em **Source**, escolha **Deploy from a branch**
3. Em **Branch**, escolha **gh-pages** e a pasta **/ (root)**
4. Clique em **Save**

Em 1 a 3 minutos o site fica no ar em:

    https://pleinsvitor-a11y.github.io/code1/

Essa cópia está marcada como `noindex` de propósito: ela não aparece no Google, para não competir com o volgus.com.br quando ele entrar. Serve para você ver, testar e mandar o link para quem quiser.

**Para atualizar essa cópia depois de mudar alguma coisa:**

```bash
PUBLIC_SITE_DOMAIN="https://pleinsvitor-a11y.github.io/code1" npm run build:pages
```

e suba o conteúdo de `dist/` para o branch `gh-pages`.

---

## 2. Sua hospedagem, por FTP ou painel

Na raiz do projeto existe o arquivo **`volgus-site.zip`**: é o site inteiro, pronto, com os caminhos certos para rodar na raiz de um domínio.

**Por painel (cPanel, Hostinger, Locaweb, HostGator):** entre no "Gerenciador de arquivos", abra a pasta pública (`public_html`, `www` ou `htdocs`), apague o que estiver lá, envie o `volgus-site.zip` e use "Extrair". Confira que o `.htaccess` ficou lá dentro.

**Por FTP (FileZilla):** conecte com host, usuário e senha da hospedagem, abra a pasta pública, apague o conteúdo antigo, e arraste para lá **tudo que está dentro** da pasta `dist/` (não a pasta em si). No FileZilla, marque "Servidor → Forçar exibição de arquivos ocultos" para o `.htaccess` subir junto.

**Sem hospedagem ainda?** Você pode arrastar a pasta `dist/` em https://app.netlify.com/drop e ganhar um endereço no ar na hora, sem criar conta. Depois dá para apontar o domínio por lá.

Para gerar a pasta de novo depois de qualquer mudança:

```bash
npm install     # só na primeira vez
npm run build   # gera dist/
```

Para conferir antes de subir, rode `node scripts/serve.mjs` e abra `http://localhost:4330`. Esse comando serve só a pasta `dist/`, igual a hospedagem vai fazer.

---

## 3. Apontar o volgus.com.br

**Se for usar a sua hospedagem** (caminho 2): na hospedagem, copie os dois servidores DNS (algo como `ns1.hospedagem.com.br`). No Registro.br, entre no domínio, vá em "Alterar servidores DNS" e cole os dois. Leva de 2 a 24 horas.

**Se for usar o GitHub Pages** (caminho 1): em Settings → Pages → Custom domain, escreva `www.volgus.com.br` e salve. No Registro.br, crie um registro **CNAME** de `www` apontando para `pleinsvitor-a11y.github.io`. Marque "Enforce HTTPS" depois que o GitHub validar. **Atenção:** com domínio próprio o site passa a ser servido na raiz, então gere a pasta com `npm run build` (caminho 2), não com `build:pages`, e tire o `noindex` do `scripts/rebase-paths.mjs` do caminho.

Nos dois casos, ative o **HTTPS** (as hospedagens chamam de "SSL grátis" ou "Let's Encrypt") e peça para `volgus.com.br` redirecionar para `www.volgus.com.br`, ou o contrário.

---

## 4. Trocar textos e valores que mudam

Tudo que você vai querer trocar está em **um único arquivo**: `src/config/site.ts`.

| Campo | O que é | Valor atual |
|---|---|---|
| `whatsapp` | Número que recebe o diagnóstico, só dígitos, com 55 | `5515997056889` |
| `email` | E-mail do rodapé e do `mailto` de resgate | `vitor@volgus.com.br` |
| `instagramMarca` / `instagramMarcaHandle` | Instagram da VOLGUS | `@volgusms` |
| `instagramPessoal` / `instagramPessoalHandle` | Instagram pessoal | `@vitorpleins` |
| `agendaUrl` | Link do Calendly. Vazio = o perfil Verde vai para o WhatsApp | vazio |
| `webhookUrl` | Endereço opcional que recebe uma cópia do diagnóstico em JSON (Formspree, n8n, Make, Zapier) | vazio |
| `metaPixelId` / `ga4Id` | IDs de medição. **Vazios = nada carrega e nenhum aviso de cookies aparece** | vazios |

Depois de trocar, rode `npm run build` de novo e suba a pasta `dist/` de novo.

### Calendly

Quando o link existir, cole em `agendaUrl` no formato `https://calendly.com/seu-usuario/diagnostico`. Ele aparece embutido na tela final do perfil Verde. Dica: no Calendly, em "Compartilhar → Incorporar", pegue só a URL, não o código.

---

## 5. Fotos

As quatro fotos vão em `src/assets/photos/`, com estes nomes exatos:

| Arquivo | Foto | Onde aparece |
|---|---|---|
| `hero-mao-no-queixo.jpg` | retrato P&B, mão no queixo, sorrindo | topo da home |
| `vitor-sentado.jpg` | sorrindo, sentado, mãos entrelaçadas | seção "De vendedor para vendedor" |
| `vitor-bracos-cruzados.jpg` | sério, braços cruzados | reservada, não usada hoje |
| `vitor-tijolos.jpg` | camisa branca, parede de tijolos | não usada: o laranja briga com o lime |

O site converte automaticamente para AVIF e WebP em quatro tamanhos no `npm run build`. Enquanto o arquivo não existir, a seção aparece sem foto e sem quebrar nada.

---

## 6. Vídeo

O site está preparado para um loop curto de 6 segundos, sem áudio, na seção "A Ordem". **Nunca suba o MP4 original de 47 MB.**

1. Coloque um dos originais em `public/video/_source/` (crie a pasta; ela não vai para o site). Detalhes em `docs/VIDEO.md`.
2. Rode `bash scripts/prepare-media.sh "public/video/_source/nome-do-arquivo.mp4"`. Precisa do ffmpeg; se não tiver, `pip install imageio-ffmpeg` resolve.
3. Isso cria `public/video/loop.mp4`, `loop.webm` e `poster.jpg`. Rode `npm run build` e a seção passa a mostrar o vídeo.

---

## 7. Pendências (TODO)

| Item | Onde | O que falta |
|---|---|---|
| Ligar o Pages | Settings → Pages | O clique da seção 1 (só você tem acesso) |
| Fotos | `src/assets/photos/` | Colocar os 4 arquivos JPG com os nomes da seção 5 |
| Vídeo | `public/video/` | Gerar o loop com o script da seção 6 (o código já espera os arquivos; ver `src/components/Ordem.astro`) |
| Calendly | `src/config/site.ts` → `agendaUrl` | Colar o link quando existir |
| Fontes oficiais | `public/fonts/` | Só se houver licença web de Roc Grotesk, The Seasons e LTC Francis. Hoje o site usa Bricolage Grotesque, Gloock e Nothing You Could Do (licença aberta, arquivos incluídos) |
| Hospedagem Nginx | `public/.htaccess` | O arquivo é para Apache (padrão nas hospedagens brasileiras). Se for Nginx, peça ao suporte: página 404 = `/404.html`, e servir `/diagnostico` como `/diagnostico/index.html` |

---

## 8. Checklist rápido depois de subir

- [ ] `https://www.volgus.com.br` abre com cadeado (HTTPS)
- [ ] `https://www.volgus.com.br/diagnostico` abre e o fluxo vai até o fim
- [ ] O botão do WhatsApp abre a conversa com a mensagem preenchida
- [ ] `https://www.volgus.com.br/uma-pagina-que-nao-existe` mostra a página 404 do site
- [ ] Compartilhar o link no WhatsApp mostra a imagem preta com o título (Open Graph)
- [ ] O favicon aparece na aba (símbolo lime no quadrado preto)
