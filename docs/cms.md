# Blogi: Payload CMS

Blogipostaukset ovat [Payload CMS](https://payloadcms.com):ssä (sama CMS kuin
rascal-ai-news-repossa). CMS on oma Next.js-appinsa kansiossa `cms/`; itse
portfolio pysyy staattisena Vite-sivuna.

```
Payload (cms/, Neon Postgres, skeema "payload")
  │  julkaisu → afterChange-hook → Vercel deploy hook
  ▼
portfolio build: scripts/cmsPosts.ts hakee GET /api/posts → virtual:blog-posts
  ▼
staattinen sivusto + prerenderöidyt /blog-sivut (scripts/seoBuild.ts)
```

- Sisältö kirjoitetaan Lexical-editorilla (taulukot tuettu). API palauttaa
  jokaisesta postauksesta myös `markdown`-kentän, jonka sivusto renderöi
  react-markdownilla kuten ennenkin.
- fi- ja en-versio ovat erillisiä postauksia samalla `slug`illa ja eri `lang`illa.
- Luonnokset (Payloadin drafts) eivät näy anonyymille API-kutsulle, joten ne
  eivät päädy tuotantoon. Devissä ne näkyvät, jos `CMS_API_KEY` on asetettu.

## Käyttöönotto

### 1. CMS (uusi Vercel-projekti)

1. Vercel → New Project → tämä repo, **Root Directory: `cms`**.
2. Ympäristömuuttujat (ks. `cms/.env.example`):
   - `DATABASE_URL` — Portfolio-Neonin connection string. Payload luo taulunsa
     omaan `payload`-skeemaansa, eivätkä ne törmää `portfolio_*`-tauluihin.
   - `PAYLOAD_SECRET` — pitkä satunnainen merkkijono.
   - `BLOB_READ_WRITE_TOKEN` — lisää Vercel Blob -store projektiin (kuvat).
   - `PORTFOLIO_DEPLOY_HOOK_URL` — portfolio-projektin deploy hook (kohta 2).
3. Avaa `https://<cms-domain>/admin` ja luo ensimmäinen käyttäjä.

### 2. Portfolio (nykyinen Vercel-projekti)

1. Settings → Environment Variables: `CMS_URL=https://<cms-domain>`.
   Ilman sitä tuotantobuild kaatuu tarkoituksella, jottei sivustoa julkaista
   ilman blogia.
2. Settings → Git → Deploy Hooks → luo hook ja laita sen URL CMS:n
   `PORTFOLIO_DEPLOY_HOOK_URL`-muuttujaan.

### 3. Vanhojen postausten migraatio (kerran)

Vanhat markdown-postaukset ovat kansiossa `cms/seed/blog/`.

```bash
cd cms
cp .env.example .env   # täytä DATABASE_URL ja PAYLOAD_SECRET
pnpm install
pnpm import:markdown
```

Skripti on idempotentti (upsert slug + lang), säilyttää luonnos/julkaistu-tilan
ja vie kansikuvat Media-kokoelmaan. Kun migraatio on tehty ja tarkistettu,
`cms/seed/` voidaan poistaa.

## Paikallinen kehitys

```bash
cd cms && pnpm dev            # http://localhost:3001/admin
# toisessa terminaalissa, portfolion juuressa (.env):
#   CMS_URL=http://localhost:3001
#   CMS_API_KEY=...           # valinnainen: Users → API Key → näyttää luonnokset
npm run dev
```

Jos CMS ei vastaa devissä, sivusto käynnistyy tyhjällä blogilla ja varoittaa
konsolissa.

Collectioneiden muuttamisen jälkeen: `pnpm generate:types` ja
`pnpm generate:importmap` (cms/-kansiossa).
