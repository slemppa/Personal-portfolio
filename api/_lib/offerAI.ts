// The AI path for offer generation. When ANTHROPIC_API_KEY is set, Claude
// writes the creative parts of the offer; otherwise (or on any error) we fall
// back to the deterministic buildOffer(). The SDK is imported dynamically so
// the deterministic path — and the tests — never need the dependency loaded.

import { buildOffer, type Offer, type OfferInput } from './offer.js'

type OfferEnv = { ANTHROPIC_API_KEY?: string; OFFER_MODEL?: string }

// Only the creative fields come from the model; ids/dates/sender are computed.
const AI_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    title: { type: 'string', description: 'Short offer title, e.g. "Proposal – Acme".' },
    greeting: { type: 'string', description: 'One-line greeting to the recipient.' },
    summary: { type: 'string', description: 'One-paragraph executive summary.' },
    understanding: { type: 'string', description: 'Your reading of their situation and needs.' },
    approach: { type: 'string', description: 'The proposed approach, in prose.' },
    deliverables: {
      type: 'array',
      description: '3–5 concrete deliverables.',
      items: {
        type: 'object',
        additionalProperties: false,
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
        },
        required: ['title', 'description'],
      },
    },
    timeline: { type: 'string', description: 'Delivery timeline in one or two sentences.' },
    investment: {
      type: 'object',
      additionalProperties: false,
      properties: {
        summary: { type: 'string' },
        note: { type: 'string', description: 'Fine print, e.g. VAT note.' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            properties: {
              title: { type: 'string' },
              description: { type: 'string' },
              price: { type: 'string', description: 'Indicative price string, e.g. "from 2 000 €".' },
            },
            required: ['title', 'description', 'price'],
          },
        },
      },
      required: ['summary', 'note', 'items'],
    },
    whyMe: { type: 'array', items: { type: 'string' }, description: '3 reasons to choose Sami.' },
    nextSteps: { type: 'array', items: { type: 'string' }, description: '3 concrete next steps.' },
    cta: { type: 'string', description: 'A warm, direct call to action.' },
  },
  required: [
    'title', 'greeting', 'summary', 'understanding', 'approach',
    'deliverables', 'timeline', 'investment', 'whyMe', 'nextSteps', 'cta',
  ],
} as const

function systemPrompt(input: OfferInput): string {
  const lang = input.language === 'fi' ? 'Finnish' : 'English'
  return [
    `You are a world-class B2B proposal writer working for ${input.sender.name}`,
    `(${input.sender.title ?? 'AI & automation consultant'}), who builds AI and automation`,
    `solutions for SMEs. Write the finest possible sales offer based on the CRM data provided.`,
    ``,
    `Write entirely in ${lang}. Currency is "${input.currency}".`,
    `Be specific to this prospect — reference their company, industry, and pain points.`,
    `Be concise and confident: no filler, no hedging, no generic "we are pleased to" boilerplate.`,
    `Ground pricing in the prospect's stated budget when given; otherwise give indicative "from X" ranges.`,
    `Sound like a sharp independent consultant, not a corporate template.`,
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
  return parts.length ? parts.join('\n') : 'No structured details were provided; write a strong general offer.'
}

type AIOffer = Pick<
  Offer,
  'title' | 'greeting' | 'summary' | 'understanding' | 'approach' | 'deliverables' | 'timeline' | 'investment' | 'whyMe' | 'nextSteps' | 'cta'
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
      max_tokens: 6000,
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
  const items = (v: unknown, fb: Offer['deliverables']) =>
    Array.isArray(v) && v.length
      ? v
          .filter((x): x is { title: string; description: string; price?: string } => !!x && typeof x === 'object')
          .map((x) => ({
            title: str(x.title, ''),
            description: str(x.description, ''),
            ...(typeof x.price === 'string' && x.price.trim() ? { price: x.price } : {}),
          }))
          .filter((x) => x.title || x.description)
      : fb
  const strList = (v: unknown, fb: string[]) =>
    Array.isArray(v) && v.length ? v.filter((x) => typeof x === 'string' && x.trim()) : fb

  return {
    ...base,
    aiGenerated: true,
    title: str(ai.title, base.title),
    greeting: str(ai.greeting, base.greeting),
    summary: str(ai.summary, base.summary),
    understanding: str(ai.understanding, base.understanding),
    approach: str(ai.approach, base.approach),
    deliverables: items(ai.deliverables, base.deliverables),
    timeline: str(ai.timeline, base.timeline),
    investment: {
      summary: str(ai.investment?.summary, base.investment.summary),
      items: items(ai.investment?.items, base.investment.items),
      note: str(ai.investment?.note, base.investment.note ?? ''),
    },
    whyMe: strList(ai.whyMe, base.whyMe),
    nextSteps: strList(ai.nextSteps, base.nextSteps),
    cta: str(ai.cta, base.cta),
  }
}
