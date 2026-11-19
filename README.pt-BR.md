# CLT Simulator — Site Oficial

**[English](README.md) | Português (Brasil)**

Site promocional oficial do **CLT Simulator**, jogo indie brasileiro de simulação de vida em pixel art.
Uma página estática, em português do Brasil, que apresenta o protótipo, o protagonista Cleiton e o
roadmap real do desenvolvimento.

**Site no ar:** <https://cltsimulatorsite.pages.dev/>

> **Este repositório contém apenas o site promocional oficial. Ele não contém o código-fonte do jogo
> CLT Simulator.**

## Sobre o jogo e o site

No CLT Simulator o jogador acompanha **Cleiton**, que tenta conseguir um emprego, sobreviver aos boletos
e enfrentar os absurdos da vida adulta no Brasil, com poucos dias para mudar sua situação. O jogo tem um
desktop retrô, o WinTário OS, e aplicativos como FudidIn, ZapZap, PomboMail e Tinderella.

O site segue a linguagem visual do jogo (carteira de trabalho, carimbo, HUD, tipografia de formulário) e
tem três seções âncora: **HOME**, **JOGO E CONCEITO** e **ROADMAP**. Não é loja, painel SaaS nem página
de captação.

## Estado atual do desenvolvimento

- O CLT Simulator está em **desenvolvimento ativo** e tem um **protótipo jogável**.
- Uma demo está **prevista para 2027**. É uma previsão, não uma data de lançamento confirmada.
- **Ainda não há download, página de loja, contagem regressiva ou captura de tela de gameplay**, e o
  site não afirma nada disso. Nada é mostrado se não existir.

## Recursos do site

- Site estático de página única, com três seções e link de pular para o conteúdo.
- Roadmap orientado a dados: as contagens dos painéis HUD são derivadas, não digitadas à mão.
- Ícones pixel art gerados no build como `<symbol>` SVG embutidos.
- Melhoria progressiva: os scripts de revelação e movimento são opcionais e respeitam
  `prefers-reduced-motion`; a página funciona completa sem JavaScript.
- Layout responsivo de 280 px a 3440 px de largura, sem rolagem horizontal.
- Content Security Policy rígida (sem scripts ou estilos inline) e cabeçalhos de segurança para o
  Cloudflare Pages.
- Apenas fontes do sistema; nenhuma requisição a serviço de terceiros em tempo de execução.
- Links de redes sociais só aparecem quando existe uma URL real e publicada.

## Stack

- [Astro](https://astro.build/) 7 em modo totalmente estático (SSG): sem SSR e sem backend.
- TypeScript (strict) nos dados e nos templates.
- CSS próprio com design tokens (`src/styles/tokens.css`); sem framework de CSS nem de UI.
- Componentes `.astro` modulares.
- [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/), gerado só
  quando `SITE_URL` está definida.
- Hospedagem no [Cloudflare Pages](https://pages.cloudflare.com/).
- `npm` com `package-lock.json` versionado.

## Arquitetura

O conteúdo vive em `src/data/` e a apresentação vive nos componentes. Trocar um texto nunca exige mexer
no layout, e trocar um visual nunca exige reescrever texto. Cor, tamanho de fonte e espaçamento vêm de
design tokens, e as variações são classes CSS, o que mantém válido o `style-src 'self'` da CSP.

Mais detalhes em [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) e
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Estrutura de diretórios

```
public/            arquivos estáticos copiados 1:1 para dist/
  assets/branding/ logo oficial e marca
  js/              reveal.js, motion.js, ficha.js (scripts externos)
  _headers         CSP e cache para o Cloudflare Pages
  robots.txt
src/
  data/            game.ts, roadmap.ts, navigation.ts, social.ts, sprites.ts (todo o conteúdo editável)
  components/      home/ game/ roadmap/ layout/ ui/
  layouts/         BaseLayout.astro
  pages/           index.astro
  styles/          tokens.css, global.css
docs/              arquitetura, design system, guia de conteúdo, deploy, decisões
```

## Instalação local

Requer Node.js 20.19 ou superior.

```bash
npm install
```

## Comandos de desenvolvimento e build

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:4321` com recarga ao vivo |
| `npm run check` | `astro check`: verificação de tipos TypeScript e de templates |
| `npm run build` | Gera o site estático em `dist/` |
| `npm run preview` | Serve `dist/` localmente para a conferência final |

## Deploy no Cloudflare Pages

Nada é publicado automaticamente. Use **Connect to Git** no Cloudflare Pages com:

| Configuração | Valor |
| --- | --- |
| Comando de build | `npm run build` |
| Diretório de saída | `dist` |
| Variável de ambiente (opcional) | `SITE_URL`, a URL pública final |

`SITE_URL` controla o canonical, o `og:url` e o sitemap. Sem ela, o site é gerado sem domínio. O passo a
passo completo está em [`docs/CLOUDFLARE_DEPLOY.md`](docs/CLOUDFLARE_DEPLOY.md).

## Conteúdo e ativos

| Quero… | Edito… |
| --- | --- |
| Trocar texto do hero, do personagem ou do estado | `src/data/game.ts` |
| Mudar a previsão da demo | `src/data/game.ts` → `game.demo.year` (única fonte do "2027") |
| Adicionar/retirar uma frente do roadmap | `src/data/roadmap.ts` |
| Publicar uma captura do jogo | `public/assets/` + entrada em `gallery` (`src/data/game.ts`) |
| Escrever um devlog novo | `src/data/game.ts` → `devlog` |
| Colocar as redes sociais oficiais | `src/data/social.ts` (só URL absoluta http/https) |
| Ajustar cor, tipo ou espaçamento | `src/styles/tokens.css` |

Mais em [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md). As regras para agentes e contribuidores,
incluindo a política de repositório público e dados sensíveis, estão em [`AGENTS.md`](AGENTS.md).

## Escopo e licenciamento

- Este repositório contém só o site. Código-fonte do jogo, documentos internos e ativos de
  desenvolvimento são privados e não fazem parte dele.
- **Nenhuma licença de código aberto foi aplicada.** Até que o titular decida o contrário, todos os
  direitos são reservados: o código é publicado por transparência, não como autorização de reuso.
- O nome CLT Simulator, o logo, a marca, a arte, os personagens e os nomes dos aplicativos do jogo são
  a identidade do projeto e **não** são cobertos por nenhuma licença de código, atual ou futura.
