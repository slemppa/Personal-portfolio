// The AI path for offer generation. When ANTHROPIC_API_KEY is set, Claude
// writes a phased proposal; otherwise (or on any error) we fall back to the
// deterministic buildOffer(). The SDK is imported dynamically so the
// deterministic path — and the tests — never need the dependency loaded.

import { buildOffer, type Offer, type OfferInput } from './offer.js'

type OfferEnv = { ANTHROPIC_API_KEY?: string; OFFER_MODEL?: string }

// Only the creative fields come from the model; ids/dates/sender are computed.
const AI_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string', description: 'Short offer title, e.g. "Ehdotus etenemisestä – Acme".' },
    greeting: { type: 'string', description: 'One-line greeting to the recipient.' },
    summary: { type: 'string', description: 'One short opening paragraph framing the situation.' },
    situation: {
      type: 'array',
      description: '2–4 named problems in the prospect\'s current situation.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string', description: 'The problem, a few words.' },
          body: { type: 'string', description: '1–2 sentences explaining it plainly.' },
        },
        required: ['title', 'body'],
      },
    },
    approach: { type: 'string', description: 'One paragraph framing the phased path.' },
    phases: {
      type: 'array',
      description: '1–4 phases. Small deals: one phase. Each phase must deliver value on its own.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          name: { type: 'string', description: 'e.g. "Vaihe 1 — Julkinen sivusto".' },
          goal: { type: 'string', description: 'One line: what this phase delivers.' },
          includes: { type: 'array', items: { type: 'string' }, description: '2–6 concrete deliverables.' },
          outcome: { type: 'string', description: 'What changes (or explicitly does not) for the client.' },
          duration: { type: 'string', description: 'e.g. "2–3 viikkoa".' },
          price: { type: 'string', description: 'Indicative price, e.g. "alkaen 3 500 €".' },
        },
        required: ['name', 'goal', 'includes', 'outcome', 'duration', 'price'],
      },
    },
    tradeoffs: {
      type: 'array',
      description: 'Optional honest build decisions (0–5). Empty array if not relevant.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          choice: { type: 'string', description: 'The decision made.' },
          why: { type: 'string', description: 'Why it pays off.' },
          alternative: { type: 'string', description: 'The lighter option and its later cost.' },
        },
        required: ['choice', 'why', 'alternative'],
      },
    },
    investment: {
      type: 'object',
      additionalProperties: false,
      properties: {
        summary: { type: 'string' },
        total: { type: 'string', description: 'Grand total or range, or "" if per-phase only.' },
        paymentTerms: { type: 'string', description: 'e.g. "40 % aloitus, 40 % demo, 20 % hyväksyntä".' },
        note: { type: 'string', description: 'Fine print, e.g. VAT note.' },
      },
      required: ['summary', 'total', 'paymentTerms', 'note'],
    },
    scope: {
      type: 'object',
      additionalProperties: false,
      properties: {
        excludes: { type: 'array', items: { type: 'string' }, description: 'What is not included.' },
        ownership: { type: 'string', description: 'Accounts, source code, and independence terms.' },
      },
      required: ['excludes', 'ownership'],
    },
    nextSteps: { type: 'array', items: { type: 'string' }, description: '2–3 concrete next steps.' },
    cta: { type: 'string', description: 'A warm, direct call to action.' },
  },
  required: [
    'title', 'greeting', 'summary', 'situation', 'approach',
    'phases', 'tradeoffs', 'investment', 'scope', 'nextSteps', 'cta',
  ],
} as const

function systemPrompt(input: OfferInput): string {
  const lang = input.language === 'fi' ? 'Finnish' : 'English'
  return [
    `You are a world-class independent consultant writing a proposal for ${input.sender.name}`,
    `(${input.sender.title ?? 'AI & automation consultant'}), who builds AI, automation and web`,
    `systems for SMEs. Write a phased proposal based on the CRM data provided.`,
    ``,
    `Write entirely in ${lang}. Currency is "${input.currency}".`,
    `Structure: a short situation broken into named problems, a framing of the approach,`,
    `then a phased path (Vaihe 0 määrittely / scoping first, then delivery phases). Each phase`,
    `carries its own goal, concrete deliverables, what changes for the client, duration and price.`,
    `Where useful, include a few honest "how it's built" trade-offs (choice / why / lighter alternative).`,
    `End with clear scope boundaries and ownership terms.`,
    ``,
    `Be sharp and concise — a sharp independent consultant, not a corporate template.`,
    `Cut filler: no "we are pleased to", no restating the obvious, no padding. Every sentence earns its place.`,
    `Be honest about what each phase does NOT solve. Scale the number of phases to the deal size —`,
    `a small, simple engagement is a single phase, not three.`,
    `Ground pricing in the prospect's stated budget when given; otherwise give indicative "alkaen X" ranges.`,
  ].join('\n')
}

function userPrompt(input: OfferInput): string {
  const parts: string[] = []
  const add = (label: string, v?: string) => v && parts.push(`${label}: ${v}`)
  const addList = (label: string, v: string[]) => v.length && parts.push(`${label}: ${v.join('; ')}`)
  add('Company', input.company)
  add('Contact', input.contactName)
  add('Industry', input.industry)
  addList('Requested services', input.services)
  addList('Pain points', input.painPoints)
  addList('Goals', input.goals)
  add('Budget', input.budget)
  add('Timeline', input.timeline)
  add('Notes from CRM', input.notes)
  return parts.length ? parts.join('\n') : 'No structured details were provided; write a strong general proposal.'
}

type AIOffer = Pick<
  Offer,
  'title' | 'greeting' | 'summary' | 'situation' | 'approach' | 'phases' | 'tradeoffs' | 'investment' | 'scope' | 'nextSteps' | 'cta'
>

/**
 * Generate an offer. Uses Claude when a key is configured, and always falls
 * back to the deterministic template on missing key, SDK, or any error — so
 * the endpoint never fails to return an offer.
 */
export async function generateOffer(input: OfferInput, env: OfferEnv): Promise<Offer> {
  const fallback = buildOffer(input)
  if (!env.ANTHROPIC_API_KEY) return fallback

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: env.OFFER_MODEL || 'claude-opus-5',
      max_tokens: 8000,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium', format: { type: 'json_schema', schema: AI_SCHEMA } },
      system: systemPrompt(input),
      messages: [{ role: 'user', content: userPrompt(input) }],
    } as never)

    if ((message as { stop_reason?: string }).stop_reason === 'refusal') return fallback

    const text = (message as { content: Array<{ type: string; text?: string }> }).content
      .filter((b) => b.type === 'text' && b.text)
      .map((b) => b.text as string)
      .join('')
    if (!text.trim()) return fallback

    const ai = JSON.parse(text) as AIOffer
    return mergeOffer(fallback, ai)
  } catch {
    // Network error, no SDK, bad JSON — the deterministic offer still ships.
    return fallback
  }
}

// Merge the model's creative fields onto the deterministic skeleton, keeping
// computed fields (id, dates, sender, recipient) and guarding every field so a
// partial model response can't produce a broken offer.
function mergeOffer(base: Offer, ai: AIOffer): Offer {
  const str = (v: unknown, fb: string) => (typeof v === 'string' && v.trim() ? v : fb)
  const optStr = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined)
  const strList = (v: unknown, fb: string[]) =>
    Array.isArray(v) && v.length ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()) : fb

  const situation =
    Array.isArray(ai.situation) && ai.situation.length
      ? ai.situation
          .filter((s): s is { title: string; body: string } => !!s && typeof s === 'object')
          .map((s) => ({ title: str(s.title, ''), body: str(s.body, '') }))
          .filter((s) => s.title || s.body)
      : base.situation

  const phases =
    Array.isArray(ai.phases) && ai.phases.length
      ? ai.phases
          .filter((p): p is AIOffer['phases'][number] => !!p && typeof p === 'object')
          .map((p) => ({
            name: str(p.name, ''),
            goal: optStr(p.goal),
            includes: strList(p.includes, []),
            outcome: optStr(p.outcome),
            duration: optStr(p.duration),
            price: optStr(p.price),
          }))
          .filter((p) => p.name && p.includes.length)
      : base.phases

  const tradeoffs = Array.isArray(ai.tradeoffs)
    ? ai.tradeoffs
        .filter((t): t is { choice: string; why: string; alternative?: string } => !!t && typeof t === 'object')
        .map((t) => ({ choice: str(t.choice, ''), why: str(t.why, ''), alternative: optStr(t.alternative) }))
        .filter((t) => t.choice && t.why)
    : base.tradeoffs

  return {
    ...base,
    aiGenerated: true,
    title: str(ai.title, base.title),
    greeting: str(ai.greeting, base.greeting),
    summary: str(ai.summary, base.summary),
    situation: situation.length ? situation : base.situation,
    approach: str(ai.approach, base.approach),
    phases: phases.length ? phases : base.phases,
    tradeoffs,
    investment: {
      summary: str(ai.investment?.summary, base.investment.summary),
      total: optStr(ai.investment?.total),
      paymentTerms: optStr(ai.investment?.paymentTerms) ?? base.investment.paymentTerms,
      note: optStr(ai.investment?.note) ?? base.investment.note,
    },
    scope: {
      excludes: strList(ai.scope?.excludes, base.scope.excludes),
      ownership: optStr(ai.scope?.ownership) ?? base.scope.ownership,
    },
    nextSteps: strList(ai.nextSteps, base.nextSteps),
    cta: str(ai.cta, base.cta),
  }
}
