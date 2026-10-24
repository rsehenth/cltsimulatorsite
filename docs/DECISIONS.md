# Decisões — site CLT Simulator

Registro conciso das escolhas técnicas e editoriais que definiram este build, com o motivo e o que
cada uma custa. Leia antes de reverter qualquer coisa: quase tudo aqui tem uma razão que não aparece
no código.

Formato: **Decisão → por quê → consequência.**

---

## Arquitetura

### 1. Astro em modo estático (SSG), sem SSR

O site é leitura: apresentação do jogo, estado do projeto e roadmap. Renderizar no navegador (SPA)
ou no servidor (SSR) pagaria custo em todo carregamento para não executar nenhuma lógica. Com SSG, o
visitante recebe HTML pronto, o host é qualquer CDN, e não existe superfície de servidor para
proteger.

**Custo:** nada muda sem um novo build. Para conteúdo editado por não-programador, isso exigiria um
CMS no futuro (ver "Decisões futuras").

### 2. Nenhum framework de UI, nenhuma biblioteca de animação

React/Vue/Svelte resolveriam um problema que o site não tem: estado compartilhado entre componentes.
As duas interações existentes (entrada escalonada, carimbo) cabem em 2,4 KB de JavaScript vanilla.
Um framework traria ~40 KB de runtime, hidratação e um `script-src` mais permissivo, além de
entregar, por padrão, exatamente a estética genérica que o brief proíbe.

**Custo:** as animações são escritas à mão. São quatro, e são poucas de propósito.

### 3. Uma página, três âncoras

O menu tem exatamente HOME, JOGO E CONCEITO e ROADMAP. São três seções de um mesmo documento, com
`scroll-margin-top` compensando a capa fixa. Sem rota secundária, não existe link de menu que leve a
uma página vazia — e navegação por âncora funciona com JavaScript desativado.

**Custo:** se o site crescer (devlogs, imprensa, FAQ), aí sim viram rotas; a estrutura atual já
comporta `src/pages/*.astro` novos sem refatorar nada.

### 4. Dependências: quatro, todas de desenvolvimento

`astro`, `@astrojs/check`, `@astrojs/sitemap`, `typescript`. Zero pacote no bundle do navegador.
Nenhum deles foi instalado sem uso real: o sitemap só é carregado quando há domínio, o check é o
portão de tipos dos dados.

## Conteúdo e honestidade

### 5. Todo texto público nasce em `src/data/`

`game.ts`, `roadmap.ts`, `navigation.ts`, `social.ts`. Componente não guarda informação editorial.
Isso deixa "mudar o texto" ser um diff de dado, não de layout — e torna visível o que é fato do que é
apresentação.

**Custo:** um editor de conteúdo precisa abrir código. Um CMS é a resposta quando isso incomodar.

### 6. A string "2027" existe uma vez

`game.demo.year`. Hero, painel de status, farol do roadmap e rodapé derivam dela. Uma previsão adiada
é uma linha editada, não uma varredura de texto.

### 7. `WorkStatus` como tipo fechado

`done | active | base | proto | planned`, com rótulo oficial em `STATUS_LABEL`. Um item planejado
marcado como `'implemented'` não compila. É a barreira técnica contra o risco editorial nº 1 deste
projeto: parecer pronto sem estar.

### 8. Sem screenshots — e sem imagem inventada no lugar

O material autorizado contém uma única arte raster do jogo (o logo oficial). Não há captura de
gameplay publicada. A galeria então renderiza o estado **"Prévia a caminho"**: uma prancha de tela
desligada com o sprite da cena, e um texto que diz que as cenas já existem no jogo e entram aqui
quando as imagens estiverem prontas. Gerar uma imagem por IA para preencher o vão seria publicar uma
mentira sobre o produto — e o brief proíbe explicitamente.

**Custo medido:** o gate de design marca `few-pictures` (1 imagem real na página). É o preço de dizer
a verdade, e foi aceito.

### 9. Redes sociais com URLs vazias por padrão

`socialLinks` traz cinco entradas sem `url`, e `validLinks()` só aceita http/https absoluto. Sem canal
publicado, o rodapé diz que não há canal ainda. Não existe botão cinza desabilitado nem link para
perfil que não existe.

### 10. `SITE_URL` é a única chave que liga o domínio

Sem a variável, o build não escreve canonical, `og:url`, `url` no JSON-LD nem sitemap — e em dev
escreve `noindex`. O site nunca publica um domínio que não foi confirmado.

## Identidade visual

### 11. Como a identidade do HTML de referência foi preservada (sem copiá-lo)

`E:\RDImortal\Roadmap-v1-CLT.html` foi tratado como **documento de design, não como fonte para
colar**. O arquivo original permanece intacto (hash conferido), nenhuma linha de markup dele entrou
no projeto, e nada foi escrito naquela pasta.

O que foi extraído e re-codificado:

| Do referência | Virou aqui |
| --- | --- |
| Paleta azul-marinho + dourado + ciano/verde/coral | `tokens.css`, com nomes de papel (`--ink`, `--panel`, `--gold`, `--cyan`, `--green`, `--coral`, `--stamp`) |
| Vermelho do carimbo "SEM VAGAS" | `--stamp` / `--stamp-deep`, usados no carimbo da ficha e no botão |
| Chapas com borda dura e cantoneiras | `.plate`, `.cornered`, `--edge: 2px`, `--corner: 14px`, sombra sólida `--offset` |
| Rótulos monoespaçados em caixa alta com tracking | `--font-data` + a família de classes `.section__num`, `.hud__row`, `.status` |
| Numeração decorativa `01 / 02 / 03` | navegação numerada e numeração de seção |
| Grade de sistemas com status colorido | `SystemGrid.astro` com `.systems__cell--<status>` |
| Barra de janela estilo SO antigo | `.hud__bar` com `--window-blue` (a mesma tinta do sprite) |
| Breakpoints do documento original | as oito larguras testadas (1920, 1440, 1366, 1024, 768, 390, 375, 320) reescritas em 16 pontos de quebra próprios: 1600 (min), 1080, 980, 900, 860, 820, 780, 680, 640, 620, 560, 520, 480, 460, 420 e 380 px |
| Os dados (8 frentes, 12 sistemas, 9 planejadas, 6 áreas de arte, 3 fases) | `src/data/roadmap.ts`, tipado e com contagens derivadas |

O HTML foi reescrito em componentes Astro com semântica (section, figure, dl, nav) e acessibilidade
que o documento original não tinha. **A cópia do markup teria herdado também os problemas dele.**

### 12. Fontes do sistema em vez de webfont

O brief proíbe dependência externa e o gate de performance penaliza requisição de fonte. A trinca
Bahnschrift (display) / Segoe UI Variable Text (texto) / Cascadia Mono (dados) cobre os três papéis
com letras que já existem no Windows e têm fallbacks nomeados para outros sistemas. O visual de
formulário/impresso é exatamente o que o projeto pede.

**Custo:** em um sistema sem Bahnschrift, o display cai para DIN Alternate / Franklin Gothic /
Segoe UI — mesma família de sensação, métricas diferentes. Nenhum título depende de métrica exata:
todos têm medida em `rem` e quebram em no máximo duas linhas.

### 13. Ícones pixel gerados no build, em `<symbol>`

`src/data/sprites.ts` guarda 29 grades 16×16 (um caractere por pixel) e a paleta de 17 tintas. No
build, pixels horizontais iguais viram um segmento e cada cor vira um `<path>`; o resultado é um
`<symbol id="px-…">` por ícone, emitido **só para os sprites usados na página**. O navegador não
desenha grade nenhuma duas vezes, e o ícone fica nítido em 32, 48, 64, 96 px.

Alternativas recusadas: biblioteca de ícones (fora da linguagem), PNG por ícone (peso e serrilhado em
retina), emoji (o brief e a skill proíbem).

### 14. Tokens obrigatórios, `style=""` proibido

Toda cor, tamanho de fonte e espaçamento vem de `tokens.css`. Variações de estado viram classe
(`.hud__row--green`, `.systems__cell--proto`), não `style="--tone: …"`. Isso não é purismo: é o que
permite uma CSP com `style-src 'self'` sem `'unsafe-inline'`. O HTML gerado tem **zero** atributos
`style`.

### 15. JavaScript servido por arquivo, nunca inline

O Astro 7 embute no HTML o `<script>` de bundle (como módulo) — o que exigiria hash ou
`'unsafe-inline'` na CSP. Por isso `reveal.js` e `ficha.js` vivem em `public/js/` e entram com
`<script is:inline defer src="…">`. Consequência dupla: CSP limpa e melhoria progressiva real.

### 16. O carimbo é a "coisa viva" da página

Uma página de jogo precisa de um gesto do próprio mundo. O botão **"Carimbar candidatura"** existe só
com JavaScript, reproduz o carimbo descendo sobre a ficha (`scale 2.4 → 1`, rotação de -9°) e conta as
carimbadas com uma frase que continua sendo o humor do jogo. Sem script, a ficha continua legível com
o carimbo já aplicado no HTML.

## Acessibilidade e segurança

### 17. Conteúdo completo sem JavaScript

Os estados escondidos (`.reveal`) só existem depois que o script roda — sem JS, nada fica invisível.
Todo texto, todo estado e toda âncora estão no HTML. `prefers-reduced-motion` desliga entrada,
pisca-pisca e carimbo sem esconder nada.

### 18. Semântica antes de ARIA

`nav` com `aria-label`, `main` com skip link, `section` com `aria-labelledby` no título, `figure`/
`figcaption` na galeria, `dl` nos fatos da capa e na ficha, `hr.perforation` com `aria-hidden`,
`role="img"` apenas em ícone que carrega significado. Formulário inexistente não é fingido: não há
`<form>` no site, porque não há backend.

### 19. CSP restritiva como contrato

`public/_headers` fecha `object-src`, `frame-ancestors`, `base-uri` e `form-action`, e não abre
`'unsafe-inline'` em script nem em estilo. As exceções que outros projetos costumam pedir — analytics,
webfont, embed de vídeo, tweet incorporado — estão fora por decisão, não por esquecimento. Cada uma
delas é uma linha a mais na CSP e uma dependência de terceiros na primeira dobra.

### 20. HSTS fica para o domínio próprio

`Strict-Transport-Security` é o único cabeçalho de endurecimento padrão ausente, e a ausência é
deliberada: enquanto o site serve de `*.pages.dev`, o host é compartilhado, e `includeSubDomains`
alcançaria projetos que não são nossos. Entra junto do domínio, com `max-age` curto e `www` decidido
antes. Detalhe operacional em `CLOUDFLARE_DEPLOY.md`, seção 5.

### 21. Passada final das guidelines (o que ela mudou)

Auditoria de fim de build contra o checklist de interface e o de segurança. Quatro coisas entraram,
todas pequenas e todas reais:

- `color-scheme: dark` como propriedade CSS no `:root`, não só a meta — sem ela barra de rolagem e
  controles nativos chegam em claro em alguns navegadores.
- `touch-action: manipulation` e `-webkit-tap-highlight-color` explícito em links e botões — o atraso
  de duplo-toque é um custo de mobile pago sem ninguém decidir.
- `<` escapado para `\u003c` no JSON-LD. O bloco é escrito com `set:html`, e um `"<"` vindo de
  `src/data` — editável por quem não escreve código — fecharia a tag `<script>`.
- `role="status"` na mensagem do carimbo: texto que muda depois do clique não é anunciado sozinho.

O que o checklist apontou e **não** se aplicou: virtualização de lista (há 12 itens no maior bloco),
`preconnect`/`preload` de fonte (não há recurso de terceiros nem webfont — decisão 12), `tabular-nums`
(nenhum número alinhado em coluna), `autocomplete`/`type`/validação de formulário (não há formulário,
decisão 18), `aria-label` em botão só de ícone (não existe botão sem texto).

## O que o gate de design marcou e foi mantido de propósito

A skill `design-taste-frontend` mede a página em um navegador real e proíbe um conjunto de padrões
considerados "cara de template". **Este projeto viola várias dessas regras conscientemente**, porque
o vernáculo proibido é exatamente a linguagem visual herdada do roadmap de referência. A lista, para
que ninguém a "corrija" sem decidir de novo:

| Marcação | Por que ficou |
| --- | --- |
| `gradient` (15) | Biséis de chapa e barra de janela do WinTário são gradientes duros de 2 paradas, não fundo decorativo |
| `shadow` / `button-fx` (18) | Sombra sólida deslocada (`6px 6px 0`) é a projeção de chapa do HUD; não existe blur |
| `hairline` (17) | Linhas de tabela de formulário e divisores de HUD — estrutura de documento, não ornamento |
| `dashed` (4) | Pontilhado de ficha destacada e picote de papel |
| `micro-label` (74), `mono` | Rótulo de HUD em caixa alta com tracking é como o jogo nomeia estados |
| `numbering`, `eyebrow` | `01/02/03` e "Seção 02" vêm da navegação numerada do documento original |
| `icon-cards` (3 linhas) | Grade de sistemas do roadmap é, no jogo, uma grade de ícones + status |
| `font-count` (3), `size-count` (10–11) | Três papéis tipográficos e uma escala nomeada de nove tamanhos; nenhum tamanho órfão |
| `few-pictures` (1) | Ver decisão 8: não existe screenshot autorizado do jogo |
| `video` (WARN) | Ver limite conhecido 2: sem clipe do jogo, footage genérico ilustraria outra coisa |

O que o gate marcou e **foi corrigido**: títulos quebrando em três linhas (medida em `rem`, escala
`--fs-display`, `lines={[]}` no `SectionHeading`), contraste do rótulo dourado sobre papel, contraste
do texto do carimbo (tamanho próprio `--fs-stamp`, sempre em faixa de texto de exibição), ícones da
galeria a 16 px por referência circular de token, navegação cortando "ROADMAP" em 320 px, o
transbordamento horizontal de 106 px em 1024 px causado pela linha de marca do cabeçalho, e a marca
d'água do primeiro destaque passando por cima do título (`z-index: 1` no bloco de texto; a marca fica
atrás, como sempre deveria ter ficado).

### Baseline medido deste build (para diferenciar escolha de regressão)

- `lint.mjs` sobre `src/`: **51 FAIL, 2 WARN** — todos os padrões da tabela acima, mais o travessão
  de pontuação do português. Decidido não poluir o código com 51 comentários
  `taste-skill-ignore`: a linha de base é este registro.
- `inspect.mjs` sobre `dist/` em 1920/1440/1366/1024/768/390/375/320 px: **10 FAIL, 4 WARN**, todas
  dentro da tabela. **Zero marcação de defeito real**: nenhum título em três linhas, nenhum contraste
  reprovado, nenhum transbordo horizontal (0 px nas oito larguras), nenhuma imagem quebrada, nenhum
  emoji, nenhuma tela quase vazia, nenhum console error.
- Elementos que se movem por largura: 53/46/42/39/50/33/31/6. Em 320 px a meta de oito da skill fica
  um pouco abaixo porque a página cabe em menos dobras e a lista de destaques já entrou na viewport
  anterior; o gate não marcou FAIL. É um número para observar, não para "corrigir" com animação extra.
- Qualquer FAIL fora dessas listas é regressão, não barulho — e deve ser corrigido antes do merge.

## Limites conhecidos deste build

1. **Uma imagem raster no site.** A galeria é honesta e vazia; o hero usa a arte oficial com a legenda
   "Arte oficial do projeto. Capturas do jogo entram aqui quando existirem."
2. **Nenhum vídeo.** Não há clipe do jogo; buscar footage genérico de "vida urbana brasileira"
   ilustraria outra coisa e foi recusado.
3. **Sem analytics, sem cookie banner, sem testes E2E automatizados.** A validação é `astro check` +
   build + inspeção de `dist/` + `inspect.mjs` em navegador real em oito larguras.
4. **Fontes do sistema** implicam variação métrica entre plataformas.
5. **Não medido:** nenhuma pontuação de Lighthouse/Core Web Vitals é afirmada em lugar nenhum deste
   projeto, porque não foi rodado. Os números citados são de peso de arquivo medido no `dist/`.
6. **Sem deploy, sem Git, sem repositório remoto** — por instrução explícita.

## Decisões futuras (nenhuma está implementada; não trate como existente)

- **Devlogs reais** — exige `src/data/devlogs.ts` + lista no bloco, como descreve `CONTENT_GUIDE.md`.
- **Capturas oficiais** — preencher `src` em `gallery`; a CSP atual já permite `img-src 'self'`.
- **Canais sociais** — preencher `social.ts`; revisar `rel`/`target` já prontos no rodapé.
- **Domínio próprio** — definir `SITE_URL`, descomentar `Sitemap:` em `robots.txt`.
- **Segunda página** (imprensa, FAQ) — criar `src/pages/*.astro`; o `sitemap` já cobre rotas novas.
- **CMS headless** — só se o time de conteúdo deixar de ser quem escreve código; a separação
  dado/apresentação já está pronta para isso.
- **Idioma adicional** — `lang` e `og:locale` estão em um único lugar (`BaseLayout`), mas o conteúdo
  precisaria de uma estrutura por idioma.
