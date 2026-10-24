# AGENTS.md — CLT Simulator (site oficial)

Documento de trabalho para qualquer agente que mexer neste repositório. Leia antes de editar.

## O que este projeto é

Site oficial de **CLT Simulator**, jogo indie brasileiro de simulação de vida em pixel art.
Uma página estática em Astro, em português do Brasil, com três seções: **HOME**, **JOGO E CONCEITO**, **ROADMAP**.

Não é um painel SaaS, não é loja, não é landing page de captação. A identidade é a de um jogo:
carteira de trabalho, carimbo, HUD, chapas, cantoneiras e tipografia de formulário.

## Limites inegociáveis

- **Raiz do projeto:** `D:\Testes\Projects\cltsimulator site`. Nenhum arquivo do site nasce fora dela.
- **Referência somente leitura:** `E:\RDImortal\Roadmap-v1-CLT.html` e `E:\RDImortal\assets\*`.
  Não alterar, não mover, não sobrescrever, **não criar arquivos novos dentro de `E:\RDImortal`**.
  Copiar um recurso para `public/assets/` é permitido, mantendo o original intacto e confirmado o direito de uso.
- **Não acessar outros projetos** do computador, nem o código-fonte do jogo, por iniciativa própria.
- **Não executar Git** sem pedido explícito. Sem commits, sem push, sem criação de repositório.
- **Não fazer deploy** sem pedido explícito (ver `docs/CLOUDFLARE_DEPLOY.md`).
- **Não instalar dependências** sem justificativa técnica registrada em `docs/DECISIONS.md`.
- **Não conectar contas, domínios ou repositórios** sem autorização.
- Na dúvida sobre qual pasta recebe um arquivo, **pergunte o caminho exato antes de criar**.

## Verdades de conteúdo (nunca improvisar em cima delas)

| Fato | Onde vive |
| --- | --- |
| Estado: protótipo jogável, em desenvolvimento ativo | `src/data/game.ts` → `game.status` |
| Demo **prevista para 2027**, sem mês, dia ou trimestre | `src/data/game.ts` → `game.demo.year` (única fonte do "2027") |
| Protagonista **Cleiton**, prazo de **cinco dias** | `src/data/game.ts` → `game.character` |
| Nomes oficiais: WinTário OS, FudidIn, ZapZap, PomboMail, Tinderella | `src/data/game.ts` → `game.systems` |
| Roadmap (8 frentes construídas, 12 sistemas, 9 planejadas, 6 áreas de arte, 3 fases) | `src/data/roadmap.ts` |

Proibido: inventar screenshots de gameplay, contagem regressiva, botão de download, links para
Steam/itch.io, múltiplos finais, mecânicas não confirmadas, datas fechadas, domínio falso,
pontuação de Lighthouse sem medição, redes sociais que não existem.

`src/data/social.ts` é a única fonte das redes e só aceita URL absoluta e publicada: entrada sem URL
válida não renderiza. Hoje existe **um** canal publicado — YouTube, **Mundo de Seh**
(`https://www.youtube.com/@mundodeseh`); as outras quatro entradas ficam vazias até um canal existir de
fato. O texto do rodapé vem de `followLine` no mesmo arquivo, não do componente.

## Estrutura

```
public/            assets estáticos copiados 1:1 para dist/
  assets/branding/ logo oficial e marca (originais autorizados)
  js/              reveal.js, motion.js e ficha.js — scripts externos (CSP sem 'unsafe-inline')
  _headers         CSP e cache para Cloudflare Pages
src/
  data/            game, roadmap, navigation, social, sprites — todo conteúdo editável
  components/      home/ game/ roadmap/ layout/ ui/
  layouts/         BaseLayout.astro (head, sprite sheet, skip link, rodapé)
  pages/           index.astro — única página, três seções âncora
  styles/          tokens.css (papéis de cor/tipo/espaço) e global.css (utilitários)
docs/              ARCHITECTURE, DESIGN_SYSTEM, CONTENT_GUIDE, CLOUDFLARE_DEPLOY, DECISIONS
```

Regra de separação: **conteúdo em `src/data/`, apresentação em componente**. Trocar um texto não
pode exigir tocar layout. Trocar um visual não pode exigir reescrever texto.

## Comandos

```bash
npm run dev        # astro dev em http://localhost:4321
npm run check      # astro check (TypeScript strict + tipos de template)
npm run build      # dist/ estático
npm run preview    # serve dist/ para conferência final
```

## Validação obrigatória após alterações relevantes

1. `npm run check` — zero erros, zero avisos.
2. `npm run build` — build limpo.
3. Inspecionar `dist/` gerada: nenhum caminho local (`C:\`, `D:\`, `Users\…`), nenhum `localhost`,
   nenhum `style="…"` inline, nenhum `<script>` inline que não seja JSON-LD, todo `target="_blank"`
   com `rel="noopener noreferrer"`.
4. Verificar âncoras internas: cada `href="#x"` precisa de um `id="x"` correspondente.
5. Responsividade nas oito larguras do brief (1920, 1440, 1366, 1024, 768, 390, 375, 320) **e** na
   varredura de ponta a ponta, 280 → 3440 px: sem rolagem horizontal em nenhuma delas, e nenhum título
   passando de duas linhas.
6. Erros de console quando for possível inspecionar a interface.
7. Gate de design (skill `design-taste-frontend`), com o servidor apontando para **dentro de `dist/`**:
   ```bash
   cd dist && node <skill>/scripts/inspect.mjs index.html --widths 1920,1440,1366,1024,768,390,375,320
   cd dist && node <skill>/scripts/inspect.mjs index.html --widths 280,300,320,360,390,480,640,768,900,1024,1280,1440,1600,1920,2048,2560,2880,3440
   ```
   A baseline esperada é a tabela de `docs/DECISIONS.md`; FAIL fora dela é regressão.
8. `npm audit` contra o lockfile commitado — zero crítico/alto alcançável. `npm audit fix --force`
   não é permitido sem decisão registrada em `docs/DECISIONS.md`.
9. Passada do checklist de interface (skill `web-design-guidelines`) no que mudou: foco, estados,
   toque, `prefers-reduced-motion`, semântica. O que não se aplica fica dito, não silenciado.

## Skills autorizadas e quando usar

| Skill | Usar quando |
| --- | --- |
| `security-and-hardening` | CSP, `_headers`, links externos, tratamento de configuração, dependências |
| `diagnosing-bugs` | Erro de build/render, comportamento inesperado — achar a causa antes de corrigir |
| `performance` | Payload, imagens, fontes, CSS/JS, Core Web Vitals |
| `impeccable` | Refinamento de interface, consistência visual, microinterações |
| `frontend-design` | Composição de página, hierarquia, responsividade |
| `design-taste-frontend` | Direção de arte, tipografia, paleta, espaçamento; gates `lint.mjs`/`inspect.mjs` |
| `web-design-guidelines` | Semântica HTML, acessibilidade, navegação, foco, estados |

Política de uso:

- Verificar se a skill está instalada **antes** de afirmar que foi usada. Não inventar instruções de skill.
- Carregar o `SKILL.md` da skill relevante para a tarefa; não acionar as sete sem motivo.
- Conflito entre orientações: **requisitos do projeto → segurança → acessibilidade → simplicidade → estética**.
- Não instalar skill nova globalmente sem autorização explícita.

## Onde a estética manda menos que o brief

A skill `design-taste-frontend` proíbe gradientes, sombras duras, rótulos monoespaçados, numeração
decorativa e cartões com ícone. **Este projeto usa tudo isso de propósito**: é o vernáculo herdado do
roadmap de referência (HUD de sistema operacional antigo, carimbo, formulário). As violações medidas
pelo `inspect.mjs` são decisões documentadas em `docs/DECISIONS.md`, não descuido. Antes de
"limpar" um desses elementos, leia `docs/DESIGN_SYSTEM.md`.

Da mesma forma, o site tem **uma** imagem raster (o logo oficial). Não há capturas de tela do jogo
autorizadas; preencher a galeria com imagens geradas seria mentir sobre o produto.

## Estilo de código

- CSS sempre por token (`var(--…)`) — nenhum componente inventa cor, tamanho de fonte ou clamp próprio.
- Nenhum `style=""` inline: variações viram classes (`.plate--sm`, `.hud__row--green`, `.systems__cell--proto`).
  Isso mantém `style-src 'self'` na CSP.
- Nenhum script inline: melhorias progressivas vivem em `public/js/` e entram com `<script is:inline defer src="…">`.
- Ícones são pixel art em `<symbol>` gerados de `src/data/sprites.ts` — nunca emoji.
- Comentários só onde o **porquê** não é óbvio (restrição de CSP, escolha de acessibilidade, limite de layout).
- Texto visível em pt-BR; a sátira brasileira é parte do produto.
