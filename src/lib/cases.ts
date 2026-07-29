// Case-studyjen sisältö. Yksi totuuden lähde sekä etusivun Cases-osiolle
// että /projektit/:slug -detail-sivuille. Tekstit on johdettu oikeista
// projekteista ja blogiposteista — ei keksittyjä lukuja.

import type { Lang } from './parsePost'

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

type CaseEntry = {
  slug: string
  year: string
  featured: boolean
  stack: StackGroup[]
  gallery: { src: string; caption: Record<Lang, string> }[]
  copy: Record<Lang, CaseCopy>
}

const entries: CaseEntry[] = [
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
]

const ALIASES: Record<string, string> = { superhuman: 'altio' }

export function getCases(lang: Lang = 'fi'): CaseStudy[] {
  return entries.map((e) => ({
    slug: e.slug,
    year: e.year,
    featured: e.featured,
    stack: e.stack,
    gallery: e.gallery.map((g) => ({ src: g.src, caption: g.caption[lang] })),
    ...e.copy[lang],
  }))
}

export function getCaseStudy(slug: string, lang: Lang = 'fi'): CaseStudy | undefined {
  const key = ALIASES[slug] ?? slug
  return getCases(lang).find((c) => c.slug === key)
}
