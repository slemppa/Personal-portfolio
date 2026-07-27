// Core of the "share an offer" feature: turn a loose CRM payload into a
// polished, shareable proposal. Framework-agnostic and dependency-free so it
// runs in the Vercel function, the Vite dev middleware, and the tests alike.
//
// Two generation paths share one output shape (Offer):
//   - buildOffer()    deterministic template — always works, no secrets, tested
//   - generateOffer() calls Claude when ANTHROPIC_API_KEY is set, else falls
//                     back to buildOffer()
//
// Offers are shared without a database: encodeOfferToken() packs the whole
// Offer into a base64url string that lives in a URL fragment, and the /tarjous
// page decodes it client-side.

export type OfferLang = 'fi' | 'en'

/** A single scope/deliverable or pricing line. */
export type OfferItem = {
  title: string
  description: string
  /** Preformatted price string (e.g. "1 200 €"), optional. */
  price?: string
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
  /** Services the prospect asked about. */
  services: string[]
  /** Problems / pain points to address. */
  painPoints: string[]
  /** Goals the prospect wants to reach. */
  goals: string[]
  budget?: string
  timeline?: string
  /** Free-form context from the CRM. */
  notes?: string
  language: OfferLang
  currency: string
  sender: OfferSender
}

/** The finished, renderable offer. */
export type Offer = {
  id: string
  language: OfferLang
  title: string
  recipient: { company?: string; name?: string; email?: string }
  greeting: string
  /** One-paragraph executive summary. */
  summary: string
  /** Our reading of their situation. */
  understanding: string
  /** The proposed approach, in prose. */
  approach: string
  deliverables: OfferItem[]
  timeline: string
  investment: {
    summary: string
    items: OfferItem[]
    /** Preformatted total, optional. */
    total?: string
    note?: string
  }
  whyMe: string[]
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
  email: 'sami.kiias@gmail.com',
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

// Short bilingual copy table so buildOffer reads cleanly.
const COPY = {
  fi: {
    title: (c?: string) => `Tarjous${c ? ` – ${c}` : ''}`,
    greeting: (n?: string) => (n ? `Hei ${n},` : 'Hei,'),
    defaultService: 'AI- ja automaatioratkaisut',
    summary: (svc: string, c?: string) =>
      `Kiitos mielenkiinnostasi. Kokosin ${c ? `${c}:lle ` : ''}ehdotuksen siitä, miten ${svc.toLowerCase()} veisi arkeanne eteenpäin – selkeästi, mitattavasti ja ilman turhaa teknistä säätöä.`,
    understanding: (pains: string[]) =>
      pains.length
        ? `Ymmärrän, että keskeisiä haasteita ovat: ${listFi(pains)}. Näihin tartutaan heti ensimmäisistä viikoista lähtien.`
        : 'Lähdemme liikkeelle kartoittamalla nykytilan ja suurimmat ajansäästön paikat, jotta jokainen euro kohdistuu oikein.',
    approach: (svc: string, goals: string[]) =>
      `Rakennan ${svc.toLowerCase()} teidän prosessienne ympärille – en valmiiseen muottiin. ${
        goals.length ? `Tavoitteena on ${listFi(goals)}.` : 'Tavoitteena on nopea, näkyvä hyöty jo ensimmäisessä vaiheessa.'
      } Työ etenee pienin, todennettavin askelin, jotta suunta voidaan tarkistaa matkan varrella.`,
    timelineDefault: 'Ensimmäinen versio tuotannossa 2–3 viikossa aloituksesta.',
    investmentSummary: 'Investointi räätälöidään lopullisen laajuuden mukaan – alla suuntaa-antava rakenne.',
    investmentNote: 'Hinnat ilman alv. Tarkka tarjous vahvistetaan aloituspalaverin jälkeen.',
    whyMe: [
      'Rakennan ratkaisut itse – ei välikäsiä, nopea sykli.',
      'Automaatio ja AI kytketään suoraan liiketoiminnan mittareihin.',
      'Selkeä hinnoittelu ja avoin build-in-public-työtapa.',
    ],
    nextSteps: [
      '30 min aloituspuhelu tavoitteiden tarkennukseen',
      'Vahvistettu tarjous ja aikataulu',
      'Ensimmäinen tuotantoversio 2–3 viikossa',
    ],
    cta: 'Vastaa tähän viestiin tai varaa aika, niin viedään tämä käytäntöön.',
    scope: 'Työn sisältö',
    discovery: { title: 'Kartoitus & suunnittelu', description: 'Nykytilan läpikäynti, tavoitteet ja mittarit sekä toteutussuunnitelma.' },
    build: (svc: string) => ({ title: 'Toteutus', description: `${svc} rakennettuna ja integroituna teidän työkaluihinne.` }),
    handover: { title: 'Käyttöönotto & tuki', description: 'Käyttöönotto, dokumentaatio ja tuki ensimmäisten viikkojen ajan.' },
  },
  en: {
    title: (c?: string) => `Proposal${c ? ` – ${c}` : ''}`,
    greeting: (n?: string) => (n ? `Hi ${n},` : 'Hi,'),
    defaultService: 'AI & automation solutions',
    summary: (svc: string, c?: string) =>
      `Thanks for your interest. Here's a proposal for how ${svc.toLowerCase()} can move ${c ? `${c}` : 'your team'} forward — clearly, measurably, and without the technical noise.`,
    understanding: (pains: string[]) =>
      pains.length
        ? `As I understand it, the key challenges are: ${listEn(pains)}. We tackle these from week one.`
        : "We start by mapping the current state and the biggest time sinks, so every euro is spent where it counts.",
    approach: (svc: string, goals: string[]) =>
      `I build ${svc.toLowerCase()} around your processes — not into a fixed template. ${
        goals.length ? `The goal is to ${listEn(goals)}.` : 'The goal is fast, visible value in the very first phase.'
      } Work moves in small, verifiable steps so we can adjust course along the way.`,
    timelineDefault: 'First version in production within 2–3 weeks of kickoff.',
    investmentSummary: 'The investment is tailored to the final scope — an indicative structure is below.',
    investmentNote: 'Prices exclude VAT. A firm quote is confirmed after the kickoff call.',
    whyMe: [
      'I build the solutions myself — no middlemen, fast iteration.',
      'Automation and AI wired straight to your business metrics.',
      'Transparent pricing and an open build-in-public way of working.',
    ],
    nextSteps: [
      '30-min kickoff call to sharpen the goals',
      'Confirmed proposal and timeline',
      'First production version in 2–3 weeks',
    ],
    cta: "Reply to this message or book a slot, and we'll put this into practice.",
    scope: 'Scope of work',
    discovery: { title: 'Discovery & planning', description: 'Current-state review, goals and metrics, and a delivery plan.' },
    build: (svc: string) => ({ title: 'Build', description: `${svc} built and integrated into your tools.` }),
    handover: { title: 'Rollout & support', description: 'Deployment, documentation, and support through the first weeks.' },
  },
} as const

function listFi(items: string[]): string {
  const low = items.map((s) => s.charAt(0).toLowerCase() + s.slice(1))
  if (low.length === 1) return low[0]
  return `${low.slice(0, -1).join(', ')} ja ${low[low.length - 1]}`
}

function listEn(items: string[]): string {
  const low = items.map((s) => s.charAt(0).toLowerCase() + s.slice(1))
  if (low.length === 1) return low[0]
  return `${low.slice(0, -1).join(', ')} and ${low[low.length - 1]}`
}

/** Stable-ish id without external deps; unique enough for share links. */
function offerId(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0
  return `of_${(h >>> 0).toString(36)}${seed.length.toString(36)}`
}

/**
 * Build a polished offer from the input using deterministic templates.
 * `now` is injectable so tests stay stable.
 */
export function buildOffer(input: OfferInput, now: Date = new Date()): Offer {
  const c = COPY[input.language]
  const service = input.services[0] ?? c.defaultService
  const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const deliverables: OfferItem[] = [
    c.discovery,
    c.build(service),
    c.handover,
  ]

  const investment: Offer['investment'] = {
    summary: input.budget
      ? `${c.investmentSummary} (${input.budget})`
      : c.investmentSummary,
    items: [
      { ...c.discovery, price: input.language === 'fi' ? 'alkaen 500 €' : 'from 500 €' },
      { ...c.build(service), price: input.language === 'fi' ? 'alkaen 2 000 €' : 'from 2 000 €' },
      { ...c.handover, price: input.language === 'fi' ? 'alkaen 500 €' : 'from 500 €' },
    ],
    note: c.investmentNote,
  }

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
    understanding: c.understanding(input.painPoints),
    approach: c.approach(service, input.goals),
    deliverables,
    timeline: input.timeline
      ? `${input.timeline}${input.language === 'fi' ? '.' : '.'}`
      : c.timelineDefault,
    investment,
    whyMe: [...c.whyMe],
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
    ? { deliverables: 'Työn sisältö', timeline: 'Aikataulu', investment: 'Investointi', why: 'Miksi minä', next: 'Seuraavat askeleet', valid: 'Voimassa', total: 'Yhteensä' }
    : { deliverables: 'Scope of work', timeline: 'Timeline', investment: 'Investment', why: 'Why me', next: 'Next steps', valid: 'Valid until', total: 'Total' }

  const lines: string[] = []
  lines.push(`# ${offer.title}`, '')
  lines.push(offer.greeting, '')
  lines.push(offer.summary, '')
  lines.push(offer.understanding, '')
  lines.push(offer.approach, '')

  lines.push(`## ${L.deliverables}`, '')
  for (const d of offer.deliverables) lines.push(`- **${d.title}** — ${d.description}`)
  lines.push('')

  lines.push(`## ${L.timeline}`, '', offer.timeline, '')

  lines.push(`## ${L.investment}`, '', offer.investment.summary, '')
  for (const it of offer.investment.items) {
    lines.push(`- **${it.title}** — ${it.description}${it.price ? ` _(${it.price})_` : ''}`)
  }
  if (offer.investment.total) lines.push('', `**${L.total}: ${offer.investment.total}**`)
  if (offer.investment.note) lines.push('', `_${offer.investment.note}_`)
  lines.push('')

  lines.push(`## ${L.why}`, '')
  for (const w of offer.whyMe) lines.push(`- ${w}`)
  lines.push('')

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
