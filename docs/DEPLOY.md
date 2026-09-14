# Como colocar o site no ar

Este site é uma pasta de arquivos estáticos. Não precisa de servidor Node, banco de dados nem "build na nuvem". Você gera a pasta `dist/` no seu computador e sobe o conteúdo dela para a hospedagem.

---

## 1. Gerar a pasta `dist/`

Você precisa do Node.js instalado (versão 20 ou mais nova: https://nodejs.org). Depois, na pasta do projeto:

```bash
npm install        # só na primeira vez, baixa as dependências
npm run build      # gera a pasta dist/
```

Para testar localmente antes de subir:

```bash
node scripts/serve.mjs
```

e abra `http://localhost:4330` no navegador. Esse comando serve só a pasta `dist/`, exatamente como a hospedagem vai fazer.

---

## 2. Subir por FTP

1. Abra o FileZilla (ou o gerenciador de arquivos do painel da hospedagem).
2. Conecte com o host, usuário e senha de FTP que a hospedagem te deu.
3. No lado remoto, entre na pasta pública do site. Os nomes mais comuns são `public_html`, `www` ou `htdocs`.
4. **Apague o que estiver lá dentro** (normalmente só um `index.html` de "em construção").
5. Do lado local, abra a pasta `dist/` do projeto, **selecione tudo que está dentro dela** (não a pasta `dist` em si) e arraste para a pasta remota.
6. Confira que o arquivo `.htaccess` também subiu. Ele começa com ponto e alguns programas escondem arquivos assim: no FileZilla, marque "Servidor → Forçar exibição de arquivos ocultos".

Pronto. O site abre no seu domínio.

**Por painel (cPanel, Hostinger, Locaweb, HostGator):** o caminho é o mesmo. Use o "Gerenciador de arquivos", entre em `public_html`, use "Enviar" e mande o conteúdo de `dist/`. Se o painel aceitar `.zip`, compacte o conteúdo de `dist/` (não a pasta), envie e extraia lá dentro.

---

## 3. Apontar o domínio

Se o domínio foi registrado no Registro.br e a hospedagem é outra empresa:

1. Na hospedagem, procure "DNS" ou "Servidores de nome" e copie os dois endereços (ex.: `ns1.hospedagem.com.br` e `ns2.hospedagem.com.br`).
2. No Registro.br, entre no domínio, vá em "Alterar servidores DNS" e cole os dois endereços.
3. Espera de 2 a 24 horas para propagar.

Ative o **HTTPS** no painel da hospedagem (quase todas têm "SSL grátis" ou "Let's Encrypt" com um clique). O site precisa abrir em `https://www.volgus.com.br` e `https://volgus.com.br`; peça para a hospedagem redirecionar um para o outro.

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
| Fotos | `src/assets/photos/` | Colocar os 4 arquivos JPG com os nomes da seção 5 |
| Vídeo | `public/video/` | Gerar o loop com o script da seção 6 (o código já espera os arquivos; ver `src/components/Ordem.astro`) |
| Calendly | `src/config/site.ts` → `agendaUrl` | Colar o link quando existir |
| Fontes oficiais | `public/fonts/` | Só se houver licença web de Roc Grotesk, The Seasons e LTC Francis. Hoje o site usa Bricolage Grotesque, Gloock e Nothing You Could Do (licença aberta, arquivos incluídos) |
| Hospedagem | `public/.htaccess` | O arquivo é para Apache (padrão nas hospedagens brasileiras). Se a hospedagem for Nginx, peça ao suporte para: página 404 = `/404.html`, e servir `/diagnostico` como `/diagnostico/index.html` |

---

## 8. Checklist rápido depois de subir

- [ ] `https://www.volgus.com.br` abre com cadeado (HTTPS)
- [ ] `https://www.volgus.com.br/diagnostico` abre e o fluxo vai até o fim
- [ ] O botão do WhatsApp abre a conversa com a mensagem preenchida
- [ ] `https://www.volgus.com.br/uma-pagina-que-nao-existe` mostra a página 404 do site
- [ ] Compartilhar o link no WhatsApp mostra a imagem preta com o título (Open Graph)
- [ ] O favicon aparece na aba (símbolo lime no quadrado preto)
