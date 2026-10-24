# Publicação no Cloudflare Pages — site CLT Simulator

> **Nada foi publicado.** Este projeto foi construído e validado localmente; a publicação é decisão
> explícita do time. Nada aqui foi executado. Siga quando chegar a hora.

O site é 100% estático: o Cloudflare Pages serve os arquivos de `dist/` direto da borda, sem função,
sem servidor e sem build image customizada.

## 1. Antes de publicar — checklist de conteúdo

- [ ] `npm run check` sem erro e `npm run build` sem aviso.
- [ ] `npm run preview` conferido nas oito larguras do brief (1920, 1440, 1366, 1024, 768, 390, 375,
      320) e na varredura 280 → 3440 px (`AGENTS.md`, passos 5 e 7).
- [ ] Nenhuma string de "domínio oficial" no HTML gerado (sem `SITE_URL`, o build não deve ter
      `canonical`, `og:url` nem sitemap).
- [ ] `src/data/social.ts` ou vazio (sem canal publicado) ou com URLs absolutas reais.
- [ ] `public/robots.txt` revisado: a linha `Sitemap:` continua comentada até existir domínio.
- [ ] Estado do projeto confere: protótipo jogável, demo prevista para 2027.
- [ ] Nenhuma captura de tela falsa na galeria.

## 2. Configuração do projeto no Cloudflare

1. **Workers & Pages → Create → Pages → Connect to Git** (recomendado, a partir do repositório do
   site) **ou → Upload assets** (deploy manual de `dist/` via `npx wrangler pages deploy dist`).
2. **Framework preset:** `Astro`.
3. **Build settings:**
   | Campo | Valor |
   | --- | --- |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | raiz do projeto do site (nunca a pasta do jogo) |
4. **Node:** versão ≥ 20.19 (o `package.json` declara `engines`). Se o ambiente do Pages precisar de
   pin explícito, adicione `.nvmrc` com a versão testada — e registre em `docs/DECISIONS.md`.

## 3. A variável que liga o domínio: `SITE_URL`

`astro.config.mjs` lê `process.env.SITE_URL` (ou `PUBLIC_SITE_URL`) e só define `site` quando ela
existe. **Sem ela, o site é gerado sem domínio — por design, para não publicar um canonical falso.**

Configure em **Settings → Environment variables → Production**:

| Variável | Valor |
| --- | --- |
| `SITE_URL` | `https://SEU-DOMINIO-OFICIAL` (sem barra final) |

Com `SITE_URL` preenchida, o build passa a gerar:

- `<link rel="canonical">` absoluto em todas as páginas;
- `og:url` e as URLs absolutas de `og:image` / `twitter:image`;
- `url` dentro do JSON-LD `VideoGame`;
- `sitemap-index.xml` + `sitemap-0.xml` (a integração `@astrojs/sitemap` só é carregada quando `site`
  existe) e o `<link>` correspondente fica disponível em `/sitemap-index.xml`.

Sem `SITE_URL`, `og:image` e `twitter:image` saem como caminho relativo (`/assets/branding/clt-logo.png`)
— e o Facebook/WhatsApp/X **não** buscam imagem relativa: o compartilhamento sai com texto e sem arte.
É o preço de não inventar um domínio que ainda não foi autorizado por você. Se publicar um preview sem
`SITE_URL` para testar o card social, teste com `SITE_URL=https://O-PREVIEW.pages.dev` num build local.

Depois de preencher, descomente no `public/robots.txt`:

```
Sitemap: https://SEU-DOMINIO-OFICIAL/sitemap-index.xml
```

Em **Preview deploys** (branches) deixe `SITE_URL` vazia: o preview sai sem canonical, sem `og:url` e
sem `Sitemap:` no `robots.txt`, então não disputa posição com a produção. O `X-Robots-Tag` não existe
ainda — ver a nota no fim da seção 5.

## 4. Domínio

1. **Custom domains → Set up a custom domain** e aponte o registro (na Cloudflare ou em outro DNS,
   com CNAME/ALIAS conforme a documentação do Pages).
2. Confirme o certificado TLS (Full/Strict) e ative **Always Use HTTPS**.
3. Redirecione o domínio pelado ↔ `www` conforme a preferência — o canonical do build só conhece um
   dos dois, definido por `SITE_URL`.
4. **Atualize `SITE_URL` se o domínio mudar** e gere um novo deploy: canonical, OG e sitemap são
   gravados no HTML em build, não em runtime.

## 5. Cabeçalhos: `public/_headers`

O arquivo `public/_headers` é copiado para `dist/` e lido nativamente pelo Pages.

**`/*`** — `Content-Security-Policy` restritiva (`default-src 'self'`; `script-src 'self'`;
`style-src 'self'`; `img-src 'self'`; `font-src 'self'`; `connect-src 'self'`; `object-src 'none'`;
`frame-ancestors 'self'`; `base-uri 'self'`; `form-action 'none'`; `upgrade-insecure-requests`), mais
`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (acelerômetro, autoplay,
câmera, geolocalização, microfone, payment e USB negados), `Cross-Origin-Opener-Policy: same-origin`
e `Cross-Origin-Resource-Policy: same-origin`.

**Cache** — `/js/*` 1 h (não tem hash no nome), `/assets/*` 30 dias, `/_astro/*` um ano com
`immutable` (o hash no nome já invalida), `/*.html` com `max-age=0, must-revalidate` para a
publicação aparecer na hora.

**HSTS deliberadamente ausente.** Não há `Strict-Transport-Security` no `_headers`, e isso é escolha,
não esquecimento: enquanto o site mora em `*.pages.dev`, o host é compartilhado com outros projetos, e
`includeSubDomains` ali alcança subdomínios que não são seus. Acrescente a linha depois que um domínio
próprio estiver apontado e o **Always Use HTTPS** estiver ativo — começando com `max-age` curto, e
sem `includeSubDomains` até decidir o destino de `www`. É o único cabeçalho da lista de endurecimento
padrão que falta, porque os demais já estão acima.

O não-indexar em desenvolvimento vem de `<meta name="robots" content="noindex">`, que o
`BaseLayout` só escreve quando `import.meta.env.DEV` é true — ou seja, nunca chega ao `dist/`.
Se você quiser `X-Robots-Tag` também nos preview deploys, isso é um ajuste neste arquivo, e vai para
`docs/DECISIONS.md`.

**Se a CSP quebrar algo no ar, o problema é no site, não na CSP.** O HTML gerado não tem script
inline, não tem `style=""` e não carrega recurso de terceiros. Antes de afrouxar uma diretiva,
reproduza localmente com `npm run build && npm run preview` e abra o console.

### Analytics

Não há analytics instalado — e ele não pode ser adicionado sem mudar a CSP. Para habilitar o
Cloudflare Web Analytics, além de ativar no painel, edite `public/_headers`:

```
connect-src 'self' https://cloudflareinsights.com
script-src  'self' https://static.cloudflareinsights.com
```

Decisão a registrar em `docs/DECISIONS.md` (envolve dado de visitante: confirmar a base legal antes).

## 6. Branches e produção

| Branch | Comportamento esperado |
| --- | --- |
| `main` (ou a que o time escolher) | Produção, com `SITE_URL` definida |
| qualquer outra | Preview: URL `https://<hash>.<projeto>.pages.dev`, `noindex`, sem canonical |

Ative **Production branch only** para builds automáticos se o fluxo preferir deploy manual.

## 7. Depois do primeiro deploy

1. Abrir a URL de produção e conferir no código-fonte: `canonical`, `og:url` e `sitemap` apontando
   para o domínio certo.
2. `curl -sI https://DOMINIO/` e confirmar a presença de `content-security-policy`, `nosniff` e
   HTTPS redirect.
3. Abrir `/robots.txt` e `/sitemap-index.xml`.
4. Testar em celular real as três âncoras do menu e o carimbo da ficha.
5. Conferir a aba Console do navegador: sem erro, sem recurso bloqueado pela CSP.
6. Validar no verificador de OG da plataforma onde o link for compartilhado — a imagem precisa ser
   alcançável pela URL absoluta.
7. Registrar o deploy em `docs/DECISIONS.md` (data, commit, domínio).

## 8. Rollback

Pages mantém cada deploy como versão imutável em histórico. **Rollbacks** → escolher o deploy anterior
→ *Save and deploy*. Como tudo é estático, reverter é apontar a produção para a versão anterior — não
há migração, banco ou cache de servidor para desfazer.

Se o problema for um conteúdo publicado por engano (uma data, um status), corrija nos dados, rode o
gate de validação e publique um novo deploy; não edite `dist/` na mão.
