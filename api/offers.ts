import { normalizeInput, offerToMarkdown, encodeOfferToken, decodeOfferToken } from './_lib/offer.js'
import { generateOffer } from './_lib/offerAI.js'

// Vercel serverless function: the offer-sharing endpoint.
//
//   POST /api/offers   — send CRM data, get back a polished offer + share link.
//   GET  /api/offers?token=... — resolve a shared offer token back to JSON.
//
// Offers are stateless: the whole offer is packed into the returned token and
// shared via the /tarjous#<token> page, so no database is required. Set
// ANTHROPIC_API_KEY to have Claude write the offer; without it, a strong
// deterministic template is used. Set OFFER_API_KEY to require a bearer token.

type Req = {
  method?: string
  headers?: Record<string, string | string[] | undefined>
  body?: unknown
  query?: Record<string, string | string[] | undefined>
  url?: string
}
type Res = {
  setHeader: (k: string, v: string) => void
  status: (n: number) => Res
  json: (b: unknown) => void
  end: (b?: string) => void
}

function header(req: Req, name: string): string | undefined {
  const v = req.headers?.[name.toLowerCase()]
  return Array.isArray(v) ? v[0] : v
}

function setCors(res: Res): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key')
}

function authorized(req: Req): boolean {
  const required = process.env.OFFER_API_KEY
  if (!required) return true // open by default
  const bearer = header(req, 'authorization')?.replace(/^Bearer\s+/i, '')
  return bearer === required || header(req, 'x-api-key') === required
}

function baseUrl(req: Req): string {
  const proto = header(req, 'x-forwarded-proto') ?? 'https'
  const host = header(req, 'x-forwarded-host') ?? header(req, 'host') ?? 'localhost'
  return `${proto}://${host}`
}

function parseBody(body: unknown): unknown {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return {}
    }
  }
  return body ?? {}
}

export default async function handler(req: Req, res: Res): Promise<void> {
  setCors(res)

  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  // GET: resolve a share token back into the offer (used by the /tarjous page
  // as a fallback and for programmatic access).
  if (req.method === 'GET') {
    const tokenQ = req.query?.token
    const token = Array.isArray(tokenQ) ? tokenQ[0] : tokenQ
    const offer = token ? decodeOfferToken(token) : null
    if (!offer) {
      res.status(400).json({ error: 'invalid_or_missing_token' })
      return
    }
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')
    res.status(200).json({ offer, markdown: offerToMarkdown(offer) })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' })
    return
  }

  if (!authorized(req)) {
    res.status(401).json({ error: 'unauthorized' })
    return
  }

  try {
    const input = normalizeInput(parseBody(req.body))
    const offer = await generateOffer(input, {
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      OFFER_MODEL: process.env.OFFER_MODEL,
    })
    const token = encodeOfferToken(offer)
    const shareUrl = `${baseUrl(req)}/tarjous#${token}`

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      offer,
      token,
      shareUrl,
      markdown: offerToMarkdown(offer),
    })
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(500).json({ error: 'offer_generation_failed', detail: String(err) })
  }
}
