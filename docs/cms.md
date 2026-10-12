# Sivusto + blogi: Next.js ja Payload CMS

Portfolio on yksi Next.js 16 -appi, jossa pyörii myös [Payload CMS](https://payloadcms.com)
(sama CMS kuin rascal-ai-news-repossa). Yksi repo, yksi Vercel-projekti, yksi
Neon-tietokanta.

| Polku | Mitä |
|---|---|
| `/`, `/blog`, `/projektit/*` (+ `/en/...`) | sivusto (`src/app/(fi)`, `src/app/(en)`) |
| `/admin` | Payloadin hallintapaneeli (`src/app/(payload)`) |
| `/api/posts`, `/api/media`, `/api/graphql` | Payloadin REST/GraphQL |
| `/api/contact`, `/api/offers`, `/api/activity` | sivuston omat API:t (`src/app/api`) |

## Miten blogi toimii

- Postaukset ovat Payloadin `posts`-kokoelmassa (fi- ja en-versio samalla
  `slug`illa, eri `lang`illa). Editorina Lexical, taulukot tuettu. Jokaisella
  postauksella on myös `markdown`-kenttä, jonka sivu renderöi react-markdownilla.
- Sivut haetaan Payloadin Local API:lla (`src/lib/posts.ts`) ja renderöidään
  staattisesti. Kun julkaistua postausta muutetaan, `Posts`-kokoelman hook
  kutsuu `revalidatePath('/', 'layout')` → sivut päivittyvät seuraavalla
  latauksella ilman uutta deployta.
- Luonnokset näkyvät vain `next dev`issä.
- SEO (title, canonical, hreflang, OG, JSON-LD, sitemap) tulee yhdestä
  lähteestä: `src/lib/routes.ts`.

Payloadin taulut ovat Neonissa omassa `payload`-skeemassaan, eivätkä ne törmää
`portfolio_offers`/`portfolio_leads`-tauluihin.

## Käyttöönotto Vercelissä

`vercel.json` vaihtaa projektin frameworkiksi Next.js:n. Ympäristömuuttujat
(Settings → Environment Variables):

- `DATABASE_URL` — on jo olemassa (Neon).
- `PAYLOAD_SECRET` — **uusi**, pitkä satunnainen merkkijono (`openssl rand -hex 32`).
- `BLOB_READ_WRITE_TOKEN` — **uusi**: Storage → Create → Blob → yhdistä
  projektiin; Vercel lisää muuttujan itse. Tarvitaan kuvien lataukseen.
- `VITE_PUBLIC_POSTHOG_*` toimivat edelleen; ne kannattaa nimetä
  `NEXT_PUBLIC_POSTHOG_*`:ksi jossain vaiheessa (`next.config.ts` hyväksyy molemmat).

Ensimmäisen deployn jälkeen: avaa `/admin` ja luo ensimmäinen käyttäjä.

## Tietokanta ja migraatiot

`pnpm build` ajaa ensin `payload migrate` ja sitten `next build`, joten
Vercelin build luo Payloadin taulut Neoniin ja ajaa uudet migraatiot itse.

- `src/migrations/*_initial.ts` — `payload`-skeema ja taulut.
- `src/migrations/*_seed_markdown_posts.ts` — tuo vanhat markdown-postaukset
  (`seed/blog/`) kerran. Ilman `BLOB_READ_WRITE_TOKEN`ia kansikuvat ohitetaan.
  Käsin uudelleen: `pnpm import:markdown` (idempotentti, upsert slug + lang).

Kokoelmia muutettaessa: `pnpm migrate:create <nimi>` ja commitoi migraatio.
Huom: preview-deployt käyttävät samaa `DATABASE_URL`ia, joten myös ne ajavat
migraatiot tuotantokantaan.

## Paikallinen kehitys

```bash
pnpm install
pnpm dev          # http://localhost:3000 ja http://localhost:3000/admin
pnpm test         # vitest
pnpm lint
```

Collectioneiden muuttamisen jälkeen: `pnpm generate:types` ja `pnpm generate:importmap`.
