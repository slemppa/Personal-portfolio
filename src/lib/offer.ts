// Client-side types + token decoding for shared offers. Mirrors the Offer
// shape in api/_lib/offer.ts; kept separate so the app build doesn't reach
// into /api. Offers are shared statelessly via a base64url token in the URL
// fragment (/tarjous#<token>), so decoding happens entirely in the browser.

export type OfferLang = 'fi' | 'en'

export type SituationPoint = { title: string; body: string }

export type OfferPhase = {
  name: string
  goal?: string
  includes: string[]
  outcome?: string
  duration?: string
  price?: string
}

export type OfferTradeoff = {
  choice: string
  why: string
  alternative?: string
}

export type OfferSender = {
  name: string
  title?: string
  email?: string
  company?: string
}

export type Offer = {
  id: string
  language: OfferLang
  title: string
  recipient: { company?: string; name?: string; email?: string }
  greeting: string
  summary: string
  situation: SituationPoint[]
  approach: string
  phases: OfferPhase[]
  tradeoffs: OfferTradeoff[]
  investment: {
    summary: string
    total?: string
    paymentTerms?: string
    note?: string
  }
  scope: { excludes: string[]; ownership?: string }
  nextSteps: string[]
  cta: string
  validUntil: string
  sender: OfferSender
  generatedAt: string
  aiGenerated: boolean
}

function fromBase64Url(token: string): string {
  const b64 = token.replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

/** Decode a share token into an Offer. Returns null on malformed input. */
export function decodeOfferToken(token: string): Offer | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token.trim())) as Offer
    if (!parsed || typeof parsed !== 'object' || !parsed.title || !parsed.language) return null
    return parsed
  } catch {
    return null
  }
}

/** Read the offer token from the URL fragment (#...) or ?t= query param. */
export function offerTokenFromLocation(loc: { hash: string; search: string }): string | null {
  const hash = loc.hash.replace(/^#/, '').trim()
  if (hash) return hash
  const q = new URLSearchParams(loc.search).get('t')
  return q?.trim() || null
}

/** Fetch a stored offer by its short id (from a /tarjous/<id> link). */
export async function fetchStoredOffer(id: string, signal?: AbortSignal): Promise<Offer | null> {
  try {
    const res = await fetch(`/api/offers?id=${encodeURIComponent(id)}`, { signal })
    if (!res.ok) return null
    const body = (await res.json()) as { offer?: Offer }
    return body.offer ?? null
  } catch {
    return null
  }
}
