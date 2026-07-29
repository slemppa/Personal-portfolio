// Core of the "share an offer" feature: turn a loose CRM payload into a
// polished, phased proposal. Framework-agnostic and dependency-free so it runs
// in the Vercel function, the Vite dev middleware, and the tests alike.
//
// Offers are phased (Vaihe 0/1/2…), each phase carrying its own scope, duration
// and price, plus optional honest "how it's built" trade-offs and clear scope /
// ownership terms — the shape of a real consulting proposal, kept lean.
//
// Two generation paths share one output shape (Offer):
//   - buildOffer()    deterministic template — always works, no secrets, tested
//   - generateOffer() (see offerAI.ts) calls Claude when a key is set, else
//                     falls back to buildOffer()
//
// Offers are shared without a database: encodeOfferToken() packs the whole
// Offer into a base64url string that lives in a URL fragment, and the /tarjous
// page decodes it client-side.

export type OfferLang = 'fi' | 'en'

/** A named problem in the prospect's current situation. */
export type SituationPoint = { title: string; body: string }

/** One phase of the proposed path (e.g. "Vaihe 1 — Julkinen sivusto"). */
export type OfferPhase = {
  name: string
  /** One-line statement of what this phase delivers. */
  goal?: string
  /** Concrete deliverables in this phase. */
  includes: string[]
  /** What changes (or explicitly doesn't) for the client after this phase. */
  outcome?: string
  /** Duration, e.g. "2–3 viikkoa". */
  duration?: string
  /** Price for this phase, e.g. "alkaen 3 500 €". */
  price?: string
}

/** An honest build decision: why this choice, and the cheaper alternative. */
export type OfferTradeoff = {
  choice: string
  why: string
  /** The lighter option and its later cost, optional. */
  alternative?: string
}

/** The sender — defaults to the site owner when the CRM doesn't send one. */
export type OfferSender = {
  name: string
  title?: string
  email?: string
  company?: string
}

/** Whatever the CRM sends, tolerantly parsed into a known shape. */
export type OfferInput = {
  company?: string
  contactName?: string
  contactEmail?: string
  industry?: string
  services: string[]
  painPoints: string[]
  goals: string[]
  budget?: string
  timeline?: string
  notes?: string
  language: OfferLang
  currency: string
  sender: OfferSender
}

/** The finished, renderable proposal. */
export type Offer = {
  id: string
  language: OfferLang
  title: string
  recipient: { company?: string; name?: string; email?: string }
  greeting: string
  /** Short opening paragraph framing the situation. */
  summary: string
  /** The current situation, broken into named problems. */
  situation: SituationPoint[]
  /** The framing of the proposed approach, in prose. */
  approach: string
  /** The phased path — the core of the offer. */
  phases: OfferPhase[]
  /** Optional "how it's built" trade-offs. Empty hides the section. */
  tradeoffs: OfferTradeoff[]
  investment: {
    summary: string
    /** Preformatted grand total, optional. */
    total?: string
    /** Payment schedule, e.g. "40 % aloitus, 40 % demo, 20 % hyväksyntä". */
    paymentTerms?: string
    note?: string
  }
  /** Scope boundaries and ownership. */
  scope: { excludes: string[]; ownership?: string }
  nextSteps: string[]
  cta: string
  /** ISO date the offer is valid until. */
  validUntil: string
  sender: OfferSender
  generatedAt: string
  /** True when Claude wrote it, false for the deterministic template. */
  aiGenerated: boolean
}

const DEFAULT_SENDER: OfferSender = {
  name: 'Sami Kiias',
  title: 'AI & automaatiokonsultti',
  email: 'sami@mak8r.fi',
  company: 'Sami Kiias',
}

// ---------------------------------------------------------------------------
// Input normalization — accept whatever the CRM throws at us.
// ---------------------------------------------------------------------------

// Common field aliases, checked in order. First non-empty wins.
const ALIASES = {
  company: ['company', 'companyName', 'company_name', 'organization', 'org', 'account', 'accountName', 'customer', 'client'],
  contactName: ['contactName', 'contact_name', 'contact', 'name', 'fullName', 'full_name', 'person', 'recipient'],
  contactEmail: ['contactEmail', 'contact_email', 'email', 'e-mail', 'mail'],
  industry: ['industry', 'sector', 'vertical', 'field'],
  services: ['services', 'service', 'products', 'product', 'needs', 'interests', 'requestedServices'],
  painPoints: ['painPoints', 'pain_points', 'pains', 'challenges', 'problems', 'issues'],
  goals: ['goals', 'objectives', 'targets', 'outcomes', 'wishes'],
  budget: ['budget', 'budgetRange', 'budget_range', 'price', 'priceRange'],
  timeline: ['timeline', 'deadline', 'timeframe', 'time_frame', 'schedule', 'when'],
  notes: ['notes', 'description', 'message', 'details', 'comments', 'summary', 'context', 'body'],
  language: ['language', 'lang', 'locale'],
  currency: ['currency', 'currencyCode'],
} as const

type Raw = Record<string, unknown>

function pickString(raw: Raw, keys: readonly string[]): string | undefined {
  for (const k of keys) {
    const v = raw[k]
    if (typeof v === 'string' && v.trim()) return v.trim()
    if (typeof v === 'number') return String(v)
  }
  return undefined
}

/** Split a comma/semicolon/newline/bullet list, or pass an array through. */
export function toList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean)
  }
  if (typeof value === 'string') {
    return value
      .split(/[\n;,•·|]+/)
      .map((s) => s.replace(/^[-*\s]+/, '').trim())
      .filter(Boolean)
  }
  return []
}

function pickList(raw: Raw, keys: readonly string[]): string[] {
  for (const k of keys) {
    if (k in raw) {
      const list = toList(raw[k])
      if (list.length) return list
    }
  }
  return []
}

function normalizeLang(value: string | undefined): OfferLang {
  if (value && /^en/i.test(value)) return 'en'
  return 'fi'
}

function normalizeSender(raw: Raw): OfferSender {
  const from = (raw.from ?? raw.sender ?? raw.consultant) as Raw | undefined
  if (from && typeof from === 'object') {
    return {
      name: pickString(from, ['name', 'fullName']) ?? DEFAULT_SENDER.name,
      title: pickString(from, ['title', 'role']) ?? DEFAULT_SENDER.title,
      email: pickString(from, ['email', 'mail']) ?? DEFAULT_SENDER.email,
      company: pickString(from, ['company', 'organization']) ?? DEFAULT_SENDER.company,
    }
  }
  return { ...DEFAULT_SENDER }
}

/** Turn an arbitrary CRM object into a well-formed OfferInput. */
export function normalizeInput(raw: unknown): OfferInput {
  const r: Raw = raw && typeof raw === 'object' ? (raw as Raw) : {}
  return {
    company: pickString(r, ALIASES.company),
    contactName: pickString(r, ALIASES.contactName),
    contactEmail: pickString(r, ALIASES.contactEmail),
    industry: pickString(r, ALIASES.industry),
    services: pickList(r, ALIASES.services),
    painPoints: pickList(r, ALIASES.painPoints),
    goals: pickList(r, ALIASES.goals),
    budget: pickString(r, ALIASES.budget),
    timeline: pickString(r, ALIASES.timeline),
    notes: pickString(r, ALIASES.notes),
    language: normalizeLang(pickString(r, ALIASES.language)),
    currency: pickString(r, ALIASES.currency) ?? '€',
    sender: normalizeSender(r),
  }
}

// ---------------------------------------------------------------------------
// Deterministic builder — the always-available fallback.
// ---------------------------------------------------------------------------

// Short bilingual copy so buildOffer reads cleanly. The fallback is a lean,
// three-phase proposal; the AI path (offerAI.ts) produces the richer version.
const COPY = {
  fi: {
    title: (c?: string) => `Ehdotus etenemisestä${c ? ` – ${c}` : ''}`,
    greeting: (n?: string) => (n ? `Hei ${n},` : 'Hei,'),
    defaultService: 'AI- ja automaatioratkaisu',
    summary: (svc: string, c?: string) =>
      `Kiitos hyvästä keskustelusta. Kokosin ${c ? `${c}:lle ` : ''}ehdotuksen siitä, miten ${svc.toLowerCase()} viedään käytäntöön – vaiheittain, niin että jokainen vaihe tuottaa hyötyä itsessään eikä seuraava pura edellistä.`,
    approach:
      'Ehdotan yhtä polkua, joka etenee pienin, todennettavin askelin. Aloitamme määrittelystä, jotta hinta perustuu tarpeeseen eikä arvaukseen. Jokainen vaihe rakennetaan niin, että ensimmäisen vaiheen investointi säilyy arvossaan riippumatta siitä, jatketaanko seuraavaan.',
    phase0: (svc: string): OfferPhase => ({
      name: 'Vaihe 0 — Määrittely',
      goal: 'Ymmärretään mitä oikeasti tarvitaan ennen kiinteää hintaa.',
      includes: [
        'Nykytilan ja tavoitteiden läpikäynti',
        `Laajuuden ja mittareiden määrittely (${svc.toLowerCase()})`,
        'Toteutussuunnitelma ja sitova kiinteä hinta seuraaville vaiheille',
      ],
      outcome: 'Suunnitelma on teidän, myös jos ette jatka.',
      duration: '1–2 viikkoa',
      price: 'hyvitetään jatkossa',
    }),
    phase1: (svc: string): OfferPhase => ({
      name: 'Vaihe 1 — Toteutus',
      goal: `${svc} rakennettuna ja kytkettynä nykyisiin työkaluihinne.`,
      includes: [
        'Ydintoiminnallisuus tuotantoon',
        'Integraatio nykyisiin järjestelmiinne',
        'Testaus ja mitatut tulokset',
      ],
      outcome: 'Näkyvä hyöty jo ensimmäisistä viikoista.',
      duration: '2–4 viikkoa',
      price: 'kiinteä hinta',
    }),
    phase2: {
      name: 'Vaihe 2 — Käyttöönotto & jatko',
      goal: 'Ratkaisu tiimin arkeen ja jatkokehityksen pohja.',
      includes: ['Käyttöönotto ja perehdytys', 'Dokumentaatio', 'Tuki ensimmäisten viikkojen ajan'],
      duration: '1–2 viikkoa',
      price: 'laajuuden mukaan',
    } as OfferPhase,
    investmentSummary: 'Investointi räätälöidään lopullisen laajuuden mukaan; tarkka, sitova hinta vahvistetaan määrittelyn jälkeen.',
    paymentTerms: 'Maksuerät esim. 40 % aloitus, 40 % demo, 20 % hyväksyntä. Maksuehto 14 pv.',
    investmentNote: 'Kaikki hinnat + alv.',
    excludes: [
      'Sisällöntuotanto ja jatkuva hakukoneoptimointi',
      'Logo- ja brändityö, valokuvaus, mainonta',
      'Integraatiot muihin järjestelmiin ellei erikseen sovita',
    ],
    ownership: 'Kaikki tilit avataan teidän nimiinne alusta asti; lähdekoodi siirtyy teille viimeisen maksuerän jälkeen. Ette ole missään vaiheessa riippuvaisia minusta.',
    nextSteps: [
      'Lyhyt puhelu, jossa käydään läpi rajaus ja aikataulu — ei sido mihinkään',
      'Määrittelyvaiheen aloitus kirjallisella hyväksynnällä',
      'Määrittelyn päätteeksi suunnitelma ja sitova hinta — päätös jatkosta vasta silloin',
    ],
    cta: 'Vastaa tähän viestiin tai varaa aika, niin käydään rajaus läpi.',
    situationDefault: [
      { title: 'Nykytila kartoittamatta', body: 'Suurimmat ajansäästön ja hyödyn paikat kannattaa tunnistaa ennen toteutusta, jotta jokainen euro kohdistuu oikein.' },
    ] as SituationPoint[],
  },
  en: {
    title: (c?: string) => `Proposal${c ? ` – ${c}` : ''}`,
    greeting: (n?: string) => (n ? `Hi ${n},` : 'Hi,'),
    defaultService: 'AI & automation solution',
    summary: (svc: string, c?: string) =>
      `Thanks for the good conversation. Here's a proposal for how ${svc.toLowerCase()} gets put into practice for ${c ? c : 'your team'} — in phases, so each phase delivers value on its own and none undoes the last.`,
    approach:
      'I propose a single path that moves in small, verifiable steps. We start with a scoping phase so the price is based on need, not a guess. Each phase is built so the first phase\'s investment keeps its value whether or not you continue.',
    phase0: (svc: string): OfferPhase => ({
      name: 'Phase 0 — Scoping',
      goal: 'Understand what is actually needed before a fixed price.',
      includes: [
        'Review of current state and goals',
        `Scope and metrics definition (${svc.toLowerCase()})`,
        'Delivery plan and a firm fixed price for the next phases',
      ],
      outcome: 'The plan is yours, even if you don\'t continue.',
      duration: '1–2 weeks',
      price: 'credited later',
    }),
    phase1: (svc: string): OfferPhase => ({
      name: 'Phase 1 — Build',
      goal: `${svc} built and wired into your existing tools.`,
      includes: ['Core functionality in production', 'Integration with your systems', 'Testing and measured results'],
      outcome: 'Visible value from the first weeks.',
      duration: '2–4 weeks',
      price: 'fixed price',
    }),
    phase2: {
      name: 'Phase 2 — Rollout & next',
      goal: 'The solution in the team\'s hands, and a base for what\'s next.',
      includes: ['Rollout and onboarding', 'Documentation', 'Support through the first weeks'],
      duration: '1–2 weeks',
      price: 'by scope',
    } as OfferPhase,
    investmentSummary: 'The investment is tailored to the final scope; a firm, binding price is confirmed after scoping.',
    paymentTerms: 'Payments e.g. 40% at start, 40% at demo, 20% on acceptance. Net 14.',
    investmentNote: 'All prices excl. VAT.',
    excludes: [
      'Content production and ongoing SEO',
      'Logo/brand work, photography, advertising',
      'Integrations to other systems unless separately agreed',
    ],
    ownership: 'All accounts are opened in your name from the start; source code transfers to you after the final payment. You are never dependent on me to reach your own data.',
    nextSteps: [
      'A short call to walk through scope and timeline — no commitment',
      'Scoping phase starts on written approval',
      'Scoping ends with a plan and a binding price — the decision to continue is made only then',
    ],
    cta: 'Reply to this message or book a slot and we\'ll walk through the scope.',
    situationDefault: [
      { title: 'Current state not mapped', body: 'The biggest time-savings and wins are worth identifying before building, so every euro is spent where it counts.' },
    ] as SituationPoint[],
  },
} as const

/** Stable-ish id without external deps; unique enough for share links. */
function offerId(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  return `of_${(h >>> 0).toString(36)}${seed.length.toString(36)}`
}

/**
 * Build a lean, phased offer from the input using deterministic templates.
 * `now` is injectable so tests stay stable.
 */
export function buildOffer(input: OfferInput, now: Date = new Date()): Offer {
  const c = COPY[input.language]
  const service = input.services[0] ?? c.defaultService
  const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const situation: SituationPoint[] =
    input.painPoints.length > 0
      ? input.painPoints.slice(0, 4).map((p) => ({
          title: p.charAt(0).toUpperCase() + p.slice(1),
          body:
            input.language === 'fi'
              ? 'Tähän tartutaan heti ensimmäisistä vaiheista lähtien.'
              : 'This is addressed from the first phases onward.',
        }))
      : c.situationDefault

  const phases: OfferPhase[] = [c.phase0(service), c.phase1(service), c.phase2]

  const seed = [input.company, input.contactEmail, service, input.notes, now.toISOString().slice(0, 10)]
    .filter(Boolean)
    .join('|')

  return {
    id: offerId(seed),
    language: input.language,
    title: c.title(input.company),
    recipient: { company: input.company, name: input.contactName, email: input.contactEmail },
    greeting: c.greeting(input.contactName),
    summary: c.summary(service, input.company),
    situation,
    approach: c.approach,
    phases,
    tradeoffs: [],
    investment: {
      summary: input.budget ? `${c.investmentSummary} (${input.budget})` : c.investmentSummary,
      paymentTerms: c.paymentTerms,
      note: c.investmentNote,
    },
    scope: { excludes: [...c.excludes], ownership: c.ownership },
    nextSteps: [...c.nextSteps],
    cta: c.cta,
    validUntil: validUntil.toISOString().slice(0, 10),
    sender: input.sender,
    generatedAt: now.toISOString(),
    aiGenerated: false,
  }
}

// ---------------------------------------------------------------------------
// Markdown rendering — for easy embedding / copy-paste.
// ---------------------------------------------------------------------------

/** Render an offer to Markdown (used in the API response and for sharing). */
export function offerToMarkdown(offer: Offer): string {
  const fi = offer.language === 'fi'
  const L = fi
    ? { situation: 'Tilanne', approach: 'Ehdotus', build: 'Miten se rakennetaan', choice: 'Valinta', why: 'Miksi', alt: 'Kevyempi vaihtoehto', investment: 'Investointi', payment: 'Maksuerät', scope: 'Rajaukset', ownership: 'Omistajuus', next: 'Seuraavat askeleet', valid: 'Voimassa', total: 'Yhteensä', duration: 'Kesto', price: 'Investointi' }
    : { situation: 'Situation', approach: 'Proposal', build: 'How it\'s built', choice: 'Choice', why: 'Why', alt: 'Lighter option', investment: 'Investment', payment: 'Payment', scope: 'Scope', ownership: 'Ownership', next: 'Next steps', valid: 'Valid until', total: 'Total', duration: 'Duration', price: 'Investment' }

  const lines: string[] = []
  lines.push(`# ${offer.title}`, '')
  lines.push(offer.greeting, '')
  lines.push(offer.summary, '')

  if (offer.situation.length) {
    lines.push(`## ${L.situation}`, '')
    for (const s of offer.situation) lines.push(`**${s.title}.** ${s.body}`, '')
  }

  lines.push(`## ${L.approach}`, '', offer.approach, '')

  for (const p of offer.phases) {
    lines.push(`### ${p.name}`, '')
    if (p.goal) lines.push(p.goal, '')
    for (const it of p.includes) lines.push(`- ${it}`)
    if (p.outcome) lines.push('', p.outcome)
    const meta = [p.duration && `${L.duration}: ${p.duration}`, p.price && `${L.price}: ${p.price}`].filter(Boolean).join('  ·  ')
    if (meta) lines.push('', `_${meta}_`)
    lines.push('')
  }

  if (offer.tradeoffs.length) {
    lines.push(`## ${L.build}`, '')
    lines.push(`| ${L.choice} | ${L.why} | ${L.alt} |`, '| --- | --- | --- |')
    for (const t of offer.tradeoffs) {
      lines.push(`| ${t.choice} | ${t.why} | ${t.alternative ?? '—'} |`)
    }
    lines.push('')
  }

  lines.push(`## ${L.investment}`, '', offer.investment.summary, '')
  if (offer.investment.total) lines.push(`**${L.total}: ${offer.investment.total}**`, '')
  if (offer.investment.paymentTerms) lines.push(`${L.payment}: ${offer.investment.paymentTerms}`, '')
  if (offer.investment.note) lines.push(`_${offer.investment.note}_`, '')

  if (offer.scope.excludes.length || offer.scope.ownership) {
    lines.push(`## ${L.scope}`, '')
    for (const e of offer.scope.excludes) lines.push(`- ${e}`)
    if (offer.scope.ownership) lines.push('', `**${L.ownership}.** ${offer.scope.ownership}`)
    lines.push('')
  }

  lines.push(`## ${L.next}`, '')
  offer.nextSteps.forEach((s, i) => lines.push(`${i + 1}. ${s}`))
  lines.push('')

  lines.push(offer.cta, '')
  lines.push(`— ${offer.sender.name}${offer.sender.title ? `, ${offer.sender.title}` : ''}`, '')
  lines.push(`_${L.valid}: ${offer.validUntil}_`)

  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Token encode/decode — stateless sharing via URL fragment (no database).
// ---------------------------------------------------------------------------

function toBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  const b64 = typeof btoa === 'function' ? btoa(bin) : Buffer.from(bytes).toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(token: string): Uint8Array {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof atob === 'function') {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return bytes
  }
  return new Uint8Array(Buffer.from(b64, 'base64'))
}

/** Pack an offer into a URL-safe token (goes in the /tarjous fragment). */
export function encodeOfferToken(offer: Offer): string {
  const json = JSON.stringify(offer)
  return toBase64Url(new TextEncoder().encode(json))
}

/** Unpack an offer token. Returns null on any malformed input. */
export function decodeOfferToken(token: string): Offer | null {
  try {
    const json = new TextDecoder().decode(fromBase64Url(token.trim()))
    const parsed = JSON.parse(json) as Offer
    if (!parsed || typeof parsed !== 'object' || !parsed.title || !parsed.language) return null
    return parsed
  } catch {
    return null
  }
}
