# Vídeo — onde colocar o original

Coloque aqui um dos MP4 originais do Drive (pasta "VIDEO MARKETING VOLGUS"), por exemplo:

    public/video/_source/Volgus - Video 2 -MKT-A_2.mp4

Depois rode, na raiz do projeto:

    bash scripts/prepare-media.sh "public/video/_source/Volgus - Video 2 -MKT-A_2.mp4"

Isso gera `public/video/loop.mp4`, `public/video/loop.webm` e `public/video/poster.jpg`
(6 segundos, sem áudio, 1280px de largura, < 1,5 MB). Os arquivos desta pasta `_source`
não vão para o site: estão no `.gitignore` e o build os ignora.
