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
| Breakpoints do documento original | as larguras testadas (1920, 1440, 1366, 1024, 768, 390, 375, 320, e mais a varredura de 280 a 3440 px) reescritas em 21 pontos de quebra próprios: mínimos 1100, 1400, 1600, 2000 e 2400 px; máximos 1080, 980, 900, 860, 820, 780, 680, 640, 620, 560, 520, 480, 460, 420, 380 e 360 px |
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

### 22. Tela ultralarga: o teto do hero é o `h1` em duas linhas, não o gosto

A varredura de responsividade subiu de oito para dezenas de larguras e expôs duas faixas que o brief
não previa. Em cada uma delas havia uma regra do próprio projeto brigando com outra:

- **2000–2399 px.** O hero parou de dominar a primeira dobra: `5,4vw` de título num monitor de 2560 px
  é um `h1` de 138 px perdido num campo de 2560 px, e o inspetor marcou `focal-point`. Correção:
  `--page-max` 1600 px e `--fs-hero` em `5,2vw` nessa faixa.
- **≥ 2400 px.** Sem teto, a mesma conta estoura a coluna do herói e o `h1` quebra em três linhas —
  defeito, não escolha (regra de composição, `DESIGN_SYSTEM.md` §2). O teto de `7.5rem` (120 px)
  mantém duas linhas até 3440 px e **reabre** o `focal-point` acima de ~2670 px. Preferiu-se o título
  em duas linhas: `focal-point` a partir daí fica registrado como custo aceito, não como pendência.

Na mesma passada, duas faixas largas ganharam fundo em vez de margem morta (`--panel-in` na ficha a
partir de 1400 px, painel do devlog em linha inteira a partir de 1100 px) porque vazio ao lado de um
painel é seção mal construída — o inspetor chama isso de `empty-screens`, e estava chamando certo.

### 23. Marca no menu: saiu o logo, ficou o nome

O cabeçalho mostrava o brasão oficial ao lado do nome. Ele saiu por pedido explícito, e o que ficou é
o wordmark tipográfico (`CLT SIMULATOR`), que já é legível sozinho e não depende de raster para
identificar o projeto. Consequências registradas:

- O brasão **não** sumiu do site: continua na arte oficial do hero e na contracapa do rodapé
  (`Footer.astro`, `.backcover__mark`). Nenhum asset foi apagado de `public/assets/branding/`.
- O invólucro `.brand__text` que sustentava marca + nome foi removido junto — markup morto depois da
  saída da imagem, não estilo.
- O link do cabeçalho mantém `href="#home"` e `aria-label` com o nome do jogo: remover a imagem não
  pode tirar o nome que um leitor de tela anuncia.

### 24. Camada de movimento ligada a scroll (`public/js/motion.js`)

Quatro efeitos de progresso mais um opcional, todos escritos sobre a linguagem que já existe (chapa,
cantoneira, HUD), nenhum sobre biblioteca de animação.

- **Tempo próprio.** `--ease-glide: cubic-bezier(0.16, 1, 0.3, 1)` com `--dur-boot: 1100ms` para o que
  o olho acompanha, e `--dur-settle: 450ms` para retorno de hover. O `--dur: 240ms` do resto do site fica
  onde já funcionava (controles), e o reveal de entrada — que tinha um `--dur-slow: 420ms` só para ele,
  escalonado em passos de 70ms — passou para `--dur-boot` com passos de 100ms: 420ms é o tempo que esta
  página lê como seco. O token órfão saiu. Nenhum efeito de progresso usa `transition`: quem suaviza é o
  lerp.
- **`html.js` nasce aqui.** O projeto não tinha classe nenhuma marcando "JavaScript disponível" —
  `reveal.js` se auto-declara aplicando `.reveal`/`.is-d0…4` no próprio elemento. `motion.js` adiciona
  `js` ao `<html>` quando (e somente quando) o movimento é permitido. Todo estado escondido da camada
  nova exige `html.js` **e** `@media (prefers-reduced-motion: no-preference)`, porque o corte global
  de `transition-duration` em movimento reduzido deixaria o recorte permanente se ele dependesse só de
  uma das duas condições.
- **`--spine-x` = 0, largura 4 px.** A linha desenhada é o `::after` de `.timeline__spine`, colado em
  `left: 0` com `width: 4px` — os mesmos 4 px do `::before` que já é o trilho, para o preenchimento
  nascer exatamente em cima da linha existente e não ao lado dela. O progresso entra por
  `transform: scaleY(var(--spine-p))` com `transform-origin: top center`; `--spine-x` não tem papel
  horizontal porque o traço não se move, só cresce.
- **Um listener, um `rAF`, um observer.** `scroll` passivo + `resize`, um único
  `requestAnimationFrame` compartilhado entre espinha e barra, e o `IntersectionObserver` da espinha é o
  mesmo que liga o painel de status. O loop para sozinho quando `|alvo - exibido| < 0,001` em tudo.
  Instrumentado no `dist/` servido com os cabeçalhos reais: **um** listener de `scroll` registrado
  (passivo, na janela), nenhum `wheel`/`touchmove`, e **no máximo 1** callback de `rAF` em voo durante a
  página inteira — o `cancelAnimationFrame` devolve o contador, então não há segunda pilha de loop.
- **Zero shifts que o olho veja.** Somador de `layout-shift` (`hadRecentInput` false) do início ao fim da
  página rolada: **CLS 0,00030** em dois eventos, ambos do carregamento — e 0,00028 antes de o reveal
  mudar de tempo, ou seja, o reveal mais longo não empurra nada (`translate`/`opacity` não movem layout).
  A capa do hero
  não empurra nada: mede 560×452 px com o recorte fechado (`inset(-12px -12px 100%)`) e 560×452 px com
  ele aberto (`inset(-12px)`), e o `cover-open` termina em exatamente 1520 ms (420 de atraso + 1100 de
  duração), uma execução só. Em movimento reduzido o nó nasce com `clip-path: none` e nenhuma animação.
- **O marcador nunca chega antes da linha.** Em 21 paradas de rolagem, o número de passos ainda acesos
  que estão acima do preenchimento já exibido foi **0** em todas — o `is-passed` é calculado do valor
  *exibido*, não do alvo. A espinha com 8 passos fecha em 1,0000 e a barra de sistema chega em 1,0000 no
  fim da página, com o rótulo trocando HOME → JOGO E CONCEITO → ROADMAP. Subir 4200 px de uma vez não
  zera nem reinicia nada: a espinha fora da tela conserva o último valor exibido.
- **Escreve por CSSOM, nunca por marcação.** `element.style.setProperty('--spine-p' | '--p' |
  '--tilt-x' | '--tilt-y', …)` — o que a CSP `style-src 'self'` permite; `<style>` injetado e
  `style=""` não. Medido com os cabeçalhos reais de `public/_headers`: zero violação de CSP, zero erro
  de console, com e sem movimento reduzido.
- **A barra de sistema é cromo, não conteúdo.** `aria-hidden="true"`, `display: none` por padrão e só
  ligada por `html.js`: sem JavaScript ela não existe, e o nome da seção continua vindo da navegação,
  que é conteúdo. O rótulo vem de `.nav__link` (não de `.section__num`, que só existe para duas das três
  seções) e o número decorativo `01` é removido do texto.
- **Suavidade medida, não afirmada.** Amostrador dentro da página, quadro a quadro, durante um rolamento
  real de roda: 231 quadros no trecho, 173 valores distintos de `--spine-p`, preenchimento completo em
  3,5 s, maior variação entre quadros **0,0049** (≈1,9 passos por segundo), zero reversões de progresso.
- **Tilt de 2° é o único efeito opcional aplicado**, e só depois dos quatro primeiros validados:
  `@media (hover: hover) and (pointer: fine)`, `transform` declarado apenas durante o `:hover` (fora
  dele o painel não ganha contexto de empilhamento), reset em `pointerleave` e `blur`. Medido com mouse
  real: ângulo máximo escrito 1,95°, `offsetWidth/offsetHeight` idênticos antes, durante e depois
  (1112×258), e em emulação de toque nenhuma variável chega a ser escrita.

### 25. Duas grades esmagavam o próprio texto — e o ponto cego do gate

Ao validar `scrollWidth === clientWidth` para a camada de movimento, apareceram dois defeitos de layout
**anteriores a ela** (reproduzem com JavaScript desligado):

- `ArtEvolution.astro`: `.art__intro` era `auto minmax(0,1fr) auto`, e o selo e o medidor —
  `inline-flex`, com `max-content` igual ao texto inteiro em uma linha — ditavam as colunas laterais. A
  chapa de ícone de 48 px esticava para 258 px; o parágrafo ficava com 154 px em 1024 px e **0 px** em
  celular, uma palavra por linha, cortado na borda (bloco de 1058 px de altura em 390 px).
- `index.astro`: `.mechanics__grid` usava `minmax(320px, 1fr)`, que num container de ~288 px empurrava
  16 px de texto para fora da tela em 320 px.

Corrigidos com uma linha de intenção cada um (selo e medidor na coluna do texto; `min(320px, 100%)`).
Depois: `scrollWidth === clientWidth` nas 41 larguras medidas de 320 a 3440 px, e o bloco de arte de
1058 px para 426 px em 390 px.

**O registro anterior estava errado e esta é a correção.** A baseline antiga dizia "nenhum transbordo
horizontal (0 px)" em 280 e 300 px. O `inspect.mjs` mede se a página **rola** para os lados; como
`body { overflow-x: hidden }` corta o conteúdo em vez de deixá-lo rolável, um layout estourado passa no
gate sem aparecer. A medição por `documentElement.scrollWidth` pega. Nas duas larguras abaixo do piso do
brief (280 e 300 px) ainda existem 3 px e 23 px de conteúdo cortado — a placa de ícone do marco, num
trilho `auto`, e o rótulo `white-space: nowrap` ao lado. Ficam registrados como limite conhecido, não
como corrigidos.

### 26. O fim da página: a faixa de demo encosta no rodapé

Medido em navegador real a 1900 px: entre o último pixel do campo dourado (`DemoBeacon`) e o primeiro da
contracapa havia **352 px de nada** — `#roadmap` com `padding-bottom: var(--section-space)` (176 px) e
`.backcover` com o mesmo `margin-top` (176 px). Duas regras que separam conteúdo de conteúdo, somadas
depois de uma faixa full-bleed que já fecha o documento.

Saída: `#roadmap { padding-bottom: 0 }` e nenhum `margin-top` no rodapé. A faixa continua com a própria
margem de cima, então o ritmo entre blocos da seção não muda; o que muda é que o ouro vira o último campo
da página, e a borda `--gold-deep` dele encontra a `--line` da contracapa sem tela vazia no meio.
Depois: gap medido 0 px em 1900 e 390 px, documento 352 px mais curto, `scrollWidth === clientWidth`
mantido, e as contagens do gate inalteradas (76/65/61/57/71/37/33/11 elementos em movimento, 0 console
error, nenhuma tela abaixo de 15% de preenchimento).

*A frase acima registrou o piso de 15% e por isso deixou passar a regra do inspetor, que marca tela
quase vazia abaixo de **20%** — e só a partir de duas. O caso voltou na decisão 27.*

### 27. A costura entre seções: quem carrega o respiro é o furo

O gate das oito larguras voltou com **11 FAIL**, um fora dos dez ids registrados: `empty-screens` em
1440 px — duas das doze telas amostradas abaixo de 20% de preenchimento (tela 7 a **0,17**, tela 12 a
**0,19**). Medido o motivo, era o mesmo empilhamento da decisão 26, só que no meio da página:

| Costura antes do `#roadmap` (1440 px) | |
| --- | --- |
| `padding-bottom` de `#jogo` (`--section-space`) | 172,8 px |
| margem de cima da perfuração | 56 px |
| a linha de pontos em si | 12 px |
| margem de baixo da perfuração | 56 px |
| `padding-top` de `#roadmap` (`--section-space`) | 172,8 px |
| **chão vazio entre o último texto e o título 03** | **469,6 px** |

Três regras de respiro para separar duas seções, quando uma linha de pontos já diz "aqui vira a folha".
A tela 12 (a lista de frentes planejadas, em itens de 21 px de texto sobre 108 px de passo) era
consequência: com o documento empurrado, ela caía inteira numa faixa de chão.

**Escolha:** o furo passa a ser o dono do respiro, e as seções vizinhas abrem mão do padding que
empilharia nele — `.perforation { margin-block: calc(var(--section-space) / 2) }` e
`#jogo, #roadmap { padding-block: 0 }`. Custo 184,8 px em 1440 px (era 469,6) e 100 px em 390 px
(era 227). Nenhuma cor nova, nenhum token novo, nenhum `style=""`.

Meio caminho não resolveu: só cortar a margem do furo e o `padding-top` da seção seguinte deixou as duas
telas em 0,14 e 0,17 — o `padding-bottom` da seção de cima ainda era um respiro inteiro. Teve de sair dos
dois lados.

Depois, em navegador real: tela 7 a **0,29** e tela 12 a **0,34** em 1440 px, gate de volta a
**10 FAIL / 4 WARN** com os mesmos dez ids, documento 397 px mais curto em 1440 px (13.906 → 13.509),
`scrollWidth === clientWidth` de 320 a 3440 px (+3 px em 300, +23 px em 280, como antes), zero console
error nas oito larguras. As contagens de movimento mudaram com a paginação: **77/70/65/54/71/37/35/11**
(eram 76/65/61/57/71/37/33/11) — todas acima da meta de oito da skill.

### 28. Passada de design (taste, impeccable, UI/UX Pro Max, critique, jury)

Rodada de revisão com o inspetor da skill `design-taste-frontend` sobre `dist/` e leitura das capturas.
Seis mudanças, todas dentro do vernáculo existente (nenhum token de cor novo, nenhum `style=""`):

- **O painel de status nunca abria.** `.hud__panel` nasce recortado (`clip-path` fechado) e o observer
  olhava o próprio painel: o navegador mede a interseção do que está visível, então um recorte de altura
  zero nunca "entra na tela" e as três leituras (cada uma com o próprio `data-reveal`, também dentro do
  recorte) ficavam em opacidade 0. Agora o observer olha o contêiner (`.wrap`) e as linhas acendem em
  cascata por CSS a partir de `.is-boot`, sem observer por linha.
- **Rótulo solto "HOME" no canto do cabeçalho saiu.** Repetia o texto da navegação logo ao lado e, no
  celular, aparecia duas vezes na mesma linha. A seção atual passa a marcar o próprio link
  (`.is-current`, sublinhado dourado + texto claro, `aria-current="location"`). A barra de progresso
  continua. O `.sysbar__label` e `data-sysbar-label` deixaram de existir.
- **No celular o `h1` fica na primeira dobra** (≤560 px): a capa vira só a arte; a legenda de HUD e os
  três fatos (Situação/Demo/Gênero) saem porque o selo de estado e o 2027 vêm logo abaixo. Antes o título
  começava a ~600 px de altura em 390 px. Acima de 1081 px o selo de estado do texto some, porque o chip
  verde do cabeçalho diz o mesmo — antes o estado aparecia três vezes na mesma tela.
- **Faixa "Acompanhe o desenvolvimento"** (`Devlog.astro`): em ≥1100 px vira duas metades, texto à
  esquerda e o canal publicado (rede + nome) à direita, como bloco de ação. Fechou o `lopsided` do gate.
  Sem canal publicado, volta o aviso de vazio, como antes.
- **Galeria "Prévia a caminho":** sprite em 96 px (6× da grade) em vez de 48 px; a 48 px o ícone sumia
  no centro de uma tela 16:9.
- **`--fs-data` de 13 px para 14 px.** São ~90 rótulos de HUD em caixa alta com tracking; o piso subiu
  um passo por leitura. Contraste não muda. Tamanhos em uso: 14/15/16/… (a contagem continua em 10–11).

Gate depois da passada, nas oito larguras do brief e na varredura 280–3440 px: os mesmos dez ids da
baseline (decisão 8 e tabela acima) mais, só em larguras ≥1920 px, `ragged-edges` (WARN) e, no meio
da varredura, `no-title`. Este último é artefato do inspetor: nas larguras fora do mapa de alturas ele
usa viewport de `largura × 0,625` (320 px de largura = 200 px de altura), e o `h1` fica a ~374 px do topo
em 320 px. Em 390 px (viewport 844) o `h1` está na primeira dobra. `off-centre` (WARN, 103 px × 121 px
em 1366 px) e `ragged-edges` apareceram nesta medição e **não foram comparados com o build anterior**
nessas larguras — a baseline antiga não os registra; o estouro de 280/300 px é o limite já conhecido.
`npm audit`: 0 vulnerabilidades.

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
| `focal-point` (só acima de ~2670 px) | Ver decisão 22: o teto de 120 px do hero existe para o `h1` não quebrar em três linhas |

O que o gate marcou e **foi corrigido**: títulos quebrando em três linhas (medida em `rem`, escala
`--fs-display`, `lines={[]}` no `SectionHeading`), o mesmo em 280–360 px no título da ficha (margem
interna do papel abre e `--fs-lead` local desce antes de encolher a voz do título), contraste do rótulo
dourado sobre papel, contraste do texto do carimbo (tamanho próprio `--fs-stamp`, sempre em faixa de
texto de exibição), **contraste do selo "Planejado / não implementado" a 4,4:1** (`--gold-deep` é
bordas e numeração; para rótulo de 13 px nasceu `--gold-planned`, 4,9:1 no pior dos quatro fundos),
ícones da galeria a 16 px por referência circular de token, navegação cortando "ROADMAP" em 320 px, o
transbordamento horizontal de 106 px em 1024 px causado pela linha de marca do cabeçalho, e a marca
d'água do primeiro destaque passando por cima do título (`z-index: 1` no bloco de texto; a marca fica
atrás, como sempre deveria ter ficado).

### Baseline medido deste build (para diferenciar escolha de regressão)

- `lint.mjs` sobre `src/`: **50 FAIL, 2 WARN** — todos os padrões da tabela acima, mais o travessão
  de pontuação do português. Decidido não poluir o código com 50 comentários
  `taste-skill-ignore`: a linha de base é este registro. A camada de movimento acrescentou exatamente
  duas linhas marcadas (o gradiente do trilho desenhado e o anel de tinta do marcador, ambos com
  `taste-skill-ignore` na própria linha) — a contagem voltou a 50/2, então um FAIL a mais continua
  sendo regressão, não barulho novo.
- `inspect.mjs` sobre `dist/` nas oito larguras do brief (1920/1440/1366/1024/768/390/375/320 px),
  rodado de novo neste build: **10 FAIL, 4 WARN**, os mesmos dez ids de sempre
  (`eyebrow, mono, numbering, micro-label, gradient, shadow, button-fx, hairline, icon-cards,
  few-pictures`), zero console error, nenhuma marcação de transbordo.
- **Piso de preenchimento por tela, na mesma passada** (o inspetor marca abaixo de 20% e só a partir de
  duas telas, em largura ≥1100 px): mínima de **0,24** em 1024 px, **0,25** em 1440 px, **0,26** em
  1366 px, **0,31/0,40/0,42/0,57** nas quatro menores. Em 1920 px há **uma** tela a **0,15**: a lista
  "O que vem por aí" — linhas de 108 px de passo com nome, guia pontilhada e estado, texto de corpo a
  15/16 px, sobre o fundo da página. É o bloco mais arejado do site, não um vazio: tem título, nota,
  aviso de estado e dez fileiras de conteúdo real. Ficou como está, sozinho, porque uma tela de descanso
  por página é a conta da própria skill. Se uma segunda entrar na mesma varredura, o caminho já decidido
  é o campo de cor que `.systems` usa (decisão 22), não mais espaço.
  Duas telas abaixo do piso em 1440 px foram corrigidas na decisão 27.
- `inspect.mjs` em **37 larguras de 280 a 1920 px** (1920, 1668, 1600, 1536, 1440, 1366, 1280, 1194,
  1080, 1024, 962, 900, 834, 820, 768, 740, 700, 640, 600, 560, 540, 480, 430, 428, 414, 412, 393, 390,
  384, 380, 376, 375, 360, 344, 320, 300, 280): **as mesmas 10 FAIL, 4 WARN** — nenhuma específica de
  largura. E acima do brief, em 2048/2560/2880/3440 px, entra apenas o `focal-point` de ≥2670 px
  (decisão 22). *Esta varredura é do build anterior à camada de movimento; não foi repetida depois dela
  e não deve ser lida como se tivesse.*
- **Transbordo horizontal, medido neste build por `documentElement.scrollWidth` em navegador real, nas
  41 larguras** (as 37 acima + 2048/2560/2880/3440): `scrollWidth === clientWidth` e nenhuma rolagem
  lateral de **320 a 3440 px**. Abaixo do piso do brief, 300 px estoura 3 px e 280 px estoura 23 px —
  conteúdo cortado por `body { overflow-x: hidden }`, invisível ao `inspect.mjs` (decisão 25).
- **Zero marcação de defeito real** nas 39 larguras a partir de 320 px: nenhum título em três
  linhas, nenhum contraste reprovado, nenhuma imagem quebrada, nenhum emoji, nenhum console error. Tela
  quase vazia é a única marcação que ainda aparece, e só em 1920 px, sozinha — o piso por largura está no
  item acima.
- Elementos que se movem por largura (as oito do brief): **77/70/65/54/71/37/35/11** — antes da camada
  de movimento era 58/47/43/39/51/33/31/6, e a medição anterior a esta correção de costura dava
  76/65/61/57/71/37/33/11; a paginação mudou com o documento mais curto. Todos acima da meta de oito da
  skill; o acréscimo é a transição da espinha, o acender dos marcadores, a abertura da capa e do painel,
  e o tilt.
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
