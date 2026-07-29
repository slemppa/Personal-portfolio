# Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio content around 6 real products with verified numbers, unify the visual design into the koneisto look, make the whole site fi/en, and replace every mailto CTA with a Neon+Brevo lead-capture flow.

**Architecture:** Vite + React 19 SPA (react-router 7). The home page is a large inline-styled HTML string (`src/site/markup.ts`) rendered via `dangerouslySetInnerHTML` with React "islands" spliced in at HTML comment markers (existing pattern: `BuildInPublic`). We extend that pattern: the Projektit section and the Yhteys form become islands, and the HTML string becomes a `sectionsHtml(lang)` template function fed by a copy dictionary. Case data moves to a bilingual single source of truth in `src/lib/cases.ts`. Serverless functions live in `api/` (Vercel), DB is Neon Postgres via `api/_lib/db.ts`.

**Tech Stack:** React 19, TypeScript strict, Tailwind 4 (`@theme` tokens), react-router 7, Vitest, Vercel functions, Neon serverless Postgres, Brevo API, PostHog.

**Spec:** `docs/superpowers/specs/2026-07-29-portfolio-refresh-design.md` — read it first.

## Global Constraints

- Language of user-facing copy: Finnish primary, English at `/en/...` routes. Blog already does this (`/blog` vs `/en/blog`); reuse `Lang` from `src/lib/parsePost.ts` — do NOT invent a second Lang type.
- Every number shown on the site must be verifiable (from the spec's per-project table or repo-measured). NO invented telemetry. The old "127 liidiä / 17 s / 94 %" counters must not survive.
- No mailto: links in CTAs. `mailto:` may only appear as a plain contact detail (e.g. the Yhteys section's visible email address and admin views).
- All commits: Conventional Commits, end with `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`.
- Run `npm run lint && npm test` before every commit. `npm run build` must pass at every task boundary marked "build gate".
- Do not modify: `src/pages/Offer.tsx`, `src/pages/Admin.tsx` logic, `api/offers.ts`, `api/activity.ts`, blog post content files. (Visual changes to these pages come free via token values — that is fine.)
- Case slugs: `rascal-ai`, `rascal-crm`, `rascal-pages`, `altio`, `pesa`, `perhe-app`. `superhuman` is a legacy alias for `altio` (old URL must keep working).
- Working branch: continue on `fix/api-esm-imports`? NO — create branch `feat/portfolio-refresh` off current HEAD first.

## File Structure

| File | Responsibility |
|---|---|
| `src/index.css` | MODIFY — unified koneisto token values in `@theme` |
| `src/lib/cases.ts` | REWRITE — bilingual case data (single source of truth) + `getCases(lang)` / `getCaseStudy(slug, lang)` |
| `src/lib/cases.test.ts` | CREATE — data-integrity tests |
| `src/lib/i18n.ts` | MODIFY — add case-page, form, and shared UI strings |
| `src/site/copy.ts` | CREATE — `homeCopy: Record<Lang, HomeCopy>` for the markup template |
| `src/site/markup.ts` | MODIFY — `SECTIONS_HTML`/`NAV_HTML` constants become `sectionsHtml(lang)` / `navHtml(lang)` template functions; Projektit section HTML removed (replaced by marker comment) |
| `src/components/CasesSection.tsx` | CREATE — home-page project grid generated from `cases.ts` |
| `src/pages/Home.tsx` | MODIFY — `lang` prop, three islands (CasesSection, BuildInPublic, ContactForm in Yhteys) |
| `src/pages/CaseStudy.tsx` | MODIFY — `lang` prop, i18n labels, inline ContactForm CTA (mailto removed) |
| `src/main.tsx` | MODIFY — `/en` + `/en/projektit/:slug` routes |
| `src/components/Nav.tsx` | MODIFY — lang-aware markup + language switcher preserving current page |
| `src/components/ContactForm.tsx` | MODIFY — marketing-consent checkbox, `lang` prop |
| `src/components/NewsletterForm.tsx` | CREATE — email-only capture for blog |
| `src/pages/BlogList.tsx`, `src/pages/BlogPost.tsx` | MODIFY — append NewsletterForm |
| `api/_lib/leads.ts` | MODIFY — consent parsing, consent storage, `syncToBrevo` |
| `api/_lib/leads.test.ts` | CREATE — parseLead/consent unit tests |
| `api/contact.ts` | MODIFY — wire `syncToBrevo` |
| `db/schema.sql` | MODIFY — `marketing_consent`, `consent_at` columns |
| `public/cases/<slug>/` | CREATE — screenshots |

---

### Task 1: Unify design tokens (koneisto look everywhere)

**Files:**
- Modify: `src/index.css:4-16` (the `@theme` block) and `src/index.css:73-85` (accent helpers)

**Interfaces:**
- Produces: same token *names* (`bg-bg-secondary`, `text-accent`, …) with new values — zero class renames needed anywhere.

- [ ] **Step 1: Replace the `@theme` values.** The blue Linear-style palette becomes the home page's monochrome koneisto palette. The accent becomes near-white (the koneisto look uses white emphasis, hairline borders):

```css
@theme {
  --color-bg-primary: #0a0b0d;
  --color-bg-secondary: #0c0d10;
  --color-bg-tertiary: #121317;
  --color-text-primary: #f2f3f4;
  --color-text-secondary: #b7b9bd;
  --color-text-muted: #7d8085;
  --color-accent: #f2f3f4;
  --color-accent-hover: #ffffff;
  --color-accent-soft: rgba(255, 255, 255, 0.08);
  --color-border: rgba(255, 255, 255, 0.09);
  --color-border-hover: rgba(255, 255, 255, 0.18);
}
```

- [ ] **Step 2: Fix accent helpers that assumed blue.** In the same file replace `.glow-accent`'s shadow with `0 0 20px rgba(255, 255, 255, 0.12)` and `.text-gradient-accent`'s gradient with `linear-gradient(120deg, #ffffff, #b7b9bd)`.

- [ ] **Step 3: Audit for white-on-white breakage.** The CaseStudy CTA button uses `bg-accent ... text-white` (`src/pages/CaseStudy.tsx:196`) — with a white accent this becomes white-on-white. Grep and fix every `text-white` that sits on `bg-accent` to `text-[#0a0b0d]`:

Run: `grep -rn "bg-accent" src/ | grep -v "accent-soft"`

Same check for `Contact.tsx`, `Offer.tsx`, `Admin.tsx`, `ContactForm.tsx` submit buttons. Change ONLY text color classes, no layout.

- [ ] **Step 4: Visual smoke.** Run `npm run dev`, open `/`, `/projektit/rascal-ai`, `/blog`, `/yhteys`. All pages must read monochrome white-on-dark, no blue anywhere, all text legible.

- [ ] **Step 5: Commit** `style: unify design tokens to the koneisto monochrome palette`

---

### Task 2: Bilingual case data model + integrity tests

**Files:**
- Rewrite: `src/lib/cases.ts` (keep file, replace content)
- Create: `src/lib/cases.test.ts`

**Interfaces:**
- Consumes: `Lang` from `./parsePost`
- Produces (exact — later tasks depend on these):

```ts
export type Outcome = { value: string; label: string }
export type ApproachStep = { title: string; body: string }
export type StackGroup = { group: string; items: string[] }
export type GalleryShot = { src: string; caption: string }
export type CaseLink = { label: string; href: string }

/** Language-specific copy for one case. */
export type CaseCopy = {
  title: string
  tagline: string
  client: string
  role: string
  summary: string
  problem: string
  approach: ApproachStep[]
  outcomes: Outcome[]
  highlights: string[]
  links: CaseLink[]
}

/** Merged, render-ready shape — what pages consume. */
export type CaseStudy = CaseCopy & {
  slug: string
  year: string
  featured: boolean
  stack: StackGroup[]
  gallery: GalleryShot[]
}

export function getCases(lang: Lang): CaseStudy[]
export function getCaseStudy(slug: string, lang: Lang): CaseStudy | undefined
```

Internal storage shape (not exported):

```ts
type CaseEntry = {
  slug: string
  year: string
  featured: boolean
  stack: StackGroup[]
  gallery: { src: string; caption: Record<Lang, string> }[]
  copy: Record<Lang, CaseCopy>
}
const entries: CaseEntry[] = [/* Task 3 + 4 fill this */]
const ALIASES: Record<string, string> = { superhuman: 'altio' }
```

`getCaseStudy` resolves aliases: `const key = ALIASES[slug] ?? slug`.

- [ ] **Step 1: Write the failing tests** in `src/lib/cases.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { getCases, getCaseStudy } from './cases'

const SLUGS = ['rascal-ai', 'rascal-crm', 'rascal-pages', 'altio', 'pesa', 'perhe-app']

describe('case data integrity', () => {
  it('exposes all six cases in order, both languages', () => {
    for (const lang of ['fi', 'en'] as const) {
      expect(getCases(lang).map((c) => c.slug)).toEqual(SLUGS)
    }
  })

  it('every case has complete copy in both languages', () => {
    for (const lang of ['fi', 'en'] as const) {
      for (const c of getCases(lang)) {
        expect(c.title.length, c.slug).toBeGreaterThan(0)
        expect(c.tagline.length, c.slug).toBeGreaterThan(0)
        expect(c.problem.length, c.slug).toBeGreaterThan(50)
        expect(c.approach.length, c.slug).toBeGreaterThanOrEqual(3)
        expect(c.outcomes.length, c.slug).toBe(3)
        expect(c.highlights.length, c.slug).toBeGreaterThanOrEqual(4)
      }
    }
  })

  it('resolves the legacy superhuman alias to altio', () => {
    expect(getCaseStudy('superhuman', 'fi')?.slug).toBe('altio')
  })

  it('banned claims are gone', () => {
    const all = JSON.stringify([getCases('fi'), getCases('en')])
    expect(all).not.toMatch(/HealthKit/) // Altio: not integrated yet
    expect(all).not.toMatch(/[Ll]ocal-first/) // Pesä: now cloud-backed (Neon)
  })

  it('first three cases are featured, rest not', () => {
    expect(getCases('fi').map((c) => c.featured)).toEqual([true, true, true, false, false, false])
  })
})
```

- [ ] **Step 2: Run tests, verify they fail** — `npm test -- cases` → FAIL (getCases not exported).

- [ ] **Step 3: Implement the model** with the types above and placeholder-free content for ALL SIX cases — the full content payload is specified in Task 3 and Task 4. Implement Task 3's three Rascal entries now if convenient, or a minimal-honest stub is NOT allowed: do Tasks 2+3 in one sitting, then Task 4. `getCases` maps entries to merged shape:

```ts
export function getCases(lang: Lang): CaseStudy[] {
  return entries.map((e) => ({
    slug: e.slug,
    year: e.year,
    featured: e.featured,
    stack: e.stack,
    gallery: e.gallery.map((g) => ({ src: g.src, caption: g.caption[lang] })),
    ...e.copy[lang],
  }))
}

export function getCaseStudy(slug: string, lang: Lang): CaseStudy | undefined {
  const key = ALIASES[slug] ?? slug
  return getCases(lang).find((c) => c.slug === key)
}
```

- [ ] **Step 4: Run tests** — green only after Task 3 + 4 content is in. Commit happens at end of Task 4.

---

### Task 3: Case content — Rascal AI, Rascal CRM, Rascal Pages

**Files:**
- Modify: `src/lib/cases.ts` (fill `entries` — first three)

All numbers below are repo-measured (July 2026) per the spec's table. Insert these three `CaseEntry` objects verbatim (gallery arrays stay `[]` until Task 14):

- [ ] **Step 1: Rascal AI entry**

```ts
{
  slug: 'rascal-ai', year: '2025–2026', featured: true,
  stack: [
    { group: 'AI', items: ['Claude', 'ElevenLabs', 'Vapi', 'HeyGen', 'MCP'] },
    { group: 'Product', items: ['React', 'Vite', 'Supabase', 'Postgres + RLS'] },
    { group: 'Infra', items: ['Vercel', 'Upstash Redis', 'Sentry', 'n8n'] },
  ],
  gallery: [],
  copy: {
    fi: {
      title: 'Rascal AI',
      tagline: 'AI-markkinointi ja -myynti pk-yritykselle — yhdessä alustassa',
      client: 'Rascal Company', role: 'CTO & Founder',
      summary:
        'Multi-tenant SaaS, joka hoitaa pk-yrityksen markkinoinnin ja myynnin: AI-sisältöputki, äänipuhelukampanjat ja analytiikka. ~207 000 riviä koodia, 423 julkaisua.',
      problem:
        'AI-generoitu sisältö kuulostaa botilta, ja pk-yrityksen markkinointi hajoaa viiteen eri työkaluun. Tarvittiin alusta, joka tuottaa asiakkaan kuuloista sisältöä ja hoitaa koko putken strategiasta julkaisuun ja soittokampanjoihin — yhden hengen ylläpidettävissä.',
      approach: [
        { title: 'Kuukausittainen AI-äänihaastattelu',
          body: 'ElevenLabs-agentti haastattelee yrittäjää ~6 minuuttia kuukaudessa. Vastaukset tislataan teemoiksi ja sitaateiksi, jotka ohjaavat strategian ja sisältöideoiden generointia — sisältö kuulostaa asiakkaalta, ei geneeriseltä mallilta.' },
        { title: 'Tuote on itse MCP-serveri',
          body: '20 työkalua, joilla Claude voi ajaa kampanjoita, generoida sisältöä ja lukea analytiikkaa luonnollisella kielellä. Pohjalla itse rakennettu OAuth 2.1 -auktorisointipalvelin: PKCE, dynaaminen klienttirekisteröinti, refresh-tokenien rotaatio ja käyttäjän hyväksyntänäkymä.' },
        { title: 'Kolme ajoympäristöä työkuorman mukaan',
          body: 'Synkroninen työ 129 Vercel-funktiossa, pitkäkestoinen 27 Supabase Edge Functionissa (token-refresh, julkaisupollerit, health-checkit), AI-putket n8n:ssä. Somekanavat pysyvät kiinni kuukausia ilman käsityötä.' },
        { title: 'Yhden hengen julkaisukuri',
          body: '423 julkaisua ~13 kuukaudessa: Conventional Commits, automaattinen versiointi, CI ja päivittäinen tuotannon savutesti. ~1 280 yksikkötestiä ja 113 e2e-testiä pitävät vauhdin turvallisena.' },
      ],
      outcomes: [
        { value: '~207 000', label: 'riviä koodia' },
        { value: '423', label: 'julkaisua ~13 kuukaudessa' },
        { value: '1 400+', label: 'automaattitestiä' },
      ],
      highlights: [
        'MCP-serveri + oma OAuth 2.1 -auktorisointipalvelin',
        'Äänihaastattelu → strategia → sisältö -putki',
        'Massapuhelukampanjat: CSV-import, ajastus arkipäiville, tulokset takaisin',
        '78 taulua rivitason käyttöoikeuksilla (RLS), 4 roolitasoa',
        'Integraatiosalaisuudet salattu AES-256-GCM:llä',
        'Kaksikielinen käyttöliittymä (fi/en)',
      ],
      links: [
        { label: 'rascalai.fi', href: 'https://rascalai.fi' },
        { label: 'app.rascalai.fi', href: 'https://app.rascalai.fi' },
      ],
    },
    en: {
      title: 'Rascal AI',
      tagline: 'AI marketing & sales for SMBs — one platform',
      client: 'Rascal Company', role: 'CTO & Founder',
      summary:
        'Multi-tenant SaaS that runs an SMB’s marketing and sales: AI content pipeline, voice-call campaigns and analytics. ~207,000 lines of code, 423 releases.',
      problem:
        'AI-generated content sounds like a bot, and SMB marketing fragments across five tools. The goal: a platform that produces content in the customer’s own voice and runs the whole pipeline from strategy to publishing and call campaigns — maintainable by one person.',
      approach: [
        { title: 'A monthly AI voice interview',
          body: 'An ElevenLabs agent interviews the business owner for ~6 minutes a month. The answers are distilled into themes and verbatim quotes that drive strategy and idea generation — so content sounds like the customer, not a generic model.' },
        { title: 'The product is an MCP server',
          body: '20 tools let Claude run campaigns, generate content and read analytics in natural language. Underneath: a from-scratch OAuth 2.1 authorization server — PKCE, dynamic client registration, refresh-token rotation and a user consent screen.' },
        { title: 'Three runtimes matched to workload shape',
          body: 'Synchronous work in 129 Vercel functions, long-running jobs in 27 Supabase Edge Functions (token refresh, publish pollers, health checks), AI pipelines in n8n. Social channels stay connected for months without manual work.' },
        { title: 'One-person release discipline',
          body: '423 releases in ~13 months: Conventional Commits, automated versioning, CI and a daily production smoke test. ~1,280 unit tests and 113 e2e tests keep the pace safe.' },
      ],
      outcomes: [
        { value: '~207,000', label: 'lines of code' },
        { value: '423', label: 'releases in ~13 months' },
        { value: '1,400+', label: 'automated tests' },
      ],
      highlights: [
        'MCP server + a hand-built OAuth 2.1 authorization server',
        'Voice interview → strategy → content pipeline',
        'Mass call campaigns: CSV import, business-day scheduling, results fed back',
        '78 tables under row-level security (RLS), 4 role tiers',
        'Integration secrets encrypted with AES-256-GCM',
        'Bilingual UI (fi/en)',
      ],
      links: [
        { label: 'rascalai.fi', href: 'https://rascalai.fi' },
        { label: 'app.rascalai.fi', href: 'https://app.rascalai.fi' },
      ],
    },
  },
},
```

- [ ] **Step 2: Rascal CRM entry**

```ts
{
  slug: 'rascal-crm', year: '2026', featured: true,
  stack: [
    { group: 'Product', items: ['Next.js 16', 'React 19', 'Supabase', 'TanStack Query'] },
    { group: 'Voice', items: ['Twilio Voice SDK', 'Mistral', 'Vapi'] },
    { group: 'Integrations', items: ['Recall.ai', 'Unipile', 'Slack', 'Tiptap'] },
  ],
  gallery: [],
  copy: {
    fi: {
      title: 'Rascal CRM',
      tagline: 'CRM, jonka sisällä on soittokeskus',
      client: 'Rascal Company', role: 'CTO & Founder',
      summary:
        'Pipedrive-luokan myynti-CRM, jossa on sisäänrakennettu selainpohjainen soittokeskus live-AI-valmennuksella, workflow-moottori ja dokumenttien e-allekirjoitus. ~123 000 riviä, ~1 600 testiä.',
      problem:
        'Myyntitiimin työkalut ovat siiloissa: CRM yhdessä, puhelut toisessa, dokumentit kolmannessa — ja "AI-ominaisuudet" ovat päälle liimattuja. Tavoite oli CRM, jossa puhelu, kalenteri, dokumentit ja automaatio elävät samassa tietomallissa, multi-tenant-eristyksellä jota ei voi ohittaa.',
      approach: [
        { title: 'Soittokeskus selaimessa',
          body: 'Twilio Voice SDK soittaa suoraan selaimesta, rinnakkaissoitto jopa 10 numeroon — ensimmäinen vastaaja yhdistetään myyjälle. Puhelun transkriptio virtaa reaaliajassa, ja Mistral antaa myyjälle yhden toimenpidevinkin ~700 millisekunnissa.' },
        { title: 'Prompt-injektiota kestävä AI-coach',
          body: 'Asiakas saa muokata coachin persoonaa asetuksista, mutta JSON-vastauskontrakti on lukittu erilliseen, ei-muokattavaan prompt-osaan. Vaikka ohjetta sörkittäisiin miten, parseri ei hajoa.' },
        { title: 'Workflow-moottori, ei workflow-nappeja',
          body: '13 step-tyyppiä (ehdot, iteraatiot, HTTP, sähköpostit, tietuemuutokset), versioidut määritykset ja ajot, jotka jatkuvat cron-ajosta vaikka funktio katkeaisi. Rakennetaan visuaalisella canvasilla.' },
        { title: 'Multi-tenant-turva kahdella kerroksella',
          body: 'Identiteetti ja CRM-data ovat eri Supabase-projekteissa. Postgresin RLS:n päällä sovellustason näkyvyyssäännöt ja PostgREST-injektion esto. Fail-closed: virhetilanne palauttaa 500, ei koskaan väärän organisaation dataa.' },
      ],
      outcomes: [
        { value: '192', label: 'API-reittiä' },
        { value: '~1 600', label: 'testiä (TDD-kurilla)' },
        { value: '50', label: 'tietokantataulua, RLS kaikissa' },
      ],
      highlights: [
        'Dokumentit + e-allekirjoitus sisältöhash-eheydellä',
        'Recall.ai-kokousbotit: transkriptio → yhteenveto → tehtävät CRM:ään',
        'Julkinen varauskalenteri (Cal.com-tyyliin) peruutus- ja siirtolinkeillä',
        'Cmd+K-paletti, muokattava dashboard, tallennetut näkymät',
        'Kaksikielinen (fi/en), 3 216 riviä käännöksiä per kieli',
        '32 design-spekkiä ja 23 toteutussuunnitelmaa dokumentoituna',
      ],
      links: [{ label: 'crm.rascalai.fi', href: 'https://crm.rascalai.fi' }],
    },
    en: {
      title: 'Rascal CRM',
      tagline: 'A CRM with a call center inside',
      client: 'Rascal Company', role: 'CTO & Founder',
      summary:
        'A Pipedrive-class sales CRM with a built-in browser call center with live AI coaching, a workflow engine and document e-signing. ~123,000 lines, ~1,600 tests.',
      problem:
        'Sales tooling lives in silos: CRM here, calls there, documents elsewhere — with "AI features" bolted on top. The goal: a CRM where calling, calendar, documents and automation share one data model, with multi-tenant isolation that cannot be bypassed.',
      approach: [
        { title: 'A call center in the browser',
          body: 'Twilio Voice SDK dials straight from the browser with parallel dialing to up to 10 numbers — the first answer is bridged to the rep. The transcript streams in real time, and Mistral serves the rep one actionable hint in ~700 ms.' },
        { title: 'A prompt-injection-resistant AI coach',
          body: 'Customers can edit the coach persona in Settings, but the JSON output contract is pinned in a separate, non-editable prompt section. However much the guidance is mangled, the parser never breaks.' },
        { title: 'A workflow engine, not workflow buttons',
          body: '13 step types (conditions, iterators, HTTP, email, record mutations), versioned definitions, and runs that resume from cron even if a function dies. Authored on a visual canvas.' },
        { title: 'Multi-tenant security in two layers',
          body: 'Identity and CRM data live in separate Supabase projects. On top of Postgres RLS: application-level visibility scoping and PostgREST injection escaping. Fail-closed: an error returns 500, never another org’s data.' },
      ],
      outcomes: [
        { value: '192', label: 'API routes' },
        { value: '~1,600', label: 'tests (TDD discipline)' },
        { value: '50', label: 'database tables, RLS on all' },
      ],
      highlights: [
        'Documents + e-signing with content-hash integrity',
        'Recall.ai meeting bots: transcript → summary → CRM tasks',
        'Public booking pages (Cal.com-style) with cancel/reschedule links',
        'Cmd+K palette, customizable dashboard, saved views',
        'Bilingual (fi/en), 3,216 lines of translations per locale',
        '32 design specs and 23 implementation plans documented',
      ],
      links: [{ label: 'crm.rascalai.fi', href: 'https://crm.rascalai.fi' }],
    },
  },
},
```

- [ ] **Step 3: Rascal Pages entry**

```ts
{
  slug: 'rascal-pages', year: '2026', featured: true,
  stack: [
    { group: 'Product', items: ['Next.js 16', 'Supabase', 'Tailwind 4', 'dnd-kit'] },
    { group: 'AI', items: ['Claude', 'ElevenLabs', 'n8n'] },
    { group: 'Provisioning', items: ['GitHub API', 'Vercel API'] },
  ],
  gallery: [],
  copy: {
    fi: {
      title: 'Rascal Pages',
      tagline: 'Kotisivukone, jossa asiakas omistaa koodinsa',
      client: 'Rascal Company', role: 'CTO & Founder',
      summary:
        'Multi-tenant-sivustogeneraattori: kuvaile yrityksesi puhumalla, ja koneisto luo GitHub-repon, Vercel-projektin, domainin ja valmiin sivun — jonka voi luovuttaa asiakkaalle yhdellä komennolla.',
      problem:
        'Webflow ja Squarespace lukitsevat asiakkaan alustaansa: sivun voi rakentaa, mutta ei omistaa. Tavoite oli sivustotuote, jossa jokainen asiakassivu on oikea, itsenäinen Next.js-repo — ja silti sivun luonti on yhtä helppoa kuin lomakkeen täyttö tai puhelu.',
      approach: [
        { title: 'Repo-per-site-arkkitehtuuri',
          body: 'Jokainen asiakassivu on oma GitHub-repo ja oma Vercel-projekti. Tietoinen ADR-tason valinta: N deploymentin operointikuorma hyväksytään, koska luovutuslupaus vaatii sen — handoff asiakkaan GitHubiin on yksi komento.' },
        { title: 'Sivu syntyy puhumalla',
          body: 'ElevenLabs-ääniagentti haastattelee, n8n + Claude generoi sivukonfiguraation 1 200-rivisellä versioidulla system promptilla, ja provisiointi luo repon, projektin ja aliverkkotunnuksen automaattisesti — törmäykset ratkaistaan 25 kandidaattiin asti.' },
        { title: 'Visuaalieditori ilman lukkoja',
          body: '17 lohkotyyppiä ja niille omat editorit: inline-muokkaus, drag-and-drop-järjestys, undo/redo, autosave ja per-site design-tokenit. Sisällön voi vaihtoehtoisesti kirjoittaa Obsidianissa ja pushata Gitiin.' },
        { title: 'Provisiointi, joka kestää katkon',
          body: 'Viisivaiheinen putki (repo → seed → Vercel-projekti → domain → rekisteri) checkpointtaa tilan kantaan joka vaiheen jälkeen. Keskeytynyt ajo jää diagnosoitavaan tilaan — ei orpoja repoja. Dry-run-tila tekee putkesta yksikkötestattavan.' },
      ],
      outcomes: [
        { value: '17', label: 'lohkotyyppiä + 16 editoria' },
        { value: '5', label: 'vaihetta automaattiprovisioinnissa' },
        { value: '216', label: 'testiä puhtaalle logiikalle' },
      ],
      highlights: [
        'Ääniohjattu sivugenerointi (ElevenLabs → Claude → julkaistu sivu)',
        'Automaattinen GitHub + Vercel + domain -provisiointi',
        'Org-skoopatut API-avaimet (vain SHA-256-hash talteen)',
        'Analytiikka ja liidilomakkeet CRM-vientilipulla',
        'Sivuston luovutus asiakkaalle yhdellä komennolla',
        'Formaali ADR-arkkitehtuuripäätös riskitauluineen',
      ],
      links: [{ label: 'rascalpages.fi', href: 'https://rascalpages.fi' }],
    },
    en: {
      title: 'Rascal Pages',
      tagline: 'A website builder where the customer owns the code',
      client: 'Rascal Company', role: 'CTO & Founder',
      summary:
        'A multi-tenant site generator: describe your business by voice, and the machine creates a GitHub repo, a Vercel project, a domain and a finished site — transferable to the customer with one command.',
      problem:
        'Webflow and Squarespace lock customers in: you can build a site but never own it. The goal: a site product where every customer site is a real, standalone Next.js repo — while creating one stays as easy as filling a form or making a call.',
      approach: [
        { title: 'Repo-per-site architecture',
          body: 'Every customer site is its own GitHub repo and its own Vercel project. A deliberate, ADR-documented tradeoff: the operational load of N deployments is accepted because the ownership promise requires it — handoff to the customer’s GitHub is one command.' },
        { title: 'Sites born from a conversation',
          body: 'An ElevenLabs voice agent runs the interview, n8n + Claude generate the site config from a 1,200-line versioned system prompt, and provisioning creates the repo, project and subdomain automatically — resolving collisions across up to 25 candidates.' },
        { title: 'A visual editor without lock-in',
          body: '17 block types with dedicated editors: inline editing, drag-and-drop ordering, undo/redo, autosave and per-site design tokens. Alternatively, write content in Obsidian and push to Git.' },
        { title: 'Provisioning that survives failure',
          body: 'The five-step pipeline (repo → seed → Vercel project → domain → registry) checkpoints state to the database after every step. An interrupted run is left diagnosable — no orphaned repos. A dry-run mode makes the pipeline unit-testable.' },
      ],
      outcomes: [
        { value: '17', label: 'block types + 16 editors' },
        { value: '5', label: 'steps of automated provisioning' },
        { value: '216', label: 'tests on pure logic' },
      ],
      highlights: [
        'Voice-driven site generation (ElevenLabs → Claude → published site)',
        'Automated GitHub + Vercel + domain provisioning',
        'Org-scoped API keys (only the SHA-256 hash is stored)',
        'Analytics and lead forms with a CRM export flag',
        'Site handoff to the customer with one command',
        'A formal ADR with an explicit risk table',
      ],
      links: [{ label: 'rascalpages.fi', href: 'https://rascalpages.fi' }],
    },
  },
},
```

- [ ] **Step 4: Run tests** — `npm test -- cases` still red (three cases missing) → proceed to Task 4.

---

### Task 4: Case content — Altio, Pesä, Perhe-app + commit

**Files:**
- Modify: `src/lib/cases.ts` (fill `entries` — last three)

- [ ] **Step 1: Altio entry** (slug `altio`; legacy alias `superhuman` handled in Task 2's `ALIASES`)

```ts
{
  slug: 'altio', year: '2026', featured: false,
  stack: [
    { group: 'App', items: ['Expo', 'React Native', 'TypeScript', 'NativeWind'] },
    { group: 'Backend', items: ['Supabase', 'pgvector', 'pg_cron', 'n8n'] },
    { group: 'AI & data', items: ['Claude', 'Whisper', 'Strava API', 'Mapbox'] },
  ],
  gallery: [],
  copy: {
    fi: {
      title: 'Altio',
      tagline: 'AI-valmentaja, joka perustelee neuvonsa sinun datallasi',
      client: 'Oma tuote (private beta)', role: 'Solo Developer',
      summary:
        'Treenin, ravinnon, palautumisen ja päiväkirjan yhdistävä valmennussovellus. Deterministinen progressiomoottori + LLM-valmentaja pgvector-muistilla. iOS, Android ja PWA yhdestä koodipohjasta.',
      problem:
        'Terveysdata on hajallaan eikä mikään sovellus kerro, mitä numeroille pitäisi tehdä. Halusin valmentajan, joka näkee kaiken — uni, treenit, ravinto, päiväkirja — ja perustelee jokaisen neuvonsa käyttäjän omalla datalla, ei internetin yleisviisauksilla.',
      approach: [
        { title: 'Kaksitasoinen valmennus',
          body: 'Deterministinen progressiomoottori laskee seuraavan treenin painot heti ja ilmaiseksi (RPE × toistot → +2,5 kg / pidä / -10 % deload). LLM-viikkokatsaus saa laskelman syötteekseen ja voi ohittaa sen palautumisdatan perusteella. Tylsä matematiikka on auditoitavaa — AI tuo harkinnan.' },
        { title: 'Muisti, joka tiivistyy yöllä',
          body: 'Joka yö Claude tiivistää viikon lokit tyypitetyiksi muistoiksi (treeni / palautuminen / mieli) pgvector-kantaan lähdeviitteineen. Valmentaja hakee ne kosinihaulla ja näyttää aina, mihin lukuihin neuvo nojaa.' },
        { title: 'Offline ensin',
          body: 'Jokainen kirjaus menee jonoon: epäonnistunut tallennus uudelleenyritetään eksponentiaalisella backoffilla, ja lopullisesti epäonnistuneet päätyvät käyttäjälle näkyvälle dead-letter-listalle. Sali kellarissa ei kaada mitään.' },
        { title: 'Tilastollinen insight-mainari',
          body: 'Pearson-korrelaatiot 60 päivän ikkunassa: uni vs. seuraavan päivän RPE, HRV vs. tonnage. Insight näytetään vain kun otos ≥ 10 ja |r| ≥ 0,25 — ei numerologiaa.' },
      ],
      outcomes: [
        { value: '35', label: 'näyttöä — iOS, Android ja PWA' },
        { value: '15', label: 'Supabase Edge Functionia' },
        { value: '~70 000', label: 'riviä koodia' },
      ],
      highlights: [
        'Strava-synkka kahteen suuntaan (luku + aktiviteettien vienti)',
        'GPS-juoksutracker ja "oikotie kotiin" -reititys Mapboxilla',
        'Ruoan kirjaus kolmella tavalla: viivakoodi, valokuva tai vapaa teksti',
        'Generoidut päivittäiset meditaatiot (Claude-skripti + TTS-ääni)',
        'Räätälöidyt SVG-visualisoinnit ilman chart-kirjastoa',
        'Private beta: app.altio.app',
      ],
      links: [
        { label: 'app.altio.app', href: 'https://app.altio.app' },
        { label: 'Blogi: näin se on rakennettu', href: '/blog/nain-superhuman-on-rakennettu' },
      ],
    },
    en: {
      title: 'Altio',
      tagline: 'An AI coach that cites your own data',
      client: 'Own product (private beta)', role: 'Solo Developer',
      summary:
        'A coaching app unifying training, nutrition, recovery and journaling. A deterministic progression engine + an LLM coach with pgvector memory. iOS, Android and PWA from one codebase.',
      problem:
        'Health data is scattered, and no app tells you what to do with the numbers. I wanted a coach that sees everything — sleep, sessions, food, journal — and backs every recommendation with the user’s own data, not generic internet wisdom.',
      approach: [
        { title: 'Two-tier coaching',
          body: 'A deterministic progression engine computes next session’s loads instantly and for free (RPE × reps → +2.5 kg / hold / -10% deload). The weekly LLM review takes that output as input and may override it based on recovery data. The boring math stays auditable — the AI adds judgment.' },
        { title: 'Memory that consolidates overnight',
          body: 'Every night Claude summarizes the week’s logs into typed memories (training / recovery / mindset) in pgvector, with source references. The coach retrieves them by cosine search and always shows which numbers a recommendation rests on.' },
        { title: 'Offline first',
          body: 'Every log entry goes through a write queue: failed saves retry with exponential backoff, and terminal failures land on a user-visible dead-letter list. A basement gym breaks nothing.' },
        { title: 'A statistical insight miner',
          body: 'Pearson correlations over a 60-day window: sleep vs. next-day RPE, HRV vs. tonnage. An insight only shows when n ≥ 10 and |r| ≥ 0.25 — no numerology.' },
      ],
      outcomes: [
        { value: '35', label: 'screens — iOS, Android and PWA' },
        { value: '15', label: 'Supabase Edge Functions' },
        { value: '~70,000', label: 'lines of code' },
      ],
      highlights: [
        'Two-way Strava sync (read + activity push)',
        'GPS run tracker with "shortcut home" routing via Mapbox',
        'Food logging three ways: barcode, photo or free text',
        'Generated daily meditations (Claude script + TTS audio)',
        'Hand-rolled SVG visualizations, no chart library',
        'Private beta: app.altio.app',
      ],
      links: [
        { label: 'app.altio.app', href: 'https://app.altio.app' },
        { label: 'Blog: how it’s built', href: '/en/blog/nain-superhuman-on-rakennettu' },
      ],
    },
  },
},
```

- [ ] **Step 2: Pesä entry**

```ts
{
  slug: 'pesa', year: '2026', featured: false,
  stack: [
    { group: 'App', items: ['Expo', 'React Native', 'Expo Router API routes'] },
    { group: 'Data', items: ['Neon Postgres', 'Drizzle ORM', 'Better Auth'] },
    { group: 'Quality', items: ['TypeScript strict', 'Zod', 'node:test'] },
  ],
  gallery: [],
  copy: {
    fi: {
      title: 'Pesä',
      tagline: 'Anna jokaiselle eurolle koti',
      client: 'Oma tuote', role: 'Solo Developer',
      summary:
        'YNAB-tyylinen kirjekuoribudjetointi + velkojen hallinta suomalaiseen arkeen. Kaikki raha kulkee kokonaislukusentteinä, ja velkavyörytys jakaa potin senttitarkasti. iOS, Android ja web yhdestä koodipohjasta.',
      problem:
        'Budjetointisovellukset budjetoivat peruutuspeilistä: ne näyttävät mihin raha meni, eivät auta päättämään mihin se menee. Ja velkaantuneelle tärkein työkalu — suunnitelmallinen velanmaksu korkoineen — puuttuu niistä kokonaan.',
      approach: [
        { title: '"Palkka tuli" -rituaali',
          body: 'Ei pankkipollausta taustalla. Kun palkka tulee, käyttäjä avaa yhden näkymän ja jakaa rahat kirjekuoriin — viisi minuuttia, jotka antavat hallinnan koko kuukaudeksi.' },
        { title: 'Velkavyörytys sentilleen',
          body: 'Allokaattori jakaa kuukausipotin velkojen kesken niin, että summa täsmää aina senttiin: minimit ensin, ylijäämä fokusvelalle, alijäämässä deterministinen largest-remainder-jako. Invariantti on yksikkötestattu.' },
        { title: 'Kaksinkertainen kirjanpito',
          body: 'Velanmaksu kirjaa kaksi linkitettyä tapahtumaa — tililtä ulos, velalle sisään — ja vetää samalla linkitettyä kirjekuorta. Korkotietoinen projektio kertoo, milloin velka on maksettu, ja kieltäytyy ennustamasta jos maksu ei kata edes korkoa.' },
        { title: 'Backend ilman backendia',
          body: 'Expo Router API routes hoitaa serveripuolen: samat +api.ts-tiedostot palvelevat natiiviapin ja webin. Neon Postgres + Drizzle, auth sekä tokenilla (natiivi) että cookiella (web) — yksi authmalli, kaksi kuljetusta.' },
      ],
      outcomes: [
        { value: '19', label: 'API-reittiä' },
        { value: '13', label: 'tietokantataulua' },
        { value: '2', label: 'kieltä (fi/en), 273 avainta' },
      ],
      highlights: [
        'Ready-to-Assign lasketaan yhdellä SQL-lausekkeella — velkatilit eivät voi vuotaa siihen',
        'Raha aina kokonaislukusentteinä — ei liukulukuvirheitä',
        'Kuusi tavoitekadenssia + eräpäivätavoitteet ("tarvitaan tässä kuussa")',
        'Henkilövelat kumpaankin suuntaan (minä velkaa / minulle velkaa)',
        'Lokalisoitu aloitusbudjetti (fi/en-kategoriapuut)',
      ],
      links: [{ label: 'Blogi: miksi rakensin Pesän', href: '/blog/pesa-anna-jokaiselle-eurolle-koti' }],
    },
    en: {
      title: 'Pesä',
      tagline: 'Give every euro a home',
      client: 'Own product', role: 'Solo Developer',
      summary:
        'YNAB-style envelope budgeting + debt management for Finnish life. All money moves as integer cents, and the debt-avalanche allocator splits the pool to the exact cent. iOS, Android and web from one codebase.',
      problem:
        'Budgeting apps budget through the rear-view mirror: they show where money went, not where it should go. And the tool that matters most to someone in debt — interest-aware, planned payoff — is missing from them entirely.',
      approach: [
        { title: 'The "salary arrived" ritual',
          body: 'No background bank polling. When income lands, the user opens one sheet and allocates the money into envelopes — five minutes that buy control of the whole month.' },
        { title: 'Debt avalanche, to the cent',
          body: 'The allocator splits the monthly pool across debts so the sum always matches exactly: minimums first, surplus to the focus debt, shortfalls resolved with a deterministic largest-remainder split. The invariant is unit-tested.' },
        { title: 'Double-entry bookkeeping',
          body: 'A debt payment writes two linked transactions — out of the account, into the debt — and draws down the linked envelope at the same time. An interest-aware projection tells you when the debt is gone, and refuses to project if the payment can’t even cover interest.' },
        { title: 'A backend without a backend',
          body: 'Expo Router API routes handle the server side: the same +api.ts files serve the native app and the web. Neon Postgres + Drizzle, auth via token (native) and cookie (web) — one auth model, two transports.' },
      ],
      outcomes: [
        { value: '19', label: 'API routes' },
        { value: '13', label: 'database tables' },
        { value: '2', label: 'languages (fi/en), 273 keys' },
      ],
      highlights: [
        'Ready-to-Assign computed in one SQL expression — debt accounts can’t leak into it',
        'Money always as integer cents — no floating-point errors',
        'Six target cadences + by-date targets ("needed this month")',
        'Personal debts in both directions (I owe / owed to me)',
        'Localized starter budget (fi/en category trees)',
      ],
      links: [{ label: 'Blog: why I built Pesä', href: '/en/blog/pesa-anna-jokaiselle-eurolle-koti' }],
    },
  },
},
```

- [ ] **Step 3: Perhe-app entry**

```ts
{
  slug: 'perhe-app', year: '2026', featured: false,
  stack: [
    { group: 'App', items: ['Expo', 'React Native', 'NativeWind', 'TanStack Query'] },
    { group: 'Backend', items: ['Supabase', 'Postgres RLS', 'Realtime'] },
  ],
  gallery: [],
  copy: {
    fi: {
      title: 'Arkireitti',
      tagline: 'Perheen tehtävätaulu — lapsille ilman tiliä',
      client: 'Oma tuote', role: 'Solo Developer',
      summary:
        'Perheen rutiinitaulu tablettiin ja vanhempien puhelimiin. Lapset kirjautuvat 5-merkkisellä koodilla ilman tiliä, vanhemmat näkevät edistymisen reaaliajassa. Rakennettu kolmessa päivässä.',
      problem:
        'Lapsi ei voi omistaa sähköpostia eikä salasanaa — mutta perheen yhteinen tehtävätaulu tarvitsee silti tunnistautumisen ja tietoturvan. Miten annetaan lapselle pääsy omaan tauluunsa heikentämättä koko kannan suojausta?',
      approach: [
        { title: 'Auth käyttäjille, joilla ei voi olla tiliä',
          body: 'Lapset kirjautuvat 5-merkkisellä koodilla, jonka aakkostosta on poistettu sekoittuvat merkit (ei 0/O/1/I). RLS pysyy tiukkana: lapsipolut kulkevat security definer -RPC:iden läpi, jotka validoivat omistajuuden serverillä joka kutsussa.' },
        { title: 'Realtime-taulu',
          body: 'Lapsi kuittaa tehtävän tabletilla — vanhemman puhelin päivittyy heti Supabase Realtimen kautta. Optimistiset mutaatiot rollbackilla pitävät käyttöliittymän välittömänä.' },
        { title: 'Nollakonfiguraatio-onboarding',
          body: 'Tietokantatriggerit hoitavat provisioinnin: rekisteröinti luo perheen, koodit generoituvat automaattisesti ja uusi lapsi saa 10 ikätasoista oletusrutiinia yhdessä transaktiossa. Toinen vanhempi liittyy 6-merkkisellä perhekoodilla.' },
      ],
      outcomes: [
        { value: '3', label: 'päivää ideasta valmiiseen' },
        { value: '16', label: 'Postgres-funktiota' },
        { value: '6', label: 'taulua, RLS kaikissa' },
      ],
      highlights: [
        'Kaksitasoinen auth: lapsikoodi + vanhemman sähköposti',
        'Kellonaikaa seuraava rutiininäkymä (aamu / koulun jälkeen / ilta)',
        'Yksi koodipohja: iOS, Android ja web — tabletti ja puhelin eri layouteilla',
        'Aikavyöhykekorrekti "tänään" (Europe/Helsinki, ei UTC-keskiyön bugia)',
        'Orpojen perheiden siivous kun vanhempi liittyy toiseen perheeseen',
      ],
      links: [],
    },
    en: {
      title: 'Arkireitti',
      tagline: 'A family task board — for kids without accounts',
      client: 'Own product', role: 'Solo Developer',
      summary:
        'A family routine board for a shared tablet and parents’ phones. Kids sign in with a 5-character code — no account — while parents see progress in real time. Built in three days.',
      problem:
        'A child can’t own an email address or a password — yet a shared family task board still needs authentication and security. How do you give a kid access to their own board without weakening the database’s protection?',
      approach: [
        { title: 'Auth for users who can’t have accounts',
          body: 'Kids sign in with a 5-character code drawn from an alphabet with confusable characters removed (no 0/O/1/I). RLS stays strict: child paths go through security definer RPCs that validate ownership server-side on every call.' },
        { title: 'A realtime board',
          body: 'A kid ticks a task on the tablet — the parent’s phone updates instantly via Supabase Realtime. Optimistic mutations with rollback keep the UI immediate.' },
        { title: 'Zero-config onboarding',
          body: 'Database triggers do the provisioning: signup creates the family, codes generate automatically, and a new child gets 10 age-appropriate default routines in one transaction. A second parent joins with a 6-character family code.' },
      ],
      outcomes: [
        { value: '3', label: 'days from idea to working app' },
        { value: '16', label: 'Postgres functions' },
        { value: '6', label: 'tables, RLS on all' },
      ],
      highlights: [
        'Two-tier auth: child code + parent email',
        'Clock-following routine view (morning / after school / evening)',
        'One codebase: iOS, Android and web — tablet and phone layouts',
        'Timezone-correct "today" (Europe/Helsinki, no UTC-midnight bug)',
        'Orphaned-family cleanup when a parent joins another household',
      ],
      links: [],
    },
  },
},
```

- [ ] **Step 4: Run tests** — `npm test -- cases` → PASS (all Task 2 tests green).
- [ ] **Step 5: Commit** `feat: bilingual case data for all six products with verified numbers`

---

### Task 5: Shared UI strings (i18n additions)

**Files:**
- Modify: `src/lib/i18n.ts`

**Interfaces:**
- Produces: extended `Dict` + `t(lang, key)` (existing function, new keys); `casePath(lang, slug)` helper.

- [ ] **Step 1: Extend the `Dict` type and both dictionaries** with these keys (add below the existing blog keys, keeping the existing ones untouched):

```ts
// Case pages
caseBack: string        // fi 'Takaisin projekteihin'            en 'Back to projects'
caseNotFound: string    // fi 'Projektia ei löytynyt'            en 'Project not found'
caseNotFoundBody: string// fi 'Tarkista osoite tai palaa projekteihin.' en 'Check the URL or head back to projects.'
caseProblem: string     // fi 'Ongelma'                          en 'Problem'
caseSolution: string    // fi 'Ratkaisu'                         en 'Solution'
caseGallery: string     // fi 'Galleria'                         en 'Gallery'
caseHighlights: string  // fi 'Mitä mukana'                      en 'Highlights'
caseStack: string       // fi 'Stack'                            en 'Stack'
caseImageComing: string // fi 'Kuva tulossa'                     en 'Image coming'
caseCtaTitle: string    // fi 'Rakennetaanko sinulle vastaava?'  en 'Want one like this?'
caseCtaBody: string     // fi 'Kerro projektistasi — vastaan yleensä saman päivän aikana.' en 'Tell me about your project — I usually reply the same day.'
caseOther: string       // fi 'Muut projektit'                   en 'Other projects'
// Contact form
formName: string        // fi 'Nimi'        en 'Name'
formCompany: string     // fi 'Yritys'      en 'Company'
formEmail: string       // fi 'Sähköposti'  en 'Email'
formMessage: string     // fi 'Viesti'      en 'Message'
formMessagePh: string   // fi 'Kerro lyhyesti mitä olette tekemässä ja missä voisin auttaa.' en 'Briefly: what you’re building and where I could help.'
formConsent: string     // fi 'Minulle saa lähettää sähköpostia projekteista ja kirjoituksista' en 'You may email me about projects and writing'
formSend: string        // fi 'Lähetä'      en 'Send'
formSending: string     // fi 'Lähetetään…' en 'Sending…'
formOkTitle: string     // fi 'Kiitos, viesti on lähetetty!' en 'Thanks — message sent!'
formOkBody: string      // fi 'Palaan sinulle pian sähköpostitse.' en 'I’ll get back to you by email soon.'
formError: string       // fi 'Lähetys epäonnistui — yritä hetken päästä uudelleen.' en 'Sending failed — please try again shortly.'
// Newsletter
nlTitle: string         // fi 'Saat uudet kirjoitukset mailiin'  en 'Get new posts by email'
nlBody: string          // fi 'Ei spämmiä — vain kun julkaisen jotain.' en 'No spam — only when I publish.'
nlPlaceholder: string   // fi 'sahkoposti@esimerkki.fi'          en 'you@example.com'
nlCta: string           // fi 'Tilaa'                            en 'Subscribe'
nlOk: string            // fi 'Kiitos! Olet listalla.'           en 'Thanks — you’re on the list.'
```

- [ ] **Step 2: Add the case path helper** next to `blogPostPath`:

```ts
export const casePath = (lang: Lang, slug: string): string =>
  lang === 'fi' ? `/projektit/${slug}` : `/en/projektit/${slug}`
export const homePath = (lang: Lang): string => (lang === 'fi' ? '/' : '/en')
```

- [ ] **Step 3:** `npm run lint && npm test` → green. Commit `feat: i18n strings for case pages, contact form and newsletter`

---

### Task 6: CasesSection island + remove the hard-coded Projektit HTML

**Files:**
- Create: `src/components/CasesSection.tsx`
- Modify: `src/site/markup.ts` (delete the PROJEKTIT section's inner HTML), `src/pages/Home.tsx` (splice the island)

**Interfaces:**
- Consumes: `getCases(lang)` from Task 2, `casePath` from Task 5.
- Produces: `<CasesSection lang={lang} />`; markup gains marker comment `<!-- PROJEKTIT -->` (already exists as a comment before the section — verify with grep and normalize so the section can be sliced out exactly like `<!-- BUILD IN PUBLIC -->` is).

- [ ] **Step 1: Locate the section boundaries.** Run `node --experimental-strip-types -e "import {SECTIONS_HTML} from './src/site/markup.ts'; console.log(SECTIONS_HTML.match(/<!--[^>]*-->/g))"` to list marker comments. The Projektit section starts at its marker comment and ends where the next section's marker starts (`<!-- TECH -->` or equivalent — verify the actual names).

- [ ] **Step 2: Delete the Projektit section's HTML** from the string (marker comment itself stays). Home.tsx will slice at the marker just like it does for BUILD IN PUBLIC.

- [ ] **Step 3: Write `CasesSection.tsx`.** Koneisto-style section rendered with Tailwind classes (tokens now match the home look). Structure:

```tsx
import { Link } from 'react-router'
import { getCases, type CaseStudy } from '../lib/cases'
import { casePath } from '../lib/i18n'
import type { Lang } from '../lib/parsePost'

const SECTION_COPY = {
  fi: {
    eyebrow: '01 — Projektit',
    title: 'Tuotantojärjestelmiä,\nei demoja',
    lead: 'Kuusi rakennettua tuotetta — kolme tuotannossa maksavilla asiakkailla. Klikkaa auki: jokaisessa on todennettavat luvut ja tekninen tarina.',
    featured: 'Featured',
  },
  en: {
    eyebrow: '01 — Projects',
    title: 'Production systems,\nnot demos',
    lead: 'Six products built — three in production with paying customers. Click through: each has verified numbers and a technical story.',
    featured: 'Featured',
  },
} as const

function Card({ c, lang, featured }: { c: CaseStudy; lang: Lang; featured: string }) {
  return (
    <Link
      to={casePath(lang, c.slug)}
      className="group block rounded-[14px] border border-border bg-white/[.015] p-7 transition-colors hover:border-border-hover hover:bg-white/[.03]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-text-muted">
          {c.client} · {c.role}
        </span>
        {c.featured && (
          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[.14em] text-text-secondary">
            {featured}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-text-primary">{c.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{c.summary}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {c.stack.flatMap((g) => g.items).slice(0, 5).map((item) => (
          <span key={item} className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-text-muted">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        {c.outcomes.map((o) => (
          <div key={o.label}>
            <div className="font-mono text-sm font-semibold text-text-primary">{o.value}</div>
            <div className="mt-0.5 text-[11px] leading-tight text-text-muted">{o.label}</div>
          </div>
        ))}
      </div>
    </Link>
  )
}

export default function CasesSection({ lang }: { lang: Lang }) {
  const t = SECTION_COPY[lang]
  const cases = getCases(lang)
  return (
    <section id="projektit" className="px-[clamp(20px,5vw,56px)] py-[90px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="font-mono text-xs uppercase tracking-[.2em] text-text-muted">{t.eyebrow}</div>
        <h2 className="mt-3 whitespace-pre-line text-[clamp(28px,4vw,44px)] font-semibold leading-tight text-text-primary">
          {t.title}
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">{t.lead}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((c) => (
            <Card key={c.slug} c={c} lang={lang} featured={t.featured} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Splice into Home.tsx.** Extend the existing slicing: markup is cut at `<!-- PROJEKTIT -->` and at `<!-- BUILD IN PUBLIC -->`; render `{beforeProjects}` → `<CasesSection lang={lang}/>` → `{betweenProjectsAndBuild}` → `<BuildInPublic/>` → `{afterBuild}`. Delete `PROJECT_SLUGS` and the card click-wiring `useEffect` (lines 9-14 and 31-38 of the old file) — the island handles navigation natively. (`lang` prop arrives in Task 8; for now hardcode `'fi'` and leave a `// TODO(task8)` — remove it in Task 8.)

- [ ] **Step 5: Visual check** at `/`: six cards render in the section, click navigates to `/projektit/<slug>`, hover states work, mobile stacks to one column (`npm run dev`, narrow the window).

- [ ] **Step 6:** `npm run lint && npm test && npm run build` (build gate) → Commit `feat: generate home project cards from cases.ts (single source of truth)`

---

### Task 7: markup.ts → sectionsHtml(lang) + copy.ts (new hero, honest koneisto, EN home)

**Files:**
- Create: `src/site/copy.ts`
- Modify: `src/site/markup.ts`, `src/components/Nav.tsx` + `src/pages/Home.tsx` (call sites), `src/site/effects.ts` (only if `runKoneisto` references removed counter nodes)

This is the largest mechanical task. The current file exports two string constants built from one giant template. Convert both to functions of `lang` interpolating from a copy dict. **Structure and inline styles must not change** — only text nodes become `${c.key}` interpolations.

**Interfaces:**
- Produces: `export function sectionsHtml(lang: Lang): string`, `export function navHtml(lang: Lang): string` (delete the old constant exports), `src/site/copy.ts` exporting `homeCopy: Record<Lang, HomeCopy>` where `HomeCopy` is a flat `Record<string, string>`-style object typed explicitly.

- [ ] **Step 1: Create `src/site/copy.ts`.** Keys grouped by section. FI values: lift the existing Finnish strings verbatim from markup.ts **except** hero + koneisto which get NEW copy (below). EN: translations given below. The full dict (abbreviating only repeated structure — every key listed must exist in both languages):

```ts
import type { Lang } from '../lib/parsePost'

export type HomeCopy = typeof FI
const FI = {
  // NAV
  navManifesto: 'Manifesti', navProjects: 'Projektit', navTech: 'Tech',
  navStory: 'Tarina', navBlog: 'Blogi', navCta: 'Ota yhteyttä', navLangSwitch: 'In English',
  // HERO — NEW COPY (positioning change)
  heroBadge: 'Avoinna uusille projekteille',
  heroTitleA: 'Tuotteita, jotka pyörivät', heroTitleB: 'tuotannossa.', heroTitleC: 'Ei demoja.',
  heroSub: 'Sami Kiias · CTO @ Rascal AI · Founder @ Mak8r.fi',
  heroBody:
    'Rakennan fullstack-tuotteita ideasta tuotantoon: multi-tenant SaaS, mobiilisovellukset ja AI-integraatiot. Kuusi rakennettua tuotetta — kolme tuotannossa maksavilla asiakkailla. 11 vuotta yrittäjyyttä: puhun sekä bisneksen että koodin kieltä.',
  heroCta1: 'Keskustellaan projektista', heroCta2: 'Katso projektit',
  heroStat1v: '6', heroStat1l: 'Tuotetta rakennettu',
  heroStat2v: '400k+', heroStat2l: 'Riviä koodia tuotannossa',
  heroStat3v: '3 000+', heroStat3l: 'Automaattitestiä',
  heroTerminalTitle: 'koneisto — tuotanto',
  // KONEISTO (live section) — NEW COPY: the site's own real lead pipeline
  koneistoLive: 'Live · tämän sivun oma putki',
  koneistoTitleA: 'Näin yhteydenottosi', koneistoTitleB: 'kulkee tällä sivulla',
  koneistoLead:
    'Ei kuvitteellista demoa: tämä on tämän sivuston oma liidiputki. Jokainen lomakkeen lähetys kulkee tämän läpi — validoinnista tallennukseen ja notifikaatioon.',
  kStep1t: 'Lomake täytetty', kStep1s: 'React · honeypot-suojaus',
  kStep2t: 'Validointi', kStep2s: 'Vercel Function',
  kStep3t: 'Tallennus', kStep3s: 'Neon Postgres',
  kStep4t: 'Markkinointilupa?', kStep4s: 'suostumus talteen',
  kStep5t: 'Brevo-lista', kStep5s: 'jos lupa annettu',
  kStep6t: 'Notifikaatio', kStep6s: '✓ sähköposti minulle',
  koneistoLogTitle: 'Execution log · /api/contact',
  koneistoFootnote: 'Sama arkkitehtuuri, jolla rakennan asiakkaille — pienoiskoossa.',
  // MANIFESTI — keep existing FI verbatim (titles + 6 bodies + intro)
  manEyebrow: '— Periaatteet', manTitleA: 'Automaatio on', manTitleB: 'uusi lukutaito.',
  manIntro: 'En pidä automaatiota hypenä vaan taitona — osa työtä, niin kuin lukeminen ja kirjoittaminen aikoinaan. Se ei korvaa osaamista, vaan rakentuu sen päälle. Tässä muutama periaate, joiden mukaan rakennan.',
  man1: 'Automaatio ei ole IT-projekti, vaan tapa ajatella työtä: mitä koneen kannattaa hoitaa ja mitä ihmisen. Useimmiten se raja on eri kohdassa kuin aluksi luulee.',
  man2: 'Toistuvat työt kannattaa antaa koneelle. Silloin ihmiselle jää se, missä hän on oikeasti hyvä — ajattelu, suhteet ja ratkaisujen keksiminen. Kone hoitaa toiston paremmin.',
  man3: 'AI ei ole taikuri. Se on työkalu, ja työkalu on juuri niin hyvä kuin se kuka sitä käyttää. Tulos riippuu siitä, miten huolella se rakennetaan.',
  man4: 'Rakennettu ei aina voita ostettua, mutta kun ymmärtää miten kone toimii, valinta on oma. Valmis työkalu sopeuttaa sinut itseensä — oma järjestelmä taipuu sinun mukaasi.',
  man5: 'Demo on helppo, tuotanto on vaikeaa. Slide deck ei pyöritä yritystä. Arvo syntyy vasta kun järjestelmä toimii oikeilla asiakkailla, päivästä toiseen.',
  man6: 'Jos teet saman asian kahdesti, se kannattaa yleensä automatisoida kolmanteen kertaan. Pienistäkin toistoista kertyy yllättävän paljon aikaa.',
  // TECH — keep existing FI verbatim (eyebrow, title, intro, 5 layers × (name+desc), 3 principles × (title+body))
  techEyebrow: '02 — Rakennettu, ei ostettu', techTitle: 'Näin rakennan koneiston',
  techIntro: 'En osta valmista markkinointi- tai tuotekoneistoa. Rakennan sen — AI-natiivina päättelystä ajoon, kytkettynä yhteen APIn yli. Sama stack pyörittää sekä omia tuotteitani että asiakasprojekteja.',
  techL1n: 'Reasoning', techL1d: 'Päättely ja generointi. Claude vetää tuotannossa ja kehityksessä — muut mallit erikoistehtäviin ja vertailuun.',
  techL2n: 'Build', techL2d: 'Agenttinen kehitys. Kirjoitan järjestelmät Claude Codella ja kytken työkalut MCP:llä — APIn yli, ei käyttöliittymää klikkaamalla.',
  techL3n: 'Product', techL3d: 'Missä järjestelmät ajetaan. Multi-tenant SaaS, RLS-eristetty data, vektorihaut ja edge-deploy jokaiselle muutokselle.',
  techL4n: 'Automation', techL4d: 'Koneiston liima. Self-hosted n8n hoitaa workflowt, webhookit ja integraatiot palasta toiseen — täysi kontrolli dataan.',
  techL5n: 'Generative media', techL5d: 'AI-natiivi sisältö. Kuva, video, ääni ja avatarit promptista valmiiksi materiaaliksi — sama API-logiikka kuin muuallakin.',
  techP1t: '01 · API-first', techP1b: 'Lähes kaikki ajetaan rajapintojen yli, ei käyttöliittymistä klikkaamalla. Koneisto, ei kasa tilauksia.',
  techP2t: '02 · Rakennettu, ei ostettu', techP2b: 'Kun rakentaminen kannattaa, rakennan sen itse. Ostan vain siellä missä se ei oikeasti kannata.',
  techP3t: '03 · Sama stack, oikeat asiakkaat', techP3b: 'Tämä ei ole demo-stack. Sama koneisto pyörittää Rascal AI:ta ja asiakasprojekteja tuotannossa.',
  // BUILD IN PUBLIC static intro
  bipEyebrow: '03 — YouTube · @samikiias', bipTitle: 'Build in Public',
  bipIntro: 'Dokumentoin matkaa AI-järjestelmien rakentajana. Tutoriaaleja, projektien läpikäyntejä ja rehellisiä ajatuksia.',
  // TARINA — keep existing FI verbatim; NOTE: update the 2025 entry to 2025–2026 & product-builder angle
  storyEyebrow: '04 — Tarina', storyTitle: 'Yrittäjästä AI-rakentajaksi',
  storyIntro: 'Epätyypillinen polku yrittäjästä AI-järjestelmien rakentajaksi. Jokainen vaihe toi uuden näkökulman.',
  story1y: '2015', story1r: 'Yrittäjä', story1o: 'Ensimmäinen yritys',
  story1b: 'Aloitin yrittäjänä. Opin ymmärtämään asiakkaita, myyntiä ja liiketoiminnan perusteita käytännön kautta.',
  story2y: '2022', story2r: 'Markkinoija', story2o: 'Haaga-Helia',
  story2b: 'Liiketalouden tradenomi markkinoinnin suuntautumisella. Digitaalinen markkinointi ja analytiikka.',
  story3y: '2024', story3r: 'Kehittäjä', story3o: 'Full-stack',
  story3b: 'Itseoppinut kehittäjä. React, TypeScript, Node.js ja modernit pilvipalvelut. Ideat muuttuivat tuotteiksi.',
  story4y: '2025', story4r: 'CTO & tuoterakentaja', story4o: 'Rascal AI',
  story4b: 'Rakennan tuotteita, jotka pyörivät tuotannossa maksavilla asiakkailla: kolme Rascal-tuotetta ja kolme omaa sovellusta — yli 400 000 riviä koodia.',
  storyQuote: '“Epätyypillinen tausta on vahvuus — ymmärrän sekä bisneksen että teknologian kielen.”',
  storyName: 'Sami Kiias', storyRole: 'CTO @ Rascal AI',
  storyStat1v: '11', storyStat1l: 'Vuotta yrittäjänä',
  storyStat2v: '6', storyStat2l: 'Tuotetta rakennettu',
  storyStat3v: '423', storyStat3l: 'Julkaisua tuotantoon',
  // YHTEYS — NEW angle
  contactEyebrow: '05 — Ota yhteyttä', contactTitleA: 'Rakennetaanko', contactTitleB: 'seuraava tuotteesi?',
  contactBody: 'Olipa kyse uudesta tuotteesta, MVP:stä tai AI-ominaisuudesta olemassa olevaan järjestelmään — kerro tilanteestasi, niin katsotaan miten se kannattaa rakentaa.',
  contactReply: 'Vastaan yleensä saman päivän aikana.',
  contactFollow: 'Seuraa ja verkostoidu',
  contactLi: 'LinkedIn', contactLiCta: 'Verkostoidu →',
  contactYt: 'YouTube', contactYtCta: 'Katso sisältöä →',
  contactGh: 'GitHub', contactGhCta: 'Tutustu koodiin →',
  contactCompanies: 'Yritykset',
  contactC1n: 'Rascal AI', contactC1d: 'AI-markkinointi ja -myynti pk-yrityksille — kolme tuotetta', contactC1r: 'CTO',
  contactC2n: 'Altio', contactC2d: 'AI-valmennussovellus — treeni, ravinto ja palautuminen', contactC2r: 'Solo Dev',
  contactC3n: 'Mak8r.fi', contactC3d: 'Tuotekehitys- ja AI-projektit toimeksiannosta', contactC3r: 'Founder',
} as const

const EN: HomeCopy = {
  navManifesto: 'Manifesto', navProjects: 'Projects', navTech: 'Tech',
  navStory: 'Story', navBlog: 'Blog', navCta: 'Get in touch', navLangSwitch: 'Suomeksi',
  heroBadge: 'Open for new projects',
  heroTitleA: 'Products that run', heroTitleB: 'in production.', heroTitleC: 'Not demos.',
  heroSub: 'Sami Kiias · CTO @ Rascal AI · Founder @ Mak8r.fi',
  heroBody:
    'I build fullstack products from idea to production: multi-tenant SaaS, mobile apps and AI integrations. Six products built — three in production with paying customers. 11 years of entrepreneurship: I speak both business and code.',
  heroCta1: 'Let’s talk about your project', heroCta2: 'See the projects',
  heroStat1v: '6', heroStat1l: 'Products built',
  heroStat2v: '400k+', heroStat2l: 'Lines of code in production',
  heroStat3v: '3,000+', heroStat3l: 'Automated tests',
  heroTerminalTitle: 'koneisto — production',
  koneistoLive: 'Live · this site’s own pipeline',
  koneistoTitleA: 'How your message', koneistoTitleB: 'travels on this site',
  koneistoLead:
    'Not a mock demo: this is this website’s own lead pipeline. Every form submission passes through it — validation, storage, notification.',
  kStep1t: 'Form submitted', kStep1s: 'React · honeypot guard',
  kStep2t: 'Validation', kStep2s: 'Vercel Function',
  kStep3t: 'Storage', kStep3s: 'Neon Postgres',
  kStep4t: 'Marketing consent?', kStep4s: 'consent recorded',
  kStep5t: 'Brevo list', kStep5s: 'if consent given',
  kStep6t: 'Notification', kStep6s: '✓ email to me',
  koneistoLogTitle: 'Execution log · /api/contact',
  koneistoFootnote: 'The same architecture I build for clients — in miniature.',
  manEyebrow: '— Principles', manTitleA: 'Automation is', manTitleB: 'the new literacy.',
  manIntro: 'I treat automation as a skill, not hype — part of the job, like reading and writing once were. It doesn’t replace competence; it builds on it. A few principles I build by.',
  man1: 'Automation isn’t an IT project — it’s a way of thinking about work: what the machine should handle and what the human should. The line is usually somewhere other than you first think.',
  man2: 'Repetitive work belongs to the machine. That leaves people what they’re actually good at — thinking, relationships, inventing solutions. The machine repeats better.',
  man3: 'AI isn’t a magician. It’s a tool, and a tool is exactly as good as the person wielding it. The result depends on how carefully it’s built.',
  man4: 'Built doesn’t always beat bought, but when you understand how the machine works, the choice is yours. An off-the-shelf tool bends you to it — your own system bends to you.',
  man5: 'Demos are easy; production is hard. A slide deck doesn’t run a company. Value appears only when the system works with real customers, day after day.',
  man6: 'If you do the same thing twice, automate it before the third time. Even small repetitions add up to a surprising amount of time.',
  techEyebrow: '02 — Built, not bought', techTitle: 'How I build the machine',
  techIntro: 'I don’t buy a ready-made marketing or product machine. I build it — AI-native from reasoning to runtime, wired together over APIs. The same stack runs my own products and client projects.',
  techL1n: 'Reasoning', techL1d: 'Inference and generation. Claude leads in production and development — other models for special tasks and comparison.',
  techL2n: 'Build', techL2d: 'Agentic development. I write systems with Claude Code and wire tools over MCP — through APIs, not by clicking UIs.',
  techL3n: 'Product', techL3d: 'Where systems run. Multi-tenant SaaS, RLS-isolated data, vector search and edge deploys for every change.',
  techL4n: 'Automation', techL4d: 'The machine’s glue. Self-hosted n8n runs workflows, webhooks and integrations end to end — full control of the data.',
  techL5n: 'Generative media', techL5d: 'AI-native content. Image, video, voice and avatars from prompt to finished material — the same API logic as everywhere else.',
  techP1t: '01 · API-first', techP1b: 'Almost everything runs over APIs, not by clicking UIs. A machine, not a pile of subscriptions.',
  techP2t: '02 · Built, not bought', techP2b: 'When building pays off, I build it myself. I buy only where building truly doesn’t.',
  techP3t: '03 · Same stack, real customers', techP3b: 'This is not a demo stack. The same machine runs Rascal AI and client projects in production.',
  bipEyebrow: '03 — YouTube · @samikiias', bipTitle: 'Build in Public',
  bipIntro: 'I document the journey of building AI systems. Tutorials, project walkthroughs and honest thoughts.',
  storyEyebrow: '04 — Story', storyTitle: 'From entrepreneur to AI builder',
  storyIntro: 'An unusual path from entrepreneur to builder of AI systems. Every stage added a new perspective.',
  story1y: '2015', story1r: 'Entrepreneur', story1o: 'First company',
  story1b: 'I started as an entrepreneur — learning customers, sales and business fundamentals hands-on.',
  story2y: '2022', story2r: 'Marketer', story2o: 'Haaga-Helia',
  story2b: 'BBA in business, specializing in marketing. Digital marketing and analytics.',
  story3y: '2024', story3r: 'Developer', story3o: 'Full-stack',
  story3b: 'Self-taught developer. React, TypeScript, Node.js and modern cloud. Ideas turned into products.',
  story4y: '2025', story4r: 'CTO & product builder', story4o: 'Rascal AI',
  story4b: 'I build products that run in production with paying customers: three Rascal products and three apps of my own — over 400,000 lines of code.',
  storyQuote: '“An unusual background is a strength — I speak both business and technology.”',
  storyName: 'Sami Kiias', storyRole: 'CTO @ Rascal AI',
  storyStat1v: '11', storyStat1l: 'Years as an entrepreneur',
  storyStat2v: '6', storyStat2l: 'Products built',
  storyStat3v: '423', storyStat3l: 'Releases shipped',
  contactEyebrow: '05 — Get in touch', contactTitleA: 'Shall we build', contactTitleB: 'your next product?',
  contactBody: 'A new product, an MVP, or an AI feature for an existing system — tell me where you are, and we’ll figure out how it should be built.',
  contactReply: 'I usually reply the same day.',
  contactFollow: 'Follow and connect',
  contactLi: 'LinkedIn', contactLiCta: 'Connect →',
  contactYt: 'YouTube', contactYtCta: 'Watch →',
  contactGh: 'GitHub', contactGhCta: 'See the code →',
  contactCompanies: 'Companies',
  contactC1n: 'Rascal AI', contactC1d: 'AI marketing & sales for SMBs — three products', contactC1r: 'CTO',
  contactC2n: 'Altio', contactC2d: 'AI coaching app — training, nutrition and recovery', contactC2r: 'Solo Dev',
  contactC3n: 'Mak8r.fi', contactC3d: 'Product development and AI projects on commission', contactC3r: 'Founder',
}

export const homeCopy: Record<Lang, HomeCopy> = { fi: FI, en: EN }
```

Notes:
- The hero H1 in markup renders as three spans/lines — map `heroTitleA/B/C` onto the existing line structure (currently "Automaatio on / uusi lukutaito. / Rakennan sillä joka päivä."). If the markup has only two line slots, merge B+C.
- The old hero stats (50+/8–10h/11v) and the koneisto counters (127/17s/94%) are REPLACED by the new keys — verify with `grep -o "127\|17s\|94%" src/site/markup.ts` → no matches after this task.
- The tech marquee items, tool names and the terminal's command line (`samikiias@rascal:~$ ./status`) are language-neutral — leave as-is in the template.
- The Yhteys section's `sami@mak8r.fi` stays visible as a contact detail (allowed), but the primary CTA button in that section becomes the form island (Task 13).

- [ ] **Step 2: Convert `markup.ts`.** Change the file to:

```ts
import type { Lang } from '../lib/parsePost'
import { homeCopy } from './copy'

export function navHtml(lang: Lang): string {
  const c = homeCopy[lang]
  return `...existing NAV_HTML template with ${'${c.navProjects}'} etc...`
}

export function sectionsHtml(lang: Lang): string {
  const c = homeCopy[lang]
  return `...existing SECTIONS_HTML template with interpolations...`
}
```

Mechanically: change the outer quotes to backticks, escape any literal backticks/`${` in the HTML (there are none expected — verify with `grep -c '`' src/site/markup.ts`), then replace each Finnish text node with its `${c.key}`. Work section by section; after each section run the dev server and diff visually against git stash if unsure.

- [ ] **Step 3: Update call sites.** `Nav.tsx`: `NAV_HTML` → `navHtml(lang)` (lang from a prop, Task 8 wires it; interim: `navHtml('fi')`). `Home.tsx`: `SECTIONS_HTML` → `sectionsHtml(lang)`.

- [ ] **Step 4: Update `effects.ts` if needed.** `runKoneisto()` animates the pipeline steps and possibly the counter numbers. If it references the removed counter elements (grep for the counter IDs/classes in `src/site/effects.ts`), delete those references so the animation runs on the 6 steps + log only. The log lines it types out must be updated to describe the real pipeline (e.g. `POST /api/contact → 200`, `insert portfolio_leads → id 42`, `brevo: contact upserted`, `notify: email sent`) — static strings in effects.ts or markup, no fake counts.

- [ ] **Step 5: Verify.** `npm run dev`: `/` renders identically in structure, new hero text, honest koneisto. `grep -n "127\|17 s\|94 %" src/site/*.ts` → empty. `npm run build` (build gate).

- [ ] **Step 6: Commit** `feat: bilingual home markup with honest hero and pipeline copy`

---

### Task 8: /en routes + language switcher

**Files:**
- Modify: `src/main.tsx`, `src/pages/Home.tsx`, `src/pages/CaseStudy.tsx` (prop only — full page work in Task 9), `src/components/Nav.tsx`

**Interfaces:**
- Produces: `Home({ lang })`, `CaseStudy({ lang })`, `Nav({ lang })` — all default `'fi'`. Routes: `/en`, `/en/projektit/:slug`.

- [ ] **Step 1: Routes** in `src/main.tsx` (add below the existing ones):

```tsx
<Route path="/en" element={<Home lang="en" />} />
<Route path="/projektit/:slug" element={<CaseStudy lang="fi" />} />
<Route path="/en/projektit/:slug" element={<CaseStudy lang="en" />} />
```

(The existing `/projektit/:slug` route line is replaced by the explicit-lang version.)

- [ ] **Step 2: Home lang prop.** `export default function Home({ lang = 'fi' }: { lang?: Lang })` — pass to `sectionsHtml(lang)`, `<CasesSection lang={lang}/>`, `<Nav lang={lang}/>` and (Task 13) the contact island. Remove the Task 6 TODO.

- [ ] **Step 3: Nav switcher.** `Nav({ lang = 'fi' })`: render `navHtml(lang)`; anchor-prefix rewrite becomes `href="${homePath(lang)}#`. Add a switcher link into the nav template (in markup.ts, next to the CTA pill): `<a id="lang-switch" href="#">${c.navLangSwitch}</a>` styled like the other nav links. In Nav.tsx wire it: compute the mirrored path of `location.pathname` (`/` ↔ `/en`, `/projektit/x` ↔ `/en/projektit/x`, `/blog...` ↔ `/en/blog...`, `/yhteys` and other fi-only pages → `/en`), `navigate` on click.

```ts
export function mirrorPath(pathname: string): string {
  if (pathname === '/en' || pathname.startsWith('/en/')) return pathname.replace(/^\/en\/?/, '/') || '/'
  if (pathname === '/') return '/en'
  if (pathname.startsWith('/projektit/') || pathname.startsWith('/blog')) return `/en${pathname}`
  return '/en'
}
```

Put `mirrorPath` in `src/lib/i18n.ts` with a unit test in a new `src/lib/i18n.test.ts` covering: `/`→`/en`, `/en`→`/`, `/projektit/pesa`→`/en/projektit/pesa`, `/en/blog/x`→`/blog/x`, `/yhteys`→`/en`.

- [ ] **Step 4: Head tags.** In `Home.tsx` add a `useEffect` calling the existing `applyHead` (`src/lib/head.ts`):

```ts
useEffect(() => {
  applyHead({
    lang,
    title: lang === 'fi'
      ? 'Sami Kiias — Fullstack-tuoterakentaja'
      : 'Sami Kiias — Fullstack product builder',
    description: homeCopy[lang].heroBody,
    canonical: homePath(lang),
    alternates: [
      { hreflang: 'fi', path: '/' },
      { hreflang: 'en', path: '/en' },
    ],
  })
}, [lang])
```

- [ ] **Step 5: Test + verify.** `npm test` (mirrorPath tests green). Dev server: `/en` shows English home, switcher toggles and preserves page on `/projektit/pesa`.
- [ ] **Step 6: Commit** `feat: English home route and language switcher`

---

### Task 9: CaseStudy page — lang, i18n labels, form CTA (mailto removed)

**Files:**
- Modify: `src/pages/CaseStudy.tsx`

**Interfaces:**
- Consumes: `getCaseStudy(slug, lang)` (Task 2), `t(lang, key)` + `casePath`/`homePath` (Task 5), `applyHead` (existing), `ContactForm` with `lang` + `source` props (Task 11 adds `lang`; use it here already — Task 11 lands before this page is user-visible in EN, or accept a transient TS error by doing Task 11 first. ORDER: execute Task 11 before Task 9 if working strictly sequentially; the plan lists Task 9 here because it depends conceptually on Tasks 2+5).

- [ ] **Step 1: Signature + data.** `export default function CaseStudy({ lang = 'fi' }: { lang?: Lang })`; `const study = slug ? getCaseStudy(slug, lang) : undefined`. Replace every hardcoded Finnish label with `t(lang, ...)`: back-link → `caseBack`, section headers → `caseProblem`/`caseSolution`/`caseGallery`/`caseHighlights`/`caseStack`, empty-gallery text → `caseImageComing`, not-found texts → `caseNotFound`/`caseNotFoundBody`. Back-links `to="/#cases"` → `to={homePath(lang) + '#projektit'}` (note: the anchor is `#projektit`, `#cases` never existed after the redesign). Pass `lang` to `<Nav lang={lang}/>`.

- [ ] **Step 2: Legacy alias redirect.** If `slug === 'superhuman'` and the study resolved, `<Navigate to={casePath(lang, 'altio')} replace />` so the canonical URL wins.

- [ ] **Step 3: CTA section — replace the mailto block.** The CTA card keeps its title/body (now `t(lang,'caseCtaTitle')` / `caseCtaBody`) but the buttons are replaced by an inline form:

```tsx
<section className="max-w-3xl mx-auto px-8 mt-24">
  <div className="rounded-2xl border border-border bg-bg-secondary p-8">
    <h2 className="text-2xl font-semibold text-text-primary mb-2 text-center">{t(lang, 'caseCtaTitle')}</h2>
    <p className="text-text-secondary mb-8 max-w-lg mx-auto text-center">{t(lang, 'caseCtaBody')}</p>
    <div className="max-w-lg mx-auto">
      <ContactForm source={`case:${study.slug}`} lang={lang} />
    </div>
    <div className="mt-6 text-center">
      <Link to={homePath(lang) + '#projektit'} className="text-sm text-text-muted hover:text-text-primary transition-colors">
        {t(lang, 'caseOther')}
      </Link>
    </div>
  </div>
</section>
```

Keep the PostHog event: fire `capture('case_study_contact_clicked', { case_slug: slug })` from the form's submit success instead — ContactForm gets an optional `onSuccess?: () => void` prop (Task 11) and this page passes it.

- [ ] **Step 4: Head tags.**

```ts
useEffect(() => {
  if (!study) return
  applyHead({
    lang,
    title: `${study.title} — Sami Kiias`,
    description: study.summary,
    canonical: casePath(lang, study.slug),
    alternates: [
      { hreflang: 'fi', path: casePath('fi', study.slug) },
      { hreflang: 'en', path: casePath('en', study.slug) },
    ],
  })
}, [lang, study])
```

- [ ] **Step 5: Verify** all six cases render in both languages (`/projektit/rascal-pages`, `/en/projektit/perhe-app`, `/projektit/superhuman` redirects to `/projektit/altio`). `grep -n "mailto:" src/pages/CaseStudy.tsx` → empty.
- [ ] **Step 6: Commit** `feat: bilingual case pages with inline lead form CTA`

---

### Task 10: Lead backend — consent column, parseLead, Brevo list sync

**Files:**
- Modify: `db/schema.sql`, `api/_lib/leads.ts`, `api/contact.ts`
- Create: `api/_lib/leads.test.ts`

**Interfaces:**
- Produces: `LeadInput` gains `marketingConsent: boolean`; new `export async function syncToBrevo(lead: LeadInput): Promise<boolean>`; `storeLead` persists consent.

- [ ] **Step 1: Schema.** Append to `db/schema.sql`:

```sql
alter table portfolio_leads add column if not exists marketing_consent boolean not null default false;
alter table portfolio_leads add column if not exists consent_at timestamptz;
```

Apply to Neon: `set -a && source .env && set +a && psql "$DATABASE_URL" -c "alter table portfolio_leads add column if not exists marketing_consent boolean not null default false; alter table portfolio_leads add column if not exists consent_at timestamptz;"` (if `psql` is unavailable, use the Neon MCP `run_sql` tool against the "Portfolio" project — see `env-neon.txt` for which project). Verify: `psql "$DATABASE_URL" -c "\d portfolio_leads"` shows both columns.

- [ ] **Step 2: Failing tests** in `api/_lib/leads.test.ts` (Vitest picks up `api/**/*.test.ts` — confirm with `npm test -- leads`; if the vitest config excludes `api/`, check how `api/_lib/parsers.test.ts` is included and mirror it — it IS included today, so this just works):

```ts
import { describe, it, expect } from 'vitest'
import { parseLead } from './leads.js'

const base = { name: 'Testi', email: 'a@b.fi', message: 'Moi' }

describe('parseLead consent', () => {
  it('defaults marketingConsent to false', () => {
    const r = parseLead(base)
    expect(r.ok && r.lead.marketingConsent).toBe(false)
  })
  it.each([true, 'true', 'on'])('accepts %s as consent', (v) => {
    const r = parseLead({ ...base, marketingConsent: v })
    expect(r.ok && r.lead.marketingConsent).toBe(true)
  })
  it('rejects garbage without failing the lead', () => {
    const r = parseLead({ ...base, marketingConsent: 'banana' })
    expect(r.ok && r.lead.marketingConsent).toBe(false)
  })
  it('newsletter source with consent needs no long message', () => {
    const r = parseLead({ name: 'Tilaaja', email: 'a@b.fi', message: '(newsletter)', source: 'newsletter:blog', marketingConsent: true })
    expect(r.ok).toBe(true)
  })
})
```

Run → FAIL (`marketingConsent` not on type).

- [ ] **Step 3: Implement.** In `api/_lib/leads.ts`:

```ts
export type LeadInput = {
  name: string
  email: string
  company?: string
  message: string
  source?: string
  marketingConsent: boolean
}
```

In `parseLead`, after `source`: `const marketingConsent = r.marketingConsent === true || r.marketingConsent === 'true' || r.marketingConsent === 'on'` and include it in the returned lead. In `storeLead`, extend the insert:

```ts
insert into portfolio_leads (name, email, company, message, source, marketing_consent, consent_at)
values (${lead.name}, ${lead.email}, ${lead.company ?? null}, ${lead.message}, ${lead.source ?? null},
        ${lead.marketingConsent}, ${lead.marketingConsent ? new Date().toISOString() : null})
```

Add `syncToBrevo` (below `notifyLead`):

```ts
/**
 * Best-effort Brevo contact-list sync. Only runs when the visitor gave
 * marketing consent. Uses BREVO_API_KEY + BREVO_LIST_ID; no-op otherwise.
 */
export async function syncToBrevo(lead: LeadInput): Promise<boolean> {
  if (!lead.marketingConsent) return false
  const key = process.env.BREVO_API_KEY
  const listId = Number(process.env.BREVO_LIST_ID)
  if (!key || !Number.isFinite(listId)) return false
  try {
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'api-key': key, 'content-type': 'application/json' },
      body: JSON.stringify({
        email: lead.email,
        updateEnabled: true,
        listIds: [listId],
        attributes: { FIRSTNAME: lead.name, COMPANY: lead.company ?? '' },
      }),
    })
    return res.ok || res.status === 204
  } catch {
    return false
  }
}
```

- [ ] **Step 4: Wire into the handler.** In `api/contact.ts`'s POST path, next to the existing `storeLead`/`notifyLead` calls (they run in parallel via `Promise.all` or sequentially — match the existing style), add `syncToBrevo(lead)` as an equally best-effort call. Also update `listLeads`'s select + `LeadSummary` to include `marketingConsent` so `/hallinta` shows who opted in (add the column to the select, map `marketing_consent`). In `src/pages/Admin.tsx` add a small "✓ lupa" badge next to leads with consent — display only, no logic change.

- [ ] **Step 5: Run** `npm test -- leads` → PASS. `npm run lint`.
- [ ] **Step 6: Env note.** `BREVO_LIST_ID` must be set in Vercel env + `.env` — if the Brevo list doesn't exist yet, create one named "Portfolio" in Brevo (Contacts → Lists) and note its numeric id. If you cannot access Brevo, leave the env unset (code no-ops) and flag it in the final report.
- [ ] **Step 7: Commit** `feat: marketing consent + Brevo list sync for lead capture`

---

### Task 11: ContactForm — consent checkbox + lang + onSuccess

**Files:**
- Modify: `src/components/ContactForm.tsx`

**Interfaces:**
- Produces: `ContactForm({ source = 'yhteys', lang = 'fi', onSuccess }: { source?: string; lang?: Lang; onSuccess?: () => void })`

- [ ] **Step 1:** Replace hardcoded Finnish strings with `t(lang, 'formName' | 'formCompany' | 'formEmail' | 'formMessage' | 'formMessagePh' | 'formSend' | 'formSending' | 'formOkTitle' | 'formOkBody' | 'formError')`.

- [ ] **Step 2: Consent checkbox** above the submit button:

```tsx
<label className="flex items-start gap-2.5 text-sm text-text-secondary cursor-pointer">
  <input type="checkbox" name="marketingConsent" className="mt-0.5 accent-white" />
  {t(lang, 'formConsent')}
</label>
```

`FormData` serializes a checked box as `'on'` — `parseLead` (Task 10) already accepts `'on'`. Unchecked boxes are absent → defaults to false. No client-side transform needed.

- [ ] **Step 3: onSuccess.** In the submit handler after `setState('ok')`, call `onSuccess?.()`.

- [ ] **Step 4:** Verify on `/yhteys`: submit with and without the checkbox against the dev API (Vite middleware serves `/api` in dev per `vite.config.ts` — if only `/api/activity` is wired in dev, test against `vercel dev` or verify via the Network tab that the payload includes `marketingConsent: 'on'`). Commit `feat: consent checkbox and i18n in contact form`

---

### Task 12: NewsletterForm + blog integration

**Files:**
- Create: `src/components/NewsletterForm.tsx`
- Modify: `src/pages/BlogList.tsx`, `src/pages/BlogPost.tsx`

**Interfaces:**
- Consumes: `t` (Task 5 `nl*` keys), `/api/contact` POST.
- Produces: `<NewsletterForm lang={lang} source={string} />`

- [ ] **Step 1: Component.** Email-only; consent is inherent in subscribing, so it posts `marketingConsent: true` and a fixed message:

```tsx
import { useState } from 'react'
import { t } from '../lib/i18n'
import type { Lang } from '../lib/parsePost'
import { capture } from '../lib/analytics'

type State = 'idle' | 'sending' | 'ok' | 'error'

export default function NewsletterForm({ lang, source }: { lang: Lang; source: string }) {
  const [state, setState] = useState<State>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '')
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email.split('@')[0] || 'Tilaaja', email, message: '(newsletter)', source, marketingConsent: true }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('ok')
      capture('newsletter_subscribed', { source })
    } catch {
      setState('error')
    }
  }

  if (state === 'ok') return <p className="text-sm text-text-secondary">{t(lang, 'nlOk')}</p>

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5">
      <p className="font-medium text-text-primary">{t(lang, 'nlTitle')}</p>
      <p className="mt-1 text-sm text-text-muted">{t(lang, 'nlBody')}</p>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          name="email" type="email" required maxLength={320}
          placeholder={t(lang, 'nlPlaceholder')}
          className="w-full rounded-lg border border-border bg-bg-tertiary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover focus:outline-none"
        />
        <button
          type="submit" disabled={state === 'sending'}
          className="shrink-0 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#0a0b0d] hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {t(lang, 'nlCta')}
        </button>
      </form>
      {state === 'error' && <p className="mt-2 text-sm text-red-400">{t(lang, 'formError')}</p>}
    </div>
  )
}
```

- [ ] **Step 2: Blog integration.** `BlogList.tsx`: render `<NewsletterForm lang={lang} source={`newsletter:blog`} />` after the post list. `BlogPost.tsx`: render `<NewsletterForm lang={lang} source={`newsletter:${slug}`} />` after the article body, before the footer. Both pages already receive `lang` as a prop (see `src/main.tsx`).

- [ ] **Step 3:** Verify on `/blog` and one post, both languages. Commit `feat: newsletter capture on blog pages`

---

### Task 13: Home Yhteys island + final mailto/CTA sweep

**Files:**
- Modify: `src/site/markup.ts` (cut Yhteys form area, hero CTA hrefs), `src/pages/Home.tsx`, `src/components/Footer.tsx` (check), `src/pages/Contact.tsx` (lang cleanup optional — fi-only page is acceptable, `/en` users reach forms elsewhere)

- [ ] **Step 1: Yhteys island.** In the YHTEYS section of the markup template, the current primary block (the `sami@mak8r.fi 
→` mailto row) is replaced with a slice marker: add `<!-- CONTACT FORM -->` where the form should mount (directly under `contactBody`), keep the email visible below it as plain text with the `contactReply` line. In `Home.tsx`, add a third slice on that marker and render `<ContactForm source={lang === 'fi' ? 'home' : 'home-en'} lang={lang} />` inside a width-constrained wrapper div matching the section's column.

- [ ] **Step 2: Hero CTA.** In the hero template, `heroCta1` anchors to `#yhteys` (the form section) — verify the section wrapper has `id="yhteys"`; `heroCta2` anchors to `#projektit`.

- [ ] **Step 3: Sweep.** `grep -rn "mailto:" src/` → allowed remaining: `Offer.tsx` (out of scope), `Admin.tsx` (admin tooling), `Contact.tsx` plain contact detail, the Yhteys section's visible address, `CaseStudy.tsx` none. NOT allowed: any `mailto:` inside a button/CTA-styled element on Home or CaseStudy. Fix violations.

- [ ] **Step 4: PostHog check.** Form submits fire events (`case_study_contact_clicked` via onSuccess, `newsletter_subscribed`). Add `capture('lead_form_submitted', { source })` inside ContactForm's success path so every lead is measurable per source.

- [ ] **Step 5:** `npm run lint && npm test && npm run build` (build gate). Commit `feat: lead form on home, all CTAs route to forms`

---

### Task 14: Screenshots + gallery data

**Files:**
- Create: `public/cases/<slug>/*.png` (2–4 per case)
- Modify: `src/lib/cases.ts` (fill `gallery` arrays)

Tools: Playwright MCP (`browser_navigate`, `browser_resize` to 1600×1000, `browser_take_screenshot` with `filename`). Playwright saves files — copy them into `public/cases/<slug>/`. For products requiring login, capture the public/marketing surface instead; NO fake or mocked-up shots. If a capture fails, skip it and list it in the final report — an honest gap beats a fake image.

- [ ] **Step 1: Public captures (no login):**
  - `rascal-ai`: `https://rascalai.fi` (marketing hero) → `public/cases/rascal-ai/site.png`
  - `rascal-pages`: `https://rascalpages.fi` → `public/cases/rascal-pages/site.png`
  - `altio`: `https://app.altio.app/welcome.html` (marketing) → `public/cases/altio/marketing.png`; `https://app.altio.app` login screen only if visually strong
  - `rascal-crm`: `https://crm.rascalai.fi` login/landing — likely just a login form; prefer Step 2.

- [ ] **Step 2: Local demo captures (real product UIs, no prod creds needed):**
  - `perhe-app`: `cd /Users/slemppa/Code/omat/perhe-app && npx expo start --web --port 8082` — with no Supabase env it auto-falls back to mock demo data (mockSource). Capture the child board (`/`) and parent dashboard (`/parent`) → `public/cases/perhe-app/board.png`, `parent.png`. Kill the server after.
  - `pesa`: `cd /Users/slemppa/Code/omat/pesä && pnpm dev` (has `.env`); capture the budget view and debts view → `public/cases/pesa/budget.png`, `debts.png`. If the dev server needs auth, register a throwaway account locally.
  - `rascal-crm` and `rascal-ai` app UIs: only if the user's logged-in Chrome session is available via the claude-in-chrome tools — in that case capture CRM pipeline + call view, Rascal AI dashboard + calendar. Otherwise leave for the user and note it.

- [ ] **Step 3: Optimize.** `sips -Z 1600 public/cases/*/*.png` then check sizes: `du -h public/cases/*/*` — target < 400 KB each; re-export or `sips -s formatOptions 80 -s format jpeg` for heavy ones (rename in gallery accordingly).

- [ ] **Step 4: Gallery data.** For each captured file add to that case's `gallery` in `cases.ts`:

```ts
gallery: [
  { src: '/cases/perhe-app/board.png', caption: { fi: 'Lapsen tehtävätaulu tabletilla', en: 'A child’s task board on the tablet' } },
  { src: '/cases/perhe-app/parent.png', caption: { fi: 'Vanhemman dashboard: edistymisrenkaat ja kotiintulot', en: 'Parent dashboard: progress rings and homecoming log' } },
]
```

(Adjust captions per actual shots; both languages required — the Task 2 integrity test can be extended with a gallery-caption check: every gallery entry's `src` starts with `/cases/<slug>/`.)

- [ ] **Step 5:** Verify gallery renders on each case page (both langs). `npm test`. Commit `feat: real product screenshots in case galleries`

---

### Task 15: Final verification + deploy check

- [ ] **Step 1: Full gates.** `npm run lint && npm test && npm run build` — all green.
- [ ] **Step 2: Manual smoke** (`npm run preview` or dev): 
  - `/` and `/en` — hero numbers correct (6 / 400k+ / 3 000+), no blue, koneisto section honest, 6 project cards, contact form present
  - all 6 case pages × 2 langs; `/projektit/superhuman` → redirects to altio
  - `/blog` + one post × 2 langs with newsletter form
  - form submit end-to-end: POST `/api/contact` returns 200; with `DATABASE_URL` present locally verify the row: `psql "$DATABASE_URL" -c "select name, source, marketing_consent from portfolio_leads order by id desc limit 3"`
  - `grep -rn "127" src/site/` → empty; `grep -rn "HealthKit\|[Ll]ocal-first" src/lib/cases.ts` → empty
- [ ] **Step 3: Legacy URL note.** Old blog links to `/projektit/superhuman` and `/projektit/pesa` keep working (alias + unchanged slug).
- [ ] **Step 4: Push branch + PR.** `git push -u origin feat/portfolio-refresh`, open a PR titled `Portfolio refresh: 6 cases, unified design, fi/en, lead capture`. Body summarizes the spec. Do NOT merge without the user.
- [ ] **Step 5: Report** to the user: what shipped, screenshot coverage gaps, env vars needed in Vercel (`BREVO_LIST_ID`, existing `BREVO_API_KEY`/`DATABASE_URL` confirmed), and that the Neon migration was applied.

### Task 16: Tech section — principles re-layout + living stack visualization (user feedback 2026-07-29)

**Files:**
- Modify: `src/site/markup.ts` (tech section bottom row), `src/site/effects.ts` (new animation), `src/site/copy.ts` (only if labels change), `src/index.css` (keyframes if needed), `src/pages/Home.tsx` (only if an island is needed — prefer pure markup+effects, no island)

**Context:** Screenshot feedback: the tech section's bottom row renders the three principles (01 API-first / 02 Rakennettu, ei ostettu / 03 Sama stack, oikeat asiakkaat) in one narrow left column with a large EMPTY gray box beside them.

- [ ] **Step 1: Principles re-layout.** The three principles become three equal cards in one row spanning the section's full width (grid-template-columns:repeat(3,1fr), collapsing to 1fr on ≤860px via the existing attribute-selector media queries — verify the chosen inline style matches an existing collapse rule or add one to index.css). Keep the mono eyebrow style (`01 · API-FIRST`), body text from existing copy keys. The empty gray container disappears as a separate box.
- [ ] **Step 2: Living stack visual.** Above or beside the principles (design call: full-width strip between the 5 layer cards and the principles row), add `<canvas id="stack-canvas">` (height ~160-220px) animated in effects.ts (`runStackFlow()` called from Home's effect wiring like `runKoneisto`): five node points labeled 01–05 connected by hairlines; small light packets travel node-to-node with ease-in-out, occasional pulse ring on arrival; monochrome (rgba(255,255,255,...) only); requestAnimationFrame; respect `prefers-reduced-motion: reduce` (static nodes+lines, no packets); dispose properly (return a disposer like other effects).
- [ ] **Step 3:** Verify: lint, vitest, build, dev server — both langs; animation runs, reduced-motion static.
- [ ] **Step 4:** Commit `feat: tech section principles row + animated stack flow`

### Task 17: Manifesto rewrite — kill the AI slop (user feedback 2026-07-29)

**Files:**
- Modify: `src/site/copy.ts` (man* keys), `src/site/markup.ts` (manifesti section layout), `src/index.css` (responsive rule if a new grid pattern is introduced)

**Context:** User verdict on the current manifesto: "100 % AI slop". Two problems: (1) the six principle bodies are generic platitudes, (2) the layout wastes a huge empty left column under the intro.

- [ ] **Step 1: New copy.** Replace the `man*` values in copy.ts. Each principle now has a title key, body key and a mono "receipt" key (`man1t/man1/man1r` … `man6t/man6/man6r` — extend the HomeCopy type accordingly; intro shortens). Values (verbatim):

FI:
- manIntro: 'Ei teesejä joita kukaan ei voi vastustaa — vaan säännöt, joiden mukaan nämä kuusi tuotetta on oikeasti rakennettu. Jokaisessa on kuitti.'
- man1t: 'Tuotanto on ainoa mittari.', man1: 'Demo ei todista mitään. Järjestelmä on valmis vasta, kun se pyörii maksavilla asiakkailla myös silloin kun kukaan ei katso.', man1r: 'kuitti: 423 julkaisua tuotantoon ~13 kk:ssa'
- man2t: 'Tylsä matikka ensin, AI vasta sitten.', man2: 'Kaiken minkä voi laskea deterministisesti, lasken koodilla — auditoitavasti ja ilmaiseksi. LLM saa harkinnan, ei kirjanpitoa.', man2r: 'kuitti: Altion progressiomoottori · Pesän senttitarkka vyörytys'
- man3t: 'Turva ei ole ominaisuus.', man3: 'Eristys tehdään tietokannassa asti, ei käyttöliittymässä. Virhetilanne sulkee oven — ei koskaan avaa väärän asiakkaan dataa.', man3r: 'kuitti: RLS 78+50 taulussa · fail-closed-korjaus tuotannossa'
- man4t: 'Kolmas toisto automatisoidaan.', man4: 'Kahdesti käsin, kolmannella kerralla koneelle. Pienistä toistoista kertyy viikkoja — ja koneisto ei unohda.', man4r: 'kuitti: 27 edge-funktiota hoitaa julkaisut, token-refreshit ja healthcheckit'
- man5t: 'Rakennan kun se on etu, ostan kun ei ole.', man5: 'Oma workflow-moottori siellä missä se erottaa tuotteen — valmis Twilio siellä missä ei. Raja on kilpailuetu, ei ideologia.', man5r: 'kuitti: oma OAuth 2.1 -palvelin · ostettu puheluinfra'
- man6t: 'Nopeus tulee kurista.', man6: 'Speksi ennen koodia, testit ennen mergeä, julkaisu joka päivä. Kuri ei hidasta — se poistaa pelon muuttaa mitä vain.', man6r: 'kuitti: ~3 000 testiä · 65+ design-spekkiä'

EN (mirror):
- manIntro: 'Not theses nobody could disagree with — the actual rules these six products were built by. Each one comes with a receipt.'
- man1t: 'Production is the only scoreboard.', man1: 'A demo proves nothing. A system is done when it runs for paying customers even when nobody is watching.', man1r: 'receipt: 423 production releases in ~13 months'
- man2t: 'Boring math first, AI second.', man2: 'Everything that can be computed deterministically, I compute in code — auditable and free. The LLM gets judgment, never the bookkeeping.', man2r: 'receipt: Altio’s progression engine · Pesä’s cent-exact avalanche'
- man3t: 'Security is not a feature.', man3: 'Isolation goes down to the database, not the UI. Failure closes the door — it never opens another customer’s data.', man3r: 'receipt: RLS across 78+50 tables · a fail-closed fix in production'
- man4t: 'The third repetition gets automated.', man4: 'Twice by hand, third time to the machine. Small repetitions add up to weeks — and the machine doesn’t forget.', man4r: 'receipt: 27 edge functions run publishing, token refresh and health checks'
- man5t: 'Build where it’s an edge, buy where it isn’t.', man5: 'A custom workflow engine where it differentiates the product — off-the-shelf Twilio where it doesn’t. The line is competitive advantage, not ideology.', man5r: 'receipt: a from-scratch OAuth 2.1 server · bought call infrastructure'
- man6t: 'Speed comes from discipline.', man6: 'Spec before code, tests before merge, releases every day. Discipline doesn’t slow you down — it removes the fear of changing anything.', man6r: 'receipt: ~3,000 tests · 65+ design specs'

Title stays 'Automaatio on / uusi lukutaito.' / 'Automation is / the new literacy.' (brand line), eyebrow stays.

- [ ] **Step 2: New layout.** Replace the sticky-left-intro + right-list structure: compact intro row (title left, manIntro right, no sticky, no tall empty column), then the six principles as a 3×2 card grid (2-col at ≤1100px if needed, 1-col ≤860px): each card = mono number+title line (e.g. `01 — Tuotanto on ainoa mittari.` title in text-primary weight 600), body in text-secondary, and the receipt as a mono 11px line in text-muted with a hairline top border inside the card. Cards match the tech/principles card language (hairline border, radius 13-14px, background rgba(255,255,255,.015)).
- [ ] **Step 3:** Verify lint/vitest/build + both langs render, screenshot check.
- [ ] **Step 4:** Commit `feat: manifesto rewritten with receipts, card grid layout`

## Task execution order

Strict order: 1 → 2+3+4 (one sitting) → 5 → 6 → 7 → 8 → 10 → 11 → 9 → 12 → 13 → 14 → 15. (10+11 before 9 because CaseStudy's CTA consumes the consent-aware ContactForm.)



