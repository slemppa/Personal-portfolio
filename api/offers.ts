import { normalizeInput, offerToMarkdown, encodeOfferToken, decodeOfferToken } from './_lib/offer.js'
import { generateOffer } from './_lib/offerAI.js'
import { storeOffer, getStoredOffer, listOffers } from './_lib/offerStore.js'

// Vercel serverless function: the offer-sharing endpoint.
//
//   POST /api/offers            — send CRM data, get a polished offer + share link.
//   GET  /api/offers?id=...     — resolve a short-link offer (stored in Neon).
//   GET  /api/offers?token=...  — resolve a stateless token offer (no DB).
//   GET  /api/offers?list=1     — list stored offers (requires OFFER_API_KEY).
//
// Storage is optional: with DATABASE_URL set, offers are stored in Neon and get
// short links (/tarjous/<id>); without it, the whole offer is packed into the
// returned token and shared via /tarjous#<token> — no database required.
// Set ANTHROPIC_API_KEY for Claude-written offers; OFFER_API_KEY to protect POST.

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

function query(req: Req, name: string): string | undefined {
  const v = req.query?.[name]
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

  if (req.method === 'GET') {
    // Admin list — protected.
    if (query(req, 'list') !== undefined) {
      if (!authorized(req)) {
        res.status(401).json({ error: 'unauthorized' })
        return
      }
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ offers: await listOffers() })
      return
    }

    // Resolve a stored offer by short id, or a stateless token.
    const id = query(req, 'id')
    const token = query(req, 'token')
    const offer = id ? await getStoredOffer(id) : token ? decodeOfferToken(token) : null
    if (!offer) {
      res.status(404).json({ error: 'not_found' })
      return
    }
    res.setHeader('Cache-Control', id ? 'public, max-age=300' : 'public, max-age=86400, immutable')
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

    // Prefer a short link (stored in Neon); fall back to a stateless token.
    const id = await storeOffer(offer)
    const token = encodeOfferToken(offer)
    const shareUrl = id ? `${baseUrl(req)}/tarjous/${id}` : `${baseUrl(req)}/tarjous#${token}`

    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      offer,
      id,
      token,
      shareUrl,
      markdown: offerToMarkdown(offer),
    })
  } catch (err) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(500).json({ error: 'offer_generation_failed', detail: String(err) })
  }
}
