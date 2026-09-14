import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static output only: the `dist/` folder is uploaded by FTP to shared hosting.
export default defineConfig({
  site: 'https://www.volgus.com.br',
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'always', assets: 'assets', format: process.env.FLAT_PAGES ? 'file' : 'directory' },
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
});
