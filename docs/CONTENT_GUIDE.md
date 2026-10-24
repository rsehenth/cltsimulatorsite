# Guia de conteúdo — site CLT Simulator

Este arquivo é a regra do que pode ser escrito no site. Ele existe porque o maior risco de um site de
jogo em desenvolvimento não é ficar feio — é prometer o que ainda não existe.

## Tom editorial

- **Português do Brasil, direto, com a sátira do jogo.** O site fala como o Cleiton fala com o
  vizinho: sem jargão de marketing, sem "mergulhe em uma jornada épica", sem adjetivo vazio.
- **A piada é do mundo, não do visitante.** "O mercado pede experiência. Cleiton pede uma chance."
  ri da estrutura. Nunca ri de quem está desempregado.
- **Frase curta, fato concreto.** "Seis cômodos, objetos e passagem do tempo." é melhor que
  "ambientes ricos e detalhados".
- **Nada de superlativo sem prova.** Sem "o simulador mais realista", sem "milhões de jogadores",
  sem número que não exista em dado do projeto.
- **Estado sempre explícito.** Protótipo jogável, em desenvolvimento, demo prevista para 2027. O texto
  nunca deixa o leitor supor que o jogo já está pronto para comprar.
- **Nomes oficiais com a grafia do jogo**, sempre: WinTário OS, FudidIn, ZapZap, PomboMail, Tinderella,
  Cleiton. Não "o sistema operacional", não "Fudim", não "Clayton".

## A história, do jeito que o site conta

Cleiton é um jovem brasileiro que estudou, tirou seus diplomas e acreditou no roteiro que venderam
para ele: estude, trabalhe duro, tenha futuro. Ao terminar a formação, descobre que o mercado pede
experiência para quem nunca teve chance de conseguir experiência. Com os boletos chegando e a casa
onde mora com a mãe em risco, ele tem **cinco dias** para tentar mudar de vida.

O jogo é a rotina dessa semana: o quarto, a casa, o bairro, o computador, o celular, as candidaturas,
as entrevistas e os absurdos cotidianos — em pixel art, com humor e com aperto.

**Limites do que se pode afirmar sobre a narrativa:** o protótipo tem objetivo único (conseguir um
emprego nos cinco dias), eventos narrativos, escolhas com consequência e checkpoints diários.
**Não** se fala em múltiplos finais, em romance fechando final, em DLC, em tradução, em preço, em
data de lançamento — nada disso está confirmado no material de referência.

## Terminologia

| Termo | Como usar |
| --- | --- |
| **CLT Simulator** | Nome do jogo, sempre com as duas palavras, `CLT` em caixa alta |
| **Cleiton** | Protagonista. Nunca "o personagem principal" no lugar do nome |
| **Protótipo jogável** | Estado atual. Não é demo, não é beta aberto, não é Early Access |
| **Em desenvolvimento ativo** | Detalhe do estado |
| **Demo prevista para 2027** | Previsão, não data. Nunca "2027" sozinho sem a palavra *prevista* |
| **Frentes construídas** | As 8 áreas que já funcionam no protótipo |
| **Áreas de sistema** | As 12 divisões do HUD interno do jogo |
| **Frentes planejadas** | O que está no plano e **não** funciona ainda |
| **WinTário OS** | Sistema operacional satírico do jogo (PC) |
| **FudidIn** | Rede profissional satírica |
| **ZapZap** | Mensageiro do celular |
| **PomboMail** | E-mail do WinTário OS |
| **Tinderella** | App de relacionamento planejado no celular |
| **Upgrade gráfico** | Evolução de arte prevista; os sistemas já funcionam com a arte atual |

## Os cinco estados de uma funcionalidade

Definidos em `src/data/game.ts` como `WorkStatus`; o rótulo é gerado por `STATUS_LABEL`, a cor pela
classe do estado. Não existe sexto estado.

| Valor | Rótulo público | Significa |
| --- | --- | --- |
| `done` | Implementado | Funciona no protótipo de hoje |
| `active` | Sistema ativo | Rodando e conectado ao resto |
| `base` | Base de jogo | Estrutura existente, ainda sem conteúdo refinado |
| `proto` | No protótipo | Presente no protótipo, em tratamento |
| `planned` | Planejado / não implementado | **Não funciona.** Está no plano |

Regra de ouro: **uma linha de `planned` nunca pode mudar de status porque "parece pronta".** O status
muda quando o time do jogo confirma — e a fonte da verdade é o roadmap de referência, não o site.

## Como atualizar o roadmap

1. Abra `src/data/roadmap.ts`.
2. Edite a lista certa:
   - `builtFronts` — as frentes entregues no protótipo (Bloco A);
   - `systemAreas` — as 12 áreas do HUD de sistemas (Bloco B);
   - `plannedFronts` + `nextMilestone` — o que vem, e o próximo grande passo (Bloco C);
   - `artUpgrade.areas` + `artPhases` — evolução gráfica e as três fases (Bloco D/E).
3. Cada item é um `RoadmapItem`: `icon`, `title`, `text`, `status`, `items[]`.
   - `status` só aceita os cinco valores acima (o `astro check` barra o resto);
   - `items` pode ficar vazio (`[]`) em uma frente planejada — sem bullet não há lista inventada;
   - `icon` precisa ser um nome existente em `src/data/sprites.ts`; para um ícone novo, desenhe a
     grade 16×16 lá primeiro.
4. **Não edite as contagens.** `counts` é derivado (`builtFronts.length` etc.) e atualiza os HUDs
   sozinho.
5. Rode `npm run check && npm run build`. Se o texto de uma frente planejada agora descreve algo que
   já funciona, mova o item de lista em vez de reescrever o rótulo.

## Como inserir screenshots

Enquanto não existir captura autorizada, a galeria mostra o estado **"Prévia a caminho"** — uma tela
desligada com o sprite da cena. Isso é decisão de produto, não bug visual: não há screenshot do jogo
para publicar, e uma imagem gerada por IA seria uma mentira sobre o produto.

Para publicar uma captura real:

1. Coloque o arquivo em `public/assets/screenshots/` (ex.: `quarto-01.png`), com o original mantido
   fora deste projeto e o direito de uso confirmado.
2. Em `src/data/game.ts` → `gallery`, preencha na entrada correspondente:
   ```ts
   { title: 'Quarto do Cleiton', note: 'O ponto de partida de toda partida.',
     icon: 'bed', src: '/assets/screenshots/quarto-01.png', width: 1280, height: 720 }
   ```
3. `src`, `width` e `height` são o que faz o card trocar de "prévia" para imagem: sem `src`, o
   `<img>` nem é renderizado. `width`/`height` evitam salto de layout.
4. O texto do `alt` é gerado a partir de `title` ("… — captura do protótipo de CLT Simulator"). Se a
   imagem precisar de descrição própria, ajuste o `alt` em `Gallery.astro` — nunca esvazie.
5. Regras: captura **do jogo**, sem marca d'água de ferramenta, sem mock-up de loja, sem cena que não
   exista. Proporção 16:9. Uma entrada nova de cena = um item novo em `gallery`.

## Como inserir devlogs

O bloco `Acompanhe o desenvolvimento` hoje é um espaço reservado honesto: ele descreve o que vai
publicar e, enquanto não houver devlogs, mostra `devlog.empty` ("As atualizações do desenvolvimento
entram no ar aqui assim que forem publicadas."). Com o canal do YouTube publicado, o bloco passou a
mostrar o link do canal no lugar dessa frase — é o mesmo `validLinks()` do rodapé, não um link escrito à
mão. **Não existe lista de devlogs implementada** — não escreva posts em HTML solto para "aparecer".

Quando houver devlogs reais, o caminho é:

1. Criar `src/data/devlogs.ts` com um tipo próprio:
   ```ts
   export type DevlogEntry = { date: string; title: string; summary: string; url: string };
   ```
   `date` em ISO (`2027-03-14`), `url` apontando para o post publicado no canal oficial.
2. Importar a lista em `src/components/home/Devlog.astro` e renderizar `<li>` com data, título e link
   externo (`rel="noopener noreferrer" target="_blank"`).
3. Manter o estado vazio como fallback: se a lista estiver vazia, o bloco continua dizendo que ainda
   não há atualização — nunca um item fantasma.
4. Registrar a decisão em `docs/DECISIONS.md` antes de sair do estado atual.

## Como configurar redes sociais

`src/data/social.ts` é a única fonte das redes. Hoje só o YouTube tem URL publicada
(`Mundo de Seh`, `https://www.youtube.com/@mundodeseh`); as outras quatro entradas seguem vazias de
propósito.

1. Preencha `url` com o endereço **absoluto e publicado** (`https://…`).
2. `validLinks()` filtra: entrada sem URL, com placeholder ou relativa não renderiza. Não aparece
   botão cinza nem link quebrado.
3. Ao preencher, o rodapé escreve a frase de acompanhamento montada a partir de `followLine` (antes +
   nome do canal linkado + depois) e o bloco de devlog passa a listar os canais — os dois leem a mesma
   função. Um segundo canal preenchido entra na lista abaixo da frase, sem editar componente.
4. `handle` é o nome legível do canal; sem ele, o rótulo genérico (`YouTube`, `X`) é o que aparece.
5. Link externo é sempre `target="_blank"` + `rel="noopener noreferrer"`, com o aviso textual
   "(abre em nova aba)" para leitor de tela — no rodapé, depois da frase, para não quebrar a leitura.
6. Sem canal oficial: não criar perfil "para o site funcionar".

## Como alterar a previsão da demo

A string "2027" existe em **um** lugar: `game.demo.year` em `src/data/game.ts`.

O que deriva dela: o número grande do hero, a linha `DEMO 2027` do painel de status, o farol do
roadmap e o rótulo `Demo prevista para 2027` do rodapé.

- Mudar o ano: edite `demo.year` e rode `npm run build`. Confira se as frases de `demo.label`,
  `demo.kicker` e `seo.description` continuam coerentes (a descrição de SEO menciona 2027 por extenso).
- Confirmar mês/dia/trimestre: **só quando o time do jogo confirmar por escrito.** Até lá, nada de
  contagem regressiva, nada de "Q1", nada de data no `JSON-LD`.
- Adiar: mesmo caminho, uma linha.
- Cancelar a previsão: remova `demo.year` das composições e deixe o texto dizer que não há data — não
  apague o farol com uma frase otimista no lugar.

## O que nunca entra no site

Download (não existe build público), botão "wishlist", links de Steam/itch.io/Epic, preço, data de
lançamento, contagem regressiva, formulário de newsletter (não há backend), depoimento, número de
seguidores, press quote, screenshot de outro jogo, arte gerada apresentada como arte do jogo,
domínio falso em canonical, pontuação de Lighthouse não medida, qualquer afirmação sobre mecânica que
não esteja no material de referência.
