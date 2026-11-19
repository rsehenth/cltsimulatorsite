# Arquitetura — site CLT Simulator

## Stack e modo de entrega

| Camada | Escolha | Motivo |
| --- | --- | --- |
| Gerador de páginas | Astro 7.4, saída estática (`astro build`) | Uma página institucional de jogo: o HTML pronto no build é o menor custo e o menor risco |
| Linguagem | TypeScript strict (`astro/tsconfigs/strict`) + tipos de template pelo `astro check` | O conteúdo é tipado; status inconsistente não compila |
| Estilo | CSS próprio com tokens (`src/styles/tokens.css`) + CSS com escopo por componente | Identidade própria; nenhum framework de UI aparece no HTML |
| Interatividade | ~3,5 KB de JavaScript vanilla (brotli) em `public/js/` | Três melhorias progressivas; nada no site depende de script para ser lido |
| Fontes | Famílias do sistema | Zero requisição externa, zero flash de reflow, sem dependência de CDN |
| Ícones | Pixel art em `<symbol>`/`<use>`, gerada no build | Uma grade 16×16 desenhada uma vez; nítida em qualquer escala; nenhum emoji |
| Dependências | `astro`, `@astrojs/check`, `@astrojs/sitemap`, `typescript` (todas dev) | Sem runtime de terceiros no navegador |
| Gerenciador | npm com `package-lock.json` versionado | Instalação reproduzível |

Não há SSR, API, banco de dados, autenticação, CMS, formulário, analytics nem cookie banner.
Não há React, Vue, Svelte nem biblioteca de animação.

## SSG: o que o build produz

```
dist/
  index.html                     87,6 KB bruto · 11,6 KB brotli
  _astro/index.<hash>.css        49,6 KB bruto · 8,2 KB brotli
  js/reveal.js                    1,3 KB · 0,6 KB brotli
  js/motion.js                    6,4 KB · 2,3 KB brotli
  js/ficha.js                     1,3 KB · 0,6 KB brotli
  assets/branding/clt-logo.png   51,0 KB
  assets/branding/clt-mark.png   19,2 KB
  favicon.svg · robots.txt · _headers
```

Uma página, dez arquivos, 219.276 B (~219 KB) no total — dos quais 23,4 KB comprimidos entre HTML,
CSS e os três scripts. Estes números são do build medido em 2026-10-24; se mudarem, atualize esta linha
e a baseline de `DECISIONS.md` em vez de deixar o texto antigo valer como promessa.
`astro.config.mjs` usa `build.inlineStylesheets: 'auto'`: o CSS pequeno fica embutido no HTML e o
grande sai como arquivo com hash — decisão tomada pelo Astro, não uma escolha manual.

## Fluxo dos dados

```
src/data/*.ts  ──import──▶  componentes .astro  ──render──▶  dist/index.html
 (conteúdo)                 (apresentação)                    (estático)
```

Todo texto público nasce em `src/data/` e só então é lido por componente. O caminho inverso não
existe: componente nenhum guarda informação editorial que precise ser atualizada.

| Arquivo | Conteúdo | Consumido por |
| --- | --- | --- |
| `game.ts` | nome, estado, demo, personagem, destaques, mecânicas, galeria, nota de IA, devlog, SEO | Hero, Highlights, StatusPanel, ApplicationSheet, Devlog, seção 02, Gallery, BaseLayout |
| `roadmap.ts` | frentes construídas, áreas de sistema, frentes planejadas, próximo marco, evolução de arte, fases, contagens | RoadmapTimeline, SystemGrid, PlannedList, ArtEvolution, StatusPanel |
| `navigation.ts` | as três seções e suas âncoras | Header, Footer |
| `social.ts` | redes oficiais (URLs vazias até existirem) + `validLinks()` | Footer |
| `sprites.ts` | paleta de 17 tintas e 29 sprites 16×16 | PixelSpriteSheet, todo `PixelIcon` |

As contagens exibidas nos HUDs ("8 frentes construídas · 12 áreas de sistema · 9 frentes planejadas")
são `builtFronts.length`, `systemAreas.length` e companhia — derivadas dos dados, nunca digitadas.
Adicionar uma frente ao arquivo muda o número na tela sozinha.

### Tipos que impedem status inventado

```ts
export type WorkStatus = 'done' | 'active' | 'base' | 'proto' | 'planned';
export const STATUS_LABEL: Record<WorkStatus, string>;
```

`RoadmapItem.status` é `WorkStatus`. Escrever `'implemented'`, `'concluído'` ou um status novo não
compila sem antes entrar no tipo e no seu rótulo oficial — que é o que impede um recurso planejado de
aparecer como pronto.

### Fonte única do "2027"

`game.demo.year = 2027`. Hero, painel de status, farol do roadmap e rodapé leem desse número.
Mudar a previsão é editar uma linha.

## Componentes

```
layouts/BaseLayout      head, metadados, JSON-LD, sprite sheet, skip link, Header, main, Footer
components/
  layout/    Header (capa fixa com as três âncoras + estado)  ·  Footer (estado, redes, créditos)
  home/      Hero · Highlights · StatusPanel · ApplicationSheet · Devlog
  game/      FeatureCard · Gallery · AiNote
  roadmap/   RoadmapTimeline · SystemGrid · PlannedList · ArtEvolution · DemoBeacon · RoadmapCard
  ui/        SectionHeading · PixelIcon · PixelSpriteSheet · StatusBadge
pages/index.astro       compõe as três seções na ordem do brief
```

`index.astro` é a única página. As três seções do menu são âncoras dentro dela (`#home`, `#jogo`,
`#roadmap`), separadas por perfurações de papel. Não existe rota secundária — e por isso não existe
menu com item que não leva a lugar nenhum.

Cada componente traz o próprio `<style>` com escopo; os utilitários compartilhados (`.wrap`,
`.plate--*`, `.cornered`, `.ticked`, `.pixel`, `.reveal`) vivem em `global.css`.

## Assets

- `public/assets/branding/clt-logo.png` (960×480) e `clt-mark.png` (440×220): arte oficial do
  projeto, copiada do material do jogo para dentro deste site. Os originais, mantidos fora
  deste repositório, permanecem intactos e verificados por hash. O brasão (`clt-mark`) aparece na contracapa do rodapé;
  o cabeçalho fixo usa só o nome tipográfico — ver `DECISIONS.md` §23.
- `favicon.svg` é vetor; `robots.txt` libera o index e deixa a linha de sitemap comentada até existir
  domínio.
- Não há captura de tela do jogo autorizada. A galeria (`Gallery.astro`) renderiza o estado
  "prévia a caminho" — uma tela desligada com o sprite da cena, nunca um quadro quebrado e nunca uma
  imagem inventada. `src/data/game.ts` → `gallery` aceita `src?`; publicar uma imagem é preencher o
  campo.

## JavaScript: três melhorias progressivas, todas externas

| Arquivo | Faz | Sem ele |
| --- | --- | --- |
| `public/js/reveal.js` | `IntersectionObserver` adiciona `.reveal` + `.is-in` e o escalonamento `.is-d0…d4` | Todo o conteúdo já está no HTML, visível |
| `public/js/motion.js` | Liga `.js` no `<html>` e escreve por CSSOM os progressos suavizados por lerp (`--spine-p` da timeline, `--p` da barra de sistema, `--tilt-x/--tilt-y` dos painéis); acende `.is-passed` e `.is-boot` | A barra de sistema não existe, a linha da timeline fica o gradiente fixo do trilho, nada se oculta |
| `public/js/ficha.js` | Cria o botão "Carimbar candidatura" e o contador da ficha; o carimbo "Sem vagas" existe no HTML | A ficha continua legível, sem botão |

`motion.js` é o único dono do movimento ligado a progresso: um listener de `scroll` passivo, um
`resize`, um `requestAnimationFrame` compartilhado e um `IntersectionObserver` que atende a espinha e o
painel de status. Cada valor exibido persegue o alvo (lerp) em vez de saltar. Ele não duplica o observer
de `reveal.js` — um trata de entrada de conteúdo, o outro de progresso — e não escreve `<style>` nem
`style=""`: só `element.style.setProperty()`, que a CSP não filtra.

Os três entram com `<script is:inline defer src="…">`. São arquivos separados de propósito:
scripts embutidos exigiriam `'unsafe-inline'` (ou hash por build) na CSP. Como o Astro 7 já embute
`<script>` de bundle como módulo inline, a única forma de manter `script-src 'self'` limpo é servir o
JS por URL — e é exatamente isso que `public/_headers` declara.

## Segurança e configuração

- `public/_headers` aplica CSP restritiva (`default-src 'self'`, `script-src 'self'`,
  `style-src 'self'`, `img-src 'self'`, `object-src 'none'`, `frame-ancestors 'self'`,
  `base-uri 'self'`, `form-action 'none'`), `X-Content-Type-Options`, `Referrer-Policy`,
  `Permissions-Policy` e `Cross-Origin-Opener-Policy`.
- Consequência prática: **zero** atributos `style=""`, **zero** scripts inline executáveis, **zero**
  recursos de terceiros no HTML gerado. Nada disso é exceção silenciosa — é o contrato da CSP.
- Conteúdo entra no HTML pelo escape automático do Astro. Os dois únicos `set:html` do projeto são
  dados gerados no build: a folha de sprites (constantes de `src/data/sprites.ts`) e o bloco
  `application/ld+json`, este último com `<` escapado para `\u003c` — um `"<"` vindo de `src/data`
  poderia fechar a tag `<script>`. Bloco de dados não é executável, por isso não depende de `script-src`.
- `Astro.site` só existe quando `SITE_URL` (ou `PUBLIC_SITE_URL`) vem do ambiente. Sem ela:
  sem canonical, sem `og:url`, sem `url` no JSON-LD, sem sitemap, sem domínio falso. Em dev,
  `<meta name="robots" content="noindex">`.
- Nenhum `.env`, segredo ou caminho local (`C:\`, `D:\`) entra no build.

## Decisões arquiteturais, resumidas

1. **Astro estático em vez de framework de SPA** — o site é leitura, não aplicação; o custo de
   runtime de React seria pago em todo carregamento para não fazer nada.
2. **Uma página com âncoras em vez de rotas** — o brief pede exatamente três seções; navegação por
   âncora funciona sem JS e não cria página vazia.
3. **Tokens em vez de framework CSS** — a identidade vem do roadmap de referência; framework algum
   produziria aquelas cores, aquelas chapas e aquele carimbo.
4. **Sprite sheet no build, não biblioteca de ícones** — 29 grades 16×16 viram um `<symbol>` por
   ícone usado; o navegador não desenha a grade duas vezes.
5. **Fontes do sistema** — dependência externa proibida pelo brief de performance; Bahnschrift é a
   letra de formulário que o projeto já usa.
6. **JS externo e mínimo** — exige CSP sem `'unsafe-inline'` e mantém o site completo sem script.
7. **`SITE_URL` como única chave de publicação** — o mesmo build serve localhost sem vazar domínio e
   serve o domínio oficial assim que ele existir.

Limites conhecidos e o que fica para depois: `docs/DECISIONS.md`.
