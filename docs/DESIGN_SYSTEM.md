# Design system — CLT Simulator

A identidade não foi inventada do zero: ela vem de `Roadmap-v1-CLT.html` (documento de referência do
projeto, somente leitura) e da arte oficial do logo. Este arquivo documenta como aquele vocabulário
virou sistema. **Nenhum componente declara cor, tamanho de fonte ou espaçamento próprio** — tudo sai
de `src/styles/tokens.css`.

## 1. Cores

### Campos (fundos)

| Token | Valor | Uso |
| --- | --- | --- |
| `--ink` | `#081426` | Fundo do site inteiro: a capa azul-marinho da carteira de trabalho |
| `--ink-deep` | `#050e1b` | Rebaixo atrás das chapas |
| `--panel` | `#12283f` | Painel azulado elevado |
| `--panel-in` | `#0c1d31` | Painel interno, células de grade, linhas de HUD |
| `--plate` | `#0a1a2c` | Prancha de ícone pixel, tela da galeria desligada |
| `--paper` | `#eae4d3` | Papel da ficha de inscrição — a cor do papel no próprio logo |
| `--paper-deep` | `#ded6c0` | Papel em sombra de dobra |

O escurro é declarado duas vezes de propósito: `<meta name="color-scheme" content="dark">` no
`BaseLayout` e `color-scheme: dark` no `:root` de `tokens.css`. A meta cobre o navegador antes do CSS
chegar; a propriedade cobre barra de rolagem, controles nativos e o realce do "localizar na página".
`<meta name="theme-color">` vale `#081426`, o mesmo `--ink` — se um dia o fundo mudar, mudam os três.

### Linhas e metais

`--line` `#24425f` · `--line-soft` `#1a3450` · `--steel` `#8aa6c0` (texto secundário sobre azul).

### Tintas

| Token | Valor | Uso | Nota de contraste |
| --- | --- | --- | --- |
| `--gold` | `#f2b53c` | Acento principal, rótulo ativo, títulos de destaque | texto grande sobre `--ink` |
| `--gold-deep` | `#a97a1c` | Numeração decorativa (`01`, `02`, `03`) | discreto por intenção |
| `--cyan` | `#5ecfe0` | Foco, sistema ativo, número 2027 | — |
| `--green` | `#5fd08a` | Estado implementado, luz "ao vivo" | — |
| `--coral` | `#ef6a5a` | Alerta leve, nota de plano | — |
| `--stamp` | `#d8352a` | Vermelho do carimbo "SEM VAGAS" | texto de exibição (≥20px bold) sobre papel |
| `--stamp-deep` | `#b32a1f` | Fundo do botão de carimbo | 6,1:1 com branco |
| `--text` | `#e7eff7` | Texto corrido sobre azul | — |
| `--white` | `#f6f9fc` | Títulos | — |
| `--ink-on-paper` | `#14202f` | Texto corrido sobre papel | — |
| `--muted-on-paper` | `#465a70` | Nota secundária sobre papel | — |

Regras de tinta:

- O vermelho do carimbo **nunca** é usado pequeno sobre papel. Onde aparece como texto, usa
  `--fs-stamp` (piso de 20 px em negrito) e continua dentro da faixa de texto de exibição.
- Verde, ciano e dourado são códigos de **estado**, não decoração. Trocar a cor de um rótulo de status
  é mentir sobre o projeto.
- Contraste mínimo verificado: 4,5:1 em texto corrido, 3:1 em texto de exibição e em elementos de UI.

### Tintas derivadas

Para o azul-marinho e o papel não virarem uma sopa de hexadecimal, as poucas cores que existem só
para um contexto específico também têm nome — e só aparecem em `tokens.css`:

| Token | Valor | Contexto |
| --- | --- | --- |
| `--text-soft` | `#cddced` | Texto de apoio sobre azul: listas marcadas, notas de card |
| `--steel-dim` | `#7f9ab3` | Legenda discreta (crédito de arte, caption da capa) |
| `--gold-lift` | `#ffc85a` | Hover do botão de chapa |
| `--gold-ink` | `#5c410c` | Rótulo queimado sobre etiqueta dourada |
| `--ink-on-gold` | `#24344a` | Azul escuro sobre o campo dourado do farol de 2027 |
| `--link-on-paper` | `#1c4f77` | Link sobre papel |
| `--white-warm` | `#fff6f4` | Texto claro sobre a tinta do carimbo |
| `--window-blue` / `--window-blue-deep` | `#2f7fc1` / `#1d5b8d` | Barra de janela do WinTário no painel de status (a mesma tinta do sprite `B`) |
| `--window-ink` | `#eaf4fb` | Texto da barra de janela |

Um componente que precisa de uma tinta nova **acrescenta um papel** aqui. Não escreve hexadecimal
solto no `<style>`.

## 2. Tipografia

Três papéis, três famílias, todas do sistema — nenhuma requisição externa:

| Papel | Família | O que representa |
| --- | --- | --- |
| `--font-display` | Bahnschrift, DIN Alternate, Franklin Gothic Medium | Títulos, carimbo, números: a letra de formulário |
| `--font-text` | Segoe UI Variable Text, Segoe UI, Helvetica Neue | Leitura corrida |
| `--font-data` | Cascadia Mono, Consolas, ui-monospace | Rótulos de HUD, serial, etiquetas de estado |

Escala (oito papéis nomeados — nenhum componente cria `clamp` próprio):

| Token | Faixa | Para quê |
| --- | --- | --- |
| `--fs-hero` | `clamp(2.5rem, 5.4vw, 5.5rem)` (5.5rem a partir de 1600 px) | O `h1` da capa |
| `--fs-num` | `clamp(2.25rem, 6vw, 4rem)` | O número 2027 |
| `--fs-display` | `clamp(1.375rem, 4vw, 3.125rem)` | Títulos de seção |
| `--fs-lead` | `clamp(1.375rem, 2.8vw, 2rem)` | Frase-destaque, título da ficha |
| `--fs-title` | `clamp(1.125rem, 1.9vw, 1.5rem)` | Cabeçalho de card e de painel |
| `--fs-body` | `clamp(1rem, 1.05vw, 1.125rem)` (1.1875rem a partir de 1600 px) | Leitura corrida |
| `--fs-note` | `0.9375rem` | Nota secundária |
| `--fs-data` | `0.8125rem` | Rótulo de HUD — **o piso, nunca menor** |
| `--fs-stamp` | `clamp(1.25rem, 2.4vw, 1.75rem)` | O carimbo "Sem vagas" |

Entrelinha: `--lh-hero` 0.92 · `--lh-display` 1.04 · `--lh-body` 1.58.

Regras de composição:

- Título de seção é sempre `text-transform: uppercase` com `letter-spacing` discreto.
- Rótulo de HUD (`--font-data`) usa `letter-spacing` entre 0.06em e 0.2em e caixa alta. É o código
  visual do estado, não parágrafo.
- **Nenhum título passa de duas linhas em nenhuma largura.** Quando uma frase não cabe, `SectionHeading`
  recebe `lines={[…]}` com uma frase por `<span class="section__line">` — a quebra é decidida no
  conteúdo, não no acaso da largura. Se duas frases ainda não cabem, corta-se palavra.
- Medida em `rem`, nunca `ch`, nos títulos: `ch` herda o corpo do contêiner e espreme o display.
  Texto corrido usa `rem` também (`34rem` no hero, `--sheet-max` na ficha).

## 3. Grade e espaçamento

| Token | Valor | Uso |
| --- | --- | --- |
| `--page-max` | `1240px` (1400 px a partir de 1600 px) | Largura da coluna central |
| `--sheet-max` | `760px` | Largura da "folha" (ficha de inscrição) |
| `--gutter` | `clamp(1rem, 3.4vw, 2.5rem)` | Respiração lateral |
| `--gap` | `clamp(0.875rem, 1.4vw, 1.25rem)` | Entre células |
| `--section-space` | `clamp(5.5rem, 12vw, 11rem)` | Entre seções |
| `--block-space` | `clamp(1.75rem, 3.4vw, 3rem)` | Entre blocos de uma seção |
| `--scroll-offset` | `6rem` (8.5rem abaixo de 860 px) | Compensa a capa fixa nas âncoras |

`.wrap` aplica a coluna + o respiro lateral; `.section` aplica o espaço vertical. Toda seção do site é
`<section class="section"><div class="wrap">…`.

## 4. Chapas, cantoneiras e perfurações (o vernáculo)

| Classe | O que faz |
| --- | --- |
| `.plate` / `.plate--sm` / `--md` / `--lg` | Prancha de ícone com bisel interno; define `--icon` (32/48/96 px) |
| `.cornered` | Cantoneiras de HUD nos quatro cantos de um painel (via `::before`/`::after`) |
| `.sheet` | Bloco com aparência de formulário dentro do painel |
| `.perforation` | Linha pontilhada que separa as três seções — o picote do papel |
| `--edge: 2px` | Espessura de toda borda de chapa |
| `--corner: 14px` | Comprimento da cantoneira |
| `--offset` / `--offset-sm` | Sombra dura (`6px 6px 0` / `4px 4px 0`) — a chapa deslocada, nunca blur |

Sombra aqui é **projeção de chapa**, não elevação material: sempre sólida, sempre sem raio de
desfoque, sempre no mesmo vetor. É o que faz o site parecer o HUD do jogo e não um card de dashboard.

## 5. Estados

Os cinco estados reais do projeto, com rótulo e cor únicos (`src/data/game.ts`):

| `WorkStatus` | Rótulo oficial | Tinta | Classe |
| --- | --- | --- | --- |
| `done` | Implementado | `--green` | `.status--done` |
| `active` | Sistema ativo | `--cyan` | `.status--active` |
| `base` | Base de jogo | `--steel` | `.status--base` |
| `proto` | No protótipo | `--gold` | `.status--proto` |
| `planned` | Planejado / não implementado | `--coral` | `.status--planned` |

Padrão em todos os cards: o estado aparece **como texto** (rótulo), não só como cor — quem não
distingue as tintas lê a mesma informação. Variações de cor por estado usam classe
(`.hud__row--green`, `.systems__cell--proto`), nunca `style="--tone: …"` inline.

## 6. Botões, links e foco

- `.btn` — botão de chapa: borda de 2 px, fundo sólido, sombra dura, `padding` de 0.95rem que resulta
  em ~46 px de altura (área de toque confortável), `translate` de 2 px ao pressionar
  (o botão afunda na mesa).
- `.btn--ghost` — a mesma caixa, fundo transparente, para a ação secundária.
- Foco visível em todo elemento interativo: `:focus-visible` com `--focus` (`3px solid var(--cyan)`)
  e `outline-offset: 3px`. Nunca `outline: none` sem substituto.
- `.skip` — link "Ir para o conteúdo", escondido até receber foco.
- Âncoras internas compensam a capa fixa com `scroll-margin-top: var(--scroll-offset)`.

## 7. Ícones pixel

`src/data/sprites.ts` guarda a paleta de 17 tintas e 29 sprites de 16×16, um caractere por pixel
(`.` = vazio). No build, `PixelSpriteSheet.astro` comprime cada sprite em um `<path>` por cor e emite
um `<symbol id="px-<nome>">` — **só para os sprites realmente usados na página**.

```astro
<PixelIcon name="bed" />                 {/* decorativo: aria-hidden */}
<PixelIcon name="letter" label="Ficha" /> {/* com significado: vira role="img" */}
```

O tamanho vem do contêiner: `.plate--md { --icon: var(--icon-md) }` e `.pixel { width: var(--icon) }`.
Nada de `size` por prop e nada de estilo inline — é isso que permite `style-src 'self'`.

Regras: `shape-rendering: crispEdges` sempre; dimensão sempre múltipla de 16; **emoji proibido**;
ícone novo nasce na grade 16×16, nunca importado de biblioteca.

## 8. Movimento

Quatro camadas, todas só em `transform`/`opacity`, todas com fallback em `prefers-reduced-motion`:

1. **Movimento de assinatura:** o carimbo "SEM VAGAS" desce sobre a ficha (`@keyframes ficha-hit`,
   escala 2.4 → 0.96 → 1 com leve rotação de -9°).
2. **Entrada escalonada:** elementos com `data-reveal` ganham `.reveal` + `.is-d1…d4` por
   `IntersectionObserver` e entram com `translateY(18px)` + opacidade, 60–90 ms defasados dentro do
   mesmo grupo irmão. As classes só existem depois que o script roda — sem JavaScript, nada fica escondido.
3. **Feedback de controle:** hover e active em botões, links de navegação, linhas de HUD e cards.
4. **Elemento vivo:** a luz `--green` do cabeçalho e do hero pisca em `steps(1)` — o "em
   desenvolvimento" precisa parecer ligado, não animado.

## 9. Responsividade

| Largura | O que muda |
| --- | --- |
| ≥ 1600 px | `--page-max` 1400 px, `--fs-hero` sobe para 5.5rem, `--fs-body` 1.1875rem, ícones maiores |
| 1440 / 1366 px | Layout de duas colunas no hero, grades 3× no roadmap |
| ≤ 1080 px | Chip de estado sai do cabeçalho (o estado continua no hero e no painel) |
| ≤ 980 px | Hero vira coluna única, com a capa do logo primeiro |
| ≤ 900 px | Destaques empilham |
| ≤ 860 px | Cabeçalho em duas linhas; numeração `01/02/03` sai da navegação; `--scroll-offset` sobe para 8.5rem |
| ≤ 620 px | Ficha de inscrição em coluna única; o carimbo sai da posição absoluta e entra no fluxo |
| ≤ 560 px | Fatos da capa em 2 colunas; botões do hero em largura total |
| ≤ 420 px | Marca do logo reduzida |
| ≤ 380 px | Navegação vira grid de três colunas iguais (em vez de tira rolável cortando "ROADMAP") |

Testado em 1920, 1440, 1366, 1024, 768, 390, 375 e 320 px — sem rolagem horizontal em nenhuma delas.

## 10. Exemplo de uso

```astro
---
import SectionHeading from '../ui/SectionHeading.astro';
import FeatureCard from '../game/FeatureCard.astro';
---

<section class="section" id="jogo" aria-labelledby="jogo-title">
  <div class="wrap">
    <SectionHeading
      num="Seção 02"
      id="jogo-title"
      lines={['Cleiton pede uma chance.']}
      note={game.category}
    />
    <FeatureCard icon="crt" title="Computador e WinTário OS" text="…" />
  </div>
</section>
```

Checklist antes de subir um componente novo:

- [ ] Usa `--page-max`/`.wrap` e os tokens de espaço, sem `px` solto.
- [ ] Nenhum `style=""` inline, nenhum `<script>` inline.
- [ ] Título com no máximo duas linhas em 320 px.
- [ ] Estado expresso em texto, não só em cor.
- [ ] Foco visível e área de toque ≥ 44 px nos controles.
- [ ] Ícone pixel com `aria-hidden` (decorativo) ou `label` (significativo).
- [ ] Funciona com JavaScript desativado.
