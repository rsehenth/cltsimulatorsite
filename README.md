# CLT Simulator — Official Website

**English | [Português (Brasil)](README.pt-BR.md)**

Official promotional website for **CLT Simulator**, a Brazilian indie life-simulation game in pixel art.
A single static page, written in Brazilian Portuguese, that presents the prototype, the protagonist
Cleiton, and the real development roadmap.

**Live website:** <https://cltsimulatorsite.pages.dev/>

> **This repository contains only the official promotional website. It does not contain the source code
> of the CLT Simulator game.**

## About the game and the website

In CLT Simulator the player follows **Cleiton**, who is trying to land a job, survive the bills and face
the absurdities of adult life in Brazil, with only a few days to change his situation. The game features
a retro desktop, WinTário OS, and in-game apps such as FudidIn, ZapZap, PomboMail and Tinderella.

The website follows the game's visual language (work permit, stamps, HUD, form typography) and has three
anchored sections: **HOME**, **JOGO E CONCEITO** (game and concept) and **ROADMAP**. It is not a store,
a SaaS dashboard or a lead-capture page.

## Current development status

- CLT Simulator is in **active development** and has a **playable prototype**.
- A demo is **planned for 2027**. This is a forecast, not a confirmed release date.
- There is **no download, store page, countdown or gameplay screenshot** yet, and the site does not
  claim any. Nothing is shown that does not exist.

## Website features

- Static, single-page site with three sections and a skip link.
- Content-driven roadmap: counts in the HUD panels are derived from the data, not typed by hand.
- Pixel-art icons generated at build time as inline SVG `<symbol>`s.
- Progressive enhancement: scroll reveal and motion scripts are optional and respect
  `prefers-reduced-motion`; the page is complete without JavaScript.
- Responsive layout from 280 px to 3440 px wide, without horizontal scrolling.
- Strict Content Security Policy (no inline scripts or styles) and security headers for Cloudflare Pages.
- System fonts only; no third-party requests at runtime.
- Social links render only when a real, published URL exists.

## Technology stack

- [Astro](https://astro.build/) 7 in fully static mode (SSG): no SSR, no backend.
- TypeScript (strict) in data files and templates.
- Custom CSS with design tokens (`src/styles/tokens.css`); no CSS framework and no UI framework.
- Modular `.astro` components.
- [`@astrojs/sitemap`](https://docs.astro.build/en/guides/integrations-guide/sitemap/), generated only
  when `SITE_URL` is set.
- Hosting on [Cloudflare Pages](https://pages.cloudflare.com/).
- `npm` with a committed `package-lock.json`.

## Project architecture

Content lives in `src/data/`, presentation lives in components. Changing a text never requires touching
layout, and changing a visual never requires rewriting text. Colors, type sizes and spacing come from
design tokens, and variations are CSS classes, which keeps `style-src 'self'` valid in the CSP.

More detail in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and
[`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md).

## Directory structure

```
public/            static files copied 1:1 to dist/
  assets/branding/ official logo and mark
  js/              reveal.js, motion.js, ficha.js (external scripts)
  _headers         CSP and cache headers for Cloudflare Pages
  robots.txt
src/
  data/            game.ts, roadmap.ts, navigation.ts, social.ts, sprites.ts (all editable content)
  components/      home/ game/ roadmap/ layout/ ui/
  layouts/         BaseLayout.astro
  pages/           index.astro
  styles/          tokens.css, global.css
docs/              architecture, design system, content guide, deployment, decisions
```

## Local setup

Requires Node.js 20.19 or newer.

```bash
npm install
```

## Development and build commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server at `http://localhost:4321` with live reload |
| `npm run check` | `astro check`: TypeScript and template type checking |
| `npm run build` | Generates the static site in `dist/` |
| `npm run preview` | Serves `dist/` locally for a final check |

## Deployment on Cloudflare Pages

Nothing is published automatically. Use **Connect to Git** in Cloudflare Pages with:

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable (optional) | `SITE_URL`, the final public URL |

`SITE_URL` controls the canonical URL, `og:url` and the sitemap. Without it, the site is built without
a domain. Full steps in [`docs/CLOUDFLARE_DEPLOY.md`](docs/CLOUDFLARE_DEPLOY.md).

## Content and asset management

| To… | Edit… |
| --- | --- |
| Change hero, character or status text | `src/data/game.ts` |
| Change the demo forecast | `src/data/game.ts` → `game.demo.year` (single source of "2027") |
| Add or remove a roadmap front | `src/data/roadmap.ts` |
| Publish a gameplay screenshot | `public/assets/` + the `gallery` entry in `src/data/game.ts` |
| Write a devlog entry | `src/data/game.ts` → `devlog` |
| Add official social links | `src/data/social.ts` (absolute http/https URLs only) |
| Adjust color, type or spacing | `src/styles/tokens.css` |

More in [`docs/CONTENT_GUIDE.md`](docs/CONTENT_GUIDE.md). Contribution and agent rules, including the
public-repository and sensitive-data policy, are in [`AGENTS.md`](AGENTS.md).

## Scope and licensing

- This repository holds the website only. Game source code, internal documents and development assets
  are private and are not part of it.
- **No open-source license has been applied.** Until the owner states otherwise, all rights are
  reserved: the code is published for transparency, not as a grant of reuse.
- The CLT Simulator name, logo, mark, artwork, characters and in-game app names are the project's
  identity and are **not** covered by any code license, present or future.
