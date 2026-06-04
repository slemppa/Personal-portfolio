# Obsidian-pohjainen markdown-blogi portfolioon

**Päivämäärä:** 2026-06-04
**Tila:** Hyväksytty suunnittelu

## Tavoite

Blogi, jonka postaukset kirjoitetaan Obsidianissa markdownina ja jotka renderöityvät
siististi nykyiseen portfolioon. Sisältö elää git-repossa `.md`-tiedostoina (yksi
totuuden lähde). Obsidian on kiinni reposssa ja Obsidian Git hoitaa commit/push.
Push GitHubiin → Vercel buildaa ja julkaisee automaattisesti.

## Lukitut valinnat

- **Reititys:** erillinen `/blog`-reitti (react-router). Portfolio pysyy etusivuna.
- **Hosting:** Vercel (auto-build pushista, SPA-fallback).
- **Frontmatter:** kattava (title, date, description, tags, cover, draft).
- **Markdown:** vakaa setti (GFM, koodin korostus, otsikkolinkit, tavalliset linkit).

## Arkkitehtuuri

Lisätään `react-router` ja jaetaan sovellus kolmeen reittiin. Nykyinen portfolio
siirtyy `Home`-sivuksi sisällöltään muuttumattomana.

```
main.tsx → BrowserRouter
  /              → Home       (nykyinen portfolio: Nav + osiot + Footer)
  /blog          → BlogList   (postauslista)
  /blog/:slug    → BlogPost   (yksittäinen postaus)
```

### Tiedostorakenne (uudet/muuttuvat)

```
src/
  content/blog/*.md        # blogipostaukset (Obsidian-vault)
  content/blog/README.md   # ei renderöidy; ohje + frontmatter-template
  lib/posts.ts             # glob-lataus + getAllPosts/getPost
  lib/parsePost.ts         # puhdas parsinta (frontmatter + slug) — testattava
  lib/posts.test.ts        # vitest-testit
  pages/Home.tsx           # nykyinen App-runko siirretään tänne
  pages/BlogList.tsx
  pages/BlogPost.tsx
  components/Markdown.tsx   # react-markdown + pluginit, prose-tyyli
public/blog/               # cover-kuvat ja Obsidian-liitteet
vercel.json                # SPA-rewrite
```

## Sisältö ja lataus

- Blogit ladataan build-aikana:
  `import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default', eager: true })`.
- Frontmatter parsitaan **`js-yaml`**:lla (selainturvallinen, ei `gray-matter`/Buffer-riippuvuutta).
- `parsePost(raw, filename)` on puhdas funktio: erottaa `---`-frontmatter-lohkon,
  parsii YAML:n, johtaa slugin tiedostonimestä (`oma-postaus.md` → `oma-postaus`),
  palauttaa `Post`-olion.
- `posts.ts` kokoaa kaikki postaukset, **suodattaa `draft: true` pois tuotannossa**
  (`import.meta.env.PROD`), lajittelee `date` laskevasti. Tarjoaa `getAllPosts()` ja
  `getPost(slug)`.

### Post-tyyppi

```ts
type Post = {
  slug: string
  title: string
  date: string          // ISO, esim. 2026-06-04
  description?: string
  tags: string[]
  cover?: string        // esim. /blog/kuva.png
  draft: boolean
  content: string       // markdown-runko ilman frontmatteria
}
```

### Frontmatter-template

```yaml
---
title: "Otsikko"
date: 2026-06-04
description: "Lyhyt kuvaus listaan ja meta-tageihin"
tags: [react, obsidian]
cover: /blog/kuva.png      # valinnainen, public/-kansiosta
draft: false
---
```

## Renderöinti

- `Markdown`-komponentti kapseloi `react-markdown` + `remark-gfm` (taulukot,
  tehtävälistat) + `rehype-slug` (otsikkolinkit) + `rehype-highlight` (koodin korostus).
- Tyyli: `@tailwindcss/typography` `prose`-luokka, sovitettu sivun tummaan teemaan.
- Wikilinkit `[[...]]` eivät ole tuettuja → blogeissa tavalliset markdown-linkit.

## Sivut

- **BlogList:** kortit (otsikko, pvm, kuvaus, tagit, mahdollinen cover-thumb), linkki
  postaukseen. Tyhjä tila: "Ei vielä postauksia."
- **BlogPost:** frontmatter-otsikko (title, pvm, tagit, cover) + renderöity markdown.
  Tuntematon slug → "Postausta ei löytynyt" + paluulinkki `/blog`.
- **Nav:** lisätään "Blog"-linkki. Logo/etusivulinkki vie `/`. Portfolion osio-ankkurit
  toimivat etusivulla; Nav-linkki blogiin on reittilinkki.

## Virheidenkäsittely

- Viallinen/puuttuva frontmatter → selkeä `console.warn` ja postaus skipataan
  (ei kaada koko buildia).
- Pakolliset kentät: `title` ja `date`. Jos puuttuvat → varoitus + skip.
- Tuntematon slug reitillä → 404-näkymä postaukselle.

## Vercel

- `vercel.json` sisältää SPA-rewriten, jotta suora osoite `/blog/:slug` palvelee
  `index.html` eikä palauta 404:ää.
- Cover-kuvat ja Obsidianin liitteet ohjataan `public/blog/`-kansioon, jolloin
  markdownin polut (`/blog/...`) täsmäävät sekä Obsidianissa että tuotannossa.

## Testaus (TDD)

`vitest` + testit `parsePost`/`posts.ts`-logiikalle:

- frontmatterin parsinta (kaikki kentät, oletukset puuttuville)
- slugin muodostus tiedostonimestä
- `draft`-suodatus tuotannossa vs. devissä
- lajittelu päivämäärän mukaan laskevasti
- viallisen frontmatterin skippaus

## Obsidian-ohje (toimitetaan `content/blog/README.md`:ssä)

1. Avaa repo (tai `src/content/blog`) Obsidian-vaultiksi.
2. Asenna **Obsidian Git** -plugin → auto-commit/push (esim. 5–10 min välein).
3. Aseta liitekansioksi `public/blog`, jotta kuvapolut täsmäävät.
4. Kopioi frontmatter-template uuteen postaukseen.
5. `draft: true` pitää postauksen piilossa tuotannosta; `draft: false` julkaisee
   seuraavassa buildissa.

## Uudet riippuvuudet

- Tuotanto: `react-router`, `react-markdown`, `remark-gfm`, `rehype-slug`,
  `rehype-highlight`, `js-yaml`, `@tailwindcss/typography`
- Dev: `vitest`, `@types/js-yaml`

## Rajaukset (YAGNI)

Ei nyt: hakua, sivutusta, RSS-syötettä, tag-suodatussivuja, kommentteja,
selainpohjaista editoria. Lisättävissä myöhemmin ilman arkkitehtuurimuutoksia.
