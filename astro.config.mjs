import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// URL pública canônica do site. Deixe vazia em desenvolvimento.
// Preencha em Cloudflare Pages como variável de ambiente SITE_URL
// (ex.: https://cltsimulator.com) antes do deploy — docs/CLOUDFLARE_DEPLOY.md.
const site = (process.env.SITE_URL ?? process.env.PUBLIC_SITE_URL ?? '').trim();

export default defineConfig({
  ...(site ? { site } : {}),
  // O sitemap só faz sentido com uma URL canônica pública definida.
  integrations: site ? [sitemap()] : [],
  build: {
    inlineStylesheets: 'auto',
  },
});
