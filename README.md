# CLT Simulator — site oficial

Site de apresentação do **CLT Simulator**, jogo indie brasileiro de simulação de vida em pixel art.
Uma página estática, em português, que apresenta o protótipo, o protagonista Cleiton e o roadmap real
do desenvolvimento.

**Estado do projeto:** protótipo jogável, em desenvolvimento ativo. Demo prevista para 2027.
Não há download, não há página de loja, não há contagem regressiva — e não é descuido: nada disso existe ainda.

## Stack

- [Astro](https://astro.build/) 7.x, saída 100% estática (SSG), sem SSR e sem backend.
- TypeScript strict nos dados e nos templates (`.astro`).
- CSS puro com tokens próprios — sem framework de UI, sem Tailwind, sem React/Vue/Svelte.
- Fontes do sistema (Bahnschrift / Segoe UI / Cascadia Mono) — nenhuma requisição a serviço externo.
- Ícones pixel art gerados em `<symbol>` no build, sem biblioteca de ícones.
- `npm` com `package-lock.json` versionado.

## Comandos

```bash
npm install      # instala as dependências (Node >= 20.19)
npm run dev      # http://localhost:4321 com recarga ao vivo
npm run check    # astro check — tipos e templates
npm run build    # gera dist/
npm run preview  # serve dist/ para conferência final
```

## Estrutura

```
public/            copiado 1:1 para dist/
  assets/branding/ logo oficial e marca
  js/              reveal.js, ficha.js (scripts externos)
  _headers         cabeçalhos de segurança para Cloudflare Pages
  robots.txt
src/
  data/            game.ts, roadmap.ts, navigation.ts, social.ts, sprites.ts
  components/      home/ game/ roadmap/ layout/ ui/
  layouts/         BaseLayout.astro
  pages/           index.astro
  styles/          tokens.css, global.css
docs/              arquitetura, design system, conteúdo, deploy, decisões
```

## Onde mudar cada coisa

| Quero… | Edito… |
| --- | --- |
| Trocar um texto do hero, do personagem ou do estado | `src/data/game.ts` |
| Mudar a previsão da demo | `src/data/game.ts` → `game.demo.year` (única fonte do "2027") |
| Adicionar/retirar uma frente do roadmap | `src/data/roadmap.ts` (as contagens dos HUDs são derivadas) |
| Publicar uma captura do jogo | `public/assets/` + entrada correspondente em `gallery` (`src/data/game.ts`) |
| Escrever um devlog novo | `src/data/game.ts` → `devlog` |
| Colocar as redes sociais oficiais | `src/data/social.ts` (só URL absoluta http/https renderiza) |
| Ajustar cor, tipo ou espaçamento | `src/styles/tokens.css` |
| Criar um ícone pixel novo | `src/data/sprites.ts` |

Detalhes em [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md).

## Documentação

- [`AGENTS.md`](AGENTS.md) — regras de trabalho para agentes e contribuidores.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — stack, SSG, fluxo de dados, assets.
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — cores, tipografia, componentes, ícones, responsividade.
- [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md) — tom, terminologia, roadmap, screenshots, redes.
- [`docs/CLOUDFLARE_DEPLOY.md`](docs/CLOUDFLARE_DEPLOY.md) — publicação no Cloudflare Pages.
- [`docs/DECISIONS.md`](docs/DECISIONS.md) — decisões técnicas e limites conhecidos.

## Publicar

Nada é publicado automaticamente. O passo a passo está em
[`docs/CLOUDFLARE_DEPLOY.md`](docs/CLOUDFLARE_DEPLOY.md) — inclusive a variável `SITE_URL`, que
controla canonical, `og:url` e sitemap: sem ela, o site é gerado sem domínio falso.
